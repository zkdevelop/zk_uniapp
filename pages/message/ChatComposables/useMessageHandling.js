import { nextTick } from "vue"
import {
  getHistoryChatMessages,
  sendMessageToUser,
  sendGroupMessage,
  sendFilesToUser,
  getGroupChatMessages,
} from "@/utils/api/message.js"
import { useUserStore } from "@/store/userStore"
import { useGroupStore } from "@/pages/message/store/groupStore" 

export function useMessageHandling(chatInfo, list, currentFrom, currentTo, hasMoreMessages, scrollToBottom) {
  const userStore = useUserStore()
  const groupStore = useGroupStore()

  let isLoadingHistory = false
  let lastLoadTime = 0
  const LOAD_COOLDOWN = 5000 // 5秒冷却时间

  const sendMessage = async (message) => {
    console.log("开始发送消息:", message)
    if (message.content && chatInfo.value && chatInfo.value.id) {
      try {
        let response
        const messageData = {
          message: typeof message.content === "object" ? JSON.stringify(message.content) : message.content,
          recipientId: chatInfo.value.id,
          messageType: message.type || "text",
          missionId: chatInfo.value.missionId,
          isPosition: message.type === "location",
          isSelfDestruct: chatInfo.value.isBurnAfterReadingMode,
        }

        console.log("准备发送消息数据:", messageData)

        if (chatInfo.value.type === "group") {
          console.log("发送群聊消息")
          response = await sendGroupMessage({
            ...messageData,
            isGroupAnnouncement: false,
          })
        } else {
          console.log("发送私聊消息")
          response = await sendMessageToUser(messageData)
        }

        console.log("消息发送响应:", response)

        if (response.code === 200) {
          const sentMessage = {
            ...response.data,
            selfDestruct: response.data.selfDestruct,
            content: message.content,
            userType: "self",
            timestamp: new Date(),
            type: message.type || "text",
            messageType: message.type === "text" ? "MESSAGE" : message.type.toUpperCase(),
          }
          handleMessageSent(sentMessage)
          await updateMessageList()
          nextTick(() => {
            scrollToBottom()
          })
        } else {
          throw new Error(response.msg || "发送消息失败")
        }
      } catch (error) {
        console.log("发送消息失败:", error)
      }
    } else {
      console.log("消息内容为空或 chatInfo 未正确初始化")
    }
  }

  const handleMessageSent = (sentMessage) => {
    console.log("添加已发送消息到列表")
    list.value.push(sentMessage)
  }

  const handleMessageFailed = (failedMessage) => {
    console.log("处理消息发送失败:", failedMessage)
    // 这里可以添加处理消息发送失败的逻辑
  }

  const loadHistoryMessages = async (isLoadingMore = false, newFrom = null, newTo = null) => {
    console.log("开始加载历史消息")
    const now = Date.now()
    if (isLoadingHistory || now - lastLoadTime < LOAD_COOLDOWN) {
      console.log("跳过加载历史消息：正在加载或冷却中")
      return
    }

    isLoadingHistory = true
    lastLoadTime = now

    if (!chatInfo.value || !chatInfo.value.id || !chatInfo.value.missionId) {
      console.log("聊天信息不完整，无法加载历史消息")
      hasMoreMessages.value = false
      isLoadingHistory = false
      return false
    }

    const from = newFrom !== null ? newFrom : currentFrom.value
    const to = newTo !== null ? newTo : currentTo.value

    console.log("加载历史消息参数:", { from, to, isLoadingMore })

    try {
      let response
      if (chatInfo.value.type === "group") {
        console.log("加载群聊历史消息")
        response = await getGroupChatMessages({
          opponentId: chatInfo.value.id,
          from,
          to,
        })
      } else {
        console.log("加载私聊历史消息")
        response = await getHistoryChatMessages({
          opponentId: chatInfo.value.id,
          from,
          to,
          missionId: chatInfo.value.missionId,
        })
      }

      console.log("历史消息加载响应:", response)

      if (response.code === 200) {
        let newMessages
        if (chatInfo.value.type === "group") {
          newMessages = response.data.groupMessageVOS.reverse().map((msg) => mapGroupMessage(msg))
        } else {
          newMessages = response.data.messageVOList.reverse().map((msg) => mapPrivateMessage(msg))
        }

        console.log("新消息数量:", newMessages.length)

        if (isLoadingMore) {
          console.log("添加新消息到列表前端")
          list.value = [...newMessages, ...list.value]
        } else {
          console.log("替换整个消息列表")
          list.value = newMessages
        }

        hasMoreMessages.value = newMessages.length === to - from + 1
        console.log("是否有更多消息:", hasMoreMessages.value)

        currentFrom.value = from
        currentTo.value = to

        console.log("更新后的消息列表长度:", list.value.length)

        if (!isLoadingMore) {
          nextTick(() => {
            scrollToBottom()
          })
        }

        return true
      } else {
        console.log("加载历史消息失败:", response.msg)
        hasMoreMessages.value = false
        uni.showToast({
          title: "加载历史消息失败",
          icon: "none",
        })
        return false
      }
    } catch (error) {
      console.log("加载历史消息出错:", error)
      hasMoreMessages.value = false
      uni.showToast({
        title: "网络错误，请稍后重试",
        icon: "none",
      })
      return false
    } finally {
      isLoadingHistory = false
      console.log("历史消息加载完成，消息列表:", list.value)
      console.log("历史消息加载完成")
    }
  }

  const updateMessageList = async () => {
    console.log("开始更新消息列表")
    if (isLoadingHistory) {
      console.log("正在加载历史消息，跳过更新")
      return
    }

    try {
      const latestMessageId = list.value.length > 0 ? list.value[list.value.length - 1].id : null
      console.log("最新消息ID:", latestMessageId)

      let response
      if (chatInfo.value.type === "group") {
        console.log("更新群聊消息列表")
        response = await getGroupChatMessages({
          opponentId: chatInfo.value.id,
          from: 0,
          to: 20, // 增加获取的消息数量
          lastMessageId: latestMessageId,
        })
      } else {
        console.log("更新私聊消息列表")
        response = await getHistoryChatMessages({
          opponentId: chatInfo.value.id,
          from: 0,
          to: 20, // 增加获取的消息数量
          missionId: chatInfo.value.missionId,
          lastMessageId: latestMessageId,
        })
      }

      console.log("更新消息列表响应:", response)

      if (response.code === 200) {
        let newMessages
        if (chatInfo.value.type === "group") {
          newMessages = response.data.groupMessageVOS.reverse().map((msg) => mapGroupMessage(msg))
        } else {
          newMessages = response.data.messageVOList.reverse().map((msg) => mapPrivateMessage(msg))
        }

        // 合并新消息和现有消息，去重
        const mergedMessages = [...list.value, ...newMessages]
        const uniqueMessages = Array.from(new Map(mergedMessages.map((item) => [item.id, item])).values())
        list.value = uniqueMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

        nextTick(() => {
          scrollToBottom()
        })
      } else {
        console.log("没有新消息或获取失败")
      }
    } catch (error) {
      console.log("更新消息列表出错:", error)
    }
  }

  const mapPrivateMessage = (msg) => {
    console.log("映射私聊消息:", msg)
    let content = msg.message
    let type = msg.messageType.toLowerCase()

    if (content === null) {
      content = ""
      console.log("警告: 消息内容为空", msg)
    }

    if (type === "position") {
      try {
        content = JSON.parse(msg.message)
        type = "location"
      } catch (e) {
        console.log("解析位置数据失败:", e)
      }
    } else if (type === "image") {
      content = msg.previewUrl || msg.message
    } else if (type === "text" && msg.message.toLowerCase().endsWith(".txt")) {
      type = "file"
    } else if (type === "audio" || type === "voice_message") {
      content = msg.previewUrl || msg.message
    }

    const mappedMessage = {
      id: msg.id,
      content: content,
      userType: msg.senderId === chatInfo.value.id ? "other" : "self",
      avatar: (() => {
        if (msg.senderId === chatInfo.value.id) {
          return chatInfo.value.avatar && chatInfo.value.avatar[0] ? chatInfo.value.avatar[0] : ""
        } else {
          const userInfo = userStore.state.userInfo
          return userInfo && userInfo.avatarUrl ? userInfo.avatarUrl : chatInfo.value._selfAvatar || ""
        }
      })(),
      timestamp: new Date(msg.sendTime),
      type: type,
      isRead: msg.isRead,
      messageType: msg.messageType,
      selfDestruct: msg.selfDestruct,
    }

    console.log("映射后的私聊消息:", mappedMessage)
    return mappedMessage
  }

 const mapGroupMessage = (msg) => {
   let content = msg.message
   let type = msg.messageType.toLowerCase()
 
   if (content === null) {
     content = ""
   }
 
   if (type === "position") {
     try {
       content = JSON.parse(msg.message)
       type = "location"
     } catch (e) {
       // 解析位置数据失败
     }
   } else if (type === "image") {
     content = msg.previewUrl || msg.message
   } else if (type === "text" && msg.message.toLowerCase().endsWith(".txt")) {
     type = "file"
   } else if (type === "audio" || type === "voice_message") {
     content = msg.previewUrl || msg.message
   }
 
   const groupInfo = groupStore.state.groupInfo
   let avatar = chatInfo.value._selfAvatar || ""
   let senderName = "未知用户"
 
   if (groupInfo && groupInfo.groupMembers) {
     const sender = groupInfo.groupMembers.find((member) => member.userId === msg.senderId)
     if (sender) {
       avatar = sender.avatarUrl || ""
       senderName = sender.userName || "未知用户"
     }
   }
 
   const mappedMessage = {
     id: msg.id,
     content: content,
     userType: userStore.state.id === msg.senderId ? "self" : "other",
     avatar: avatar,
     timestamp: new Date(msg.sendTime),
     type: type,
     isRead:
       Array.isArray(msg.groupMessageUserReadVO) &&
       msg.groupMessageUserReadVO.some((user) => user.userId === chatInfo.value.id && user.isRead),
     messageType: msg.messageType,
     selfDestruct: msg.selfDestruct,
     senderName: senderName,
     senderId: msg.senderId,
     groupMessageUserReadVO: Array.isArray(msg.groupMessageUserReadVO) ? msg.groupMessageUserReadVO : [],
   }
 
   return mappedMessage
 }

const handleFileSelected = async (fileInfo) => {
  if (!fileInfo || typeof fileInfo !== "object") {
    uni.showToast({
      title: "文件信息无效，请重试",
      icon: "none",
    })
    return
  }

  if (!fileInfo.path) {
    uni.showToast({
      title: "文件路径缺失，请重试",
      icon: "none",
    })
    return
  }

  try {
    const response = await sendFilesToUser({
      files: [fileInfo.path],
      isGroup: chatInfo.value.type === "group",
      isSelfDestruct: chatInfo.value.isBurnAfterReadingMode || false,
      latitude: chatInfo.value.currentLocation?.latitude || "0",
      longitude: chatInfo.value.currentLocation?.longitude || "0",
      missionId: chatInfo.value.missionId,
      receptionId: chatInfo.value.id,
      voiceMessage: fileInfo.fromVoiceInput || false,
    })

    if (response.code === 200) {
      await updateMessageList()
      nextTick(() => {
        scrollToBottom()
      })
    } else {
      throw new Error(response.msg || "发送文件消息失败")
    }
  } catch (error) {
    uni.showToast({
      title: "发送失败，请重试",
      icon: "none",
    })
  }
}

  const handleMessageDeleted = (messageId) => {
    console.log("处理消息删除:", messageId)
    const index = list.value.findIndex((msg) => msg.id === messageId)
    if (index !== -1) {
      list.value.splice(index, 1)
      console.log("消息已从列表中删除")
    } else {
      console.log("未找到要删除的消息")
    }
  }
 const getCurrentLocation = () => {
     return new Promise((resolve) => {
       uni.getLocation({
         type: "gcj02",
         success: (res) => {
           resolve({
             latitude: res.latitude.toString(),
             longitude: res.longitude.toString(),
           })
         },
         fail: () => {
           Toast({ 
             message: "获取位置失败，使用默认位置",
             type: "fail",
           })
           resolve({
             latitude: "0",
             longitude: "0",
           })
         },
         timeout: 2000,  
       })
     })
   }
  console.log("消息处理模块初始化完成")

  return {
	getCurrentLocation,
    sendMessage,
    handleMessageFailed,
    loadHistoryMessages,
    updateMessageList,
    handleFileSelected,
    handleMessageDeleted,
  }
}

