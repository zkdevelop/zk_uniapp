import { ref } from "vue"
import {
  getHistoryChatMessages,
  getGroupChatMessages,
  getGroupBasicInfo,
  getUserBasicInfo,
} from "@/utils/api/message.js"
import { useUserStore } from "@/store/userStore"
import { useGroupStore } from "@/pages/message/store/groupStore"
import { useWebSocket } from "@/pages/WebSocket/WebSocketService.vue"

export function useChatDataManagement(chatInfo, list) {
  const userStore = useUserStore()
  const groupStore = useGroupStore()
  const { isConnected, connect, disconnect, sendMessage } = useWebSocket()
  const isLoading = ref(false)
  const hasCachedMessages = ref(false)
  const isLoadingGroupInfo = ref(false)

  // 获取缓存键
  const getCacheKey = () => `chat_${chatInfo.value.type}_${chatInfo.value.id}`

  // 加载缓存数据
  const loadCachedData = () => {
    const cacheKey = getCacheKey()
    const cachedData = uni.getStorageSync(cacheKey)
    return cachedData ? JSON.parse(cachedData) : null
  }

  // 保存缓存数据
  const saveCachedData = (data) => {
    const cacheKey = getCacheKey()
    uni.setStorageSync(cacheKey, JSON.stringify(data))
  }

  // 获取并更新数据
  const fetchAndUpdateData = async () => {
    console.log("开始获取并更新数据:", {
      聊天类型: chatInfo.value.type,
      群组信息: groupStore.state.groupInfo,
    })
    try {
      if (chatInfo.value.type === "group") {
        // 获取群基本信息
        await loadAndCacheGroupMembers(chatInfo.value.id)
      }

      let response
      if (chatInfo.value.type === "group") {
        response = await getGroupChatMessages({
          opponentId: chatInfo.value.id,
          from: 0,
          to: 20, // 增加获取的消息数量
        })
      } else {
        response = await getHistoryChatMessages({
          opponentId: chatInfo.value.id,
          from: 0,
          to: 20, // 增加获取的消息数量
          missionId: chatInfo.value.missionId,
        })
      }

      if (response.code === 200) {
        let newMessages
        if (chatInfo.value.type === "group") {
          newMessages = await Promise.all(response.data.groupMessageVOS.reverse().map((msg) => mapGroupMessage(msg)))
        } else {
          newMessages = await Promise.all(response.data.messageVOList.reverse().map((msg) => mapPrivateMessage(msg)))
        }

        // 直接更新消息列表
        list.value = newMessages
        saveCachedData(newMessages)

        console.log("聊天数据更新:", {
          消息数量: newMessages.length,
          聊天类型: chatInfo.value.type,
        })
      }
    } catch (error) {
      console.log("获取新消息出错:", error)
    }
  }

  // 比较消息
  const compareMessages = (newMessages, oldMessages) => {
    if (newMessages.length !== oldMessages.length) return true
    for (let i = 0; i < newMessages.length; i++) {
      if (JSON.stringify(newMessages[i]) !== JSON.stringify(oldMessages[i])) {
        return true
      }
    }
    return false
  }

  // 映射私聊消息
  const mapPrivateMessage = async (msg) => {
    let content = msg.message
    let type = msg.messageType.toLowerCase()

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

    const userInfo = await loadAndCacheUserInfo(msg.senderId)
    const avatarUrl = userInfo
      ? userInfo.avatarUrl
      : msg.senderId === chatInfo.value.id
        ? chatInfo.value.avatar[0]
        : chatInfo.value._selfAvatar

    const mappedMessage = {
      id: msg.id,
      content: content,
      userType: msg.senderId === chatInfo.value.id ? "other" : "self",
      avatar: avatarUrl,
      timestamp: new Date(msg.sendTime),
      type: type,
      isRead: msg.isRead,
      messageType: msg.messageType,
      selfDestruct: msg.selfDestruct,
    }

    return mappedMessage
  }

  // 映射群聊消息
  const mapGroupMessage = (msg) => {
    let content = msg.message
    let type = msg.messageType.toLowerCase()

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

    // 从 groupStore 中获取群组信息
    const groupInfo = groupStore.state.groupInfo
    let avatar = chatInfo.value._selfAvatar // 默认头像
    let senderName = "未知用户"

    if (groupInfo && groupInfo.groupMembers) {
      const sender = groupInfo.groupMembers.find((member) => member.userId === msg.senderId)
      if (sender) {
        avatar = sender.avatarUrl
        senderName = sender.userName
      }
    }

    console.log("映射群聊消息:", {
      发送者ID: msg.senderId,
      发送者名称: senderName,
      群组信息: groupInfo,
      消息内容: content,
    })

    const mappedMessage = {
      id: msg.id,
      content: content,
      userType: userStore.state.id === msg.senderId ? "self" : "other",
      avatar: avatar,
      timestamp: new Date(msg.sendTime),
      type: type,
      isRead: msg.groupMessageUserReadVO.some((user) => user.userId === chatInfo.value.id && user.isRead),
      messageType: msg.messageType,
      selfDestruct: msg.selfDestruct,
      senderName: senderName,
      senderId: msg.senderId,
      groupMessageUserReadVO: msg.groupMessageUserReadVO,
    }

    return mappedMessage
  }

  // 加载并缓存群组成员信息
  const loadAndCacheGroupMembers = async (groupId) => {
    if (isLoadingGroupInfo.value) {
      console.log("正在获取群组信息，跳过重复请求")
      return
    }

    isLoadingGroupInfo.value = true
    const cacheKey = `group_members_${groupId}`
    const cachedMembers = uni.getStorageSync(cacheKey)

    if (cachedMembers) {
      console.log("使用缓存的群成员信息")
      groupStore.setGroupInfo(JSON.parse(cachedMembers))
    }

    try {
      console.log("从服务器获取群成员信息")
      const response = await getGroupBasicInfo(groupId)
      if (response.code === 200) {
        const groupInfo = {
          id: response.data.id,
          groupName: response.data.groupName,
          groupMembers: response.data.groupMembers,
        }
        groupStore.setGroupInfo(groupInfo)
        uni.setStorageSync(cacheKey, JSON.stringify(groupInfo))
        return groupInfo
      } else {
        console.log("获取群组信息失败:", response.msg)
        return cachedMembers ? JSON.parse(cachedMembers) : null
      }
    } catch (error) {
      console.log("获取群组信息时发生错误:", error)
      return cachedMembers ? JSON.parse(cachedMembers) : null
    } finally {
      isLoadingGroupInfo.value = false
    }
  }

  // 加载并缓存用户信息
  const loadAndCacheUserInfo = async (userId) => {
    const cacheKey = `user_info_${userId}`
    const cachedUserInfo = uni.getStorageSync(cacheKey)

    if (cachedUserInfo) {
      console.log("使用缓存的用户信息")
      return JSON.parse(cachedUserInfo)
    }

    try {
      console.log("从服务器获取用户信息")
      const response = await getUserBasicInfo(userId)
      if (response.code === 200) {
        const userInfo = response.data
        uni.setStorageSync(cacheKey, JSON.stringify(userInfo))
        return userInfo
      } else {
        console.log("获取用户信息失败:", response.msg)
        return null
      }
    } catch (error) {
      console.log("获取用户信息时发生错误:", error)
      return null
    }
  }

  // 插入新消息并更新缓存
  const insertNewMessage = (newMessage) => {
    console.log("插入新消息:", newMessage)
    list.value.push(newMessage)
    saveCachedData(list.value)
  }

  // 处理WebSocket消息
  const handleWebSocketMessage = async (message) => {
    console.log("收到WebSocket消息:", message)
    if (message.sessionId === chatInfo.value.id) {
      const isGroupMessage = message.senderId !== message.sessionId
      const mappedMessage = await (isGroupMessage ? mapGroupMessage(message) : mapPrivateMessage(message))
      insertNewMessage(mappedMessage)
    } else {
      console.log("收到的消息不属于当前对话")
    }
  }

  // 映射WebSocket消息
  const mapWebSocketMessage = (msg, isGroupMessage) => {
    let type = msg.type.toLowerCase()
    let content = msg.content

    if (type === "position") {
      try {
        content = JSON.parse(msg.content)
        type = "location"
      } catch (e) {
        console.log("解析位置数据失败:", e)
      }
    }

    let avatar = ""
    let senderName = ""

    if (isGroupMessage) {
      const groupInfo = groupStore.state.groupInfo
      if (groupInfo && groupInfo.groupMembers) {
        const sender = groupInfo.groupMembers.find((member) => member.userId === msg.senderId)
        if (sender) {
          avatar = sender.avatarUrl
          senderName = sender.userName
        } else {
          console.log("未找到发送者信息，使用默认值")
          avatar = ""
          senderName = "未知用户"
        }
      } else {
        console.log("群组信息不完整，使用默认值")
        avatar = ""
        senderName = "未知用户"
      }
    } else {
      avatar = chatInfo.value.avatar
      senderName = msg.title
    }

    return {
      id: msg.id,
      content: content,
      userType: msg.senderId === userStore.state.id ? "self" : "other",
      avatar: avatar,
      timestamp: new Date(msg.date),
      type: type,
      isRead: false,
      messageType: msg.type,
      selfDestruct: msg.isSelfDestruct,
      senderName: senderName,
      senderId: msg.senderId,
    }
  }

  // 初始化WebSocket监听
  const initWebSocketListener = () => {
    uni.$on("newChatMessage", handleWebSocketMessage)
  }

  // 清理WebSocket监听
  const cleanupWebSocketListener = () => {
    uni.$off("newChatMessage", handleWebSocketMessage)
  }

  return {
    loadCachedData,
    saveCachedData,
    fetchAndUpdateData,
    loadAndCacheGroupMembers,
    isLoadingGroupInfo,
    insertNewMessage,
    handleWebSocketMessage,
    initWebSocketListener,
    cleanupWebSocketListener,
    loadAndCacheUserInfo,
  }
}

