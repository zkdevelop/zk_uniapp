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
          to: 20,
        })
      } else {
        response = await getHistoryChatMessages({
          opponentId: chatInfo.value.id,
          from: 0,
          to: 20,
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
    console.log("开始映射私聊消息:", msg)
    let content = msg.content
    let type = msg.type.toLowerCase()

    if (type === "position") {
      try {
        content = JSON.parse(msg.content)
        type = "location"
      } catch (e) {
        console.log("解析位置数据失败:", e)
      }
    } else if (type === "image") {
      content = msg.previewUrl || msg.content
    } else if (type === "text" && msg.content.toLowerCase().endsWith(".txt")) {
      type = "file"
    } else if (type === "audio" || type === "video") {
      content = msg.previewUrl || msg.content
    }

    const userInfo = await loadAndCacheUserInfo(msg.senderId)
    const avatarUrl = userInfo
      ? userInfo.avatarUrl
      : msg.senderId === chatInfo.value.id
        ? chatInfo.value.avatar && chatInfo.value.avatar[0]
          ? chatInfo.value.avatar[0]
          : ""
        : chatInfo.value._selfAvatar || ""

    const mappedMessage = {
      id: msg.id,
      content: content,
      userType: msg.senderId === chatInfo.value.id ? "other" : "self",
      avatar: avatarUrl,
      timestamp: new Date(msg.date),
      type: type,
      isRead: msg.readFlag,
      messageType: msg.type,
      selfDestruct: msg.isSelfDestruct,
    }

    console.log("私聊消息映射结果:", mappedMessage)
    return mappedMessage
  }

  // 映射群聊消息
  const mapGroupMessage = (msg) => {
    let content = msg.message || msg.content
    let type = (msg.messageType || msg.type || "").toLowerCase()

    if (type === "position") {
      try {
        content = JSON.parse(content)
        type = "location"
      } catch (e) {
        console.log("解析位置数据失败:", e)
      }
    } else if (type === "image") {
      content = msg.previewUrl || content
    } else if (type === "text" && content.toLowerCase().endsWith(".txt")) {
      type = "file"
    } else if (type === "audio" || type === "video") {
      content = msg.previewUrl || content
    }

    // 从 groupStore 中获取群组信息
    const groupInfo = groupStore.state.groupInfo
    let avatar = chatInfo.value._selfAvatar // 默认头像
    let senderName = "未知用户"

    if (groupInfo && groupInfo.groupMembers) {
      const sender = groupInfo.groupMembers.find((member) => member.userId === msg.senderId)
      if (sender) {
        avatar = sender.avatarUrl || ""
        senderName = sender.userName || "未知用户"
      }
    } else {
      console.log("群组信息不完整或未找到发送者")
    }

    const mappedMessage = {
      id: msg.id,
      content: content,
      userType: userStore.state.id === msg.senderId ? "self" : "other",
      avatar: avatar,
      timestamp: new Date(msg.sendTime || msg.date),
      type: type,
      isRead:
        Array.isArray(msg.groupMessageUserReadVO) &&
        msg.groupMessageUserReadVO.some((user) => user.userId === chatInfo.value.id && user.isRead),
      messageType: msg.messageType || msg.type,
      selfDestruct: msg.selfDestruct || msg.isSelfDestruct,
      senderName: senderName,
      senderId: msg.senderId,
      groupMessageUserReadVO: Array.isArray(msg.groupMessageUserReadVO) ? msg.groupMessageUserReadVO : [],
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
      groupStore.setGroupInfo(JSON.parse(cachedMembers))
    }

    try {
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
    console.log("收到WebSocket消息:", message, message.sessionId, chatInfo.value.id)
    if (message.sessionId === chatInfo.value.id || message.senderId === chatInfo.value.id) {
      if (!message.type) {
        console.log("收到的消息缺少类型信息:", message)
        return
      }
      const isGroupMessage = chatInfo.value.type === "group"
      let mappedMessage

      console.log("处理消息类型:", isGroupMessage ? "群聊" : "私聊")
      if (isGroupMessage) {
        // 为群聊消息添加必要的字段
        const messageWithReadInfo = {
          ...message,
          groupMessageUserReadVO: message.groupMessageUserReadVO || [],
          messageType: message.type,
          sendTime: message.date,
        }
        mappedMessage = mapGroupMessage(messageWithReadInfo)
      } else {
        console.log("开始处理私聊消息:", message)
        mappedMessage = await mapPrivateMessage(message)
        console.log("私聊消息处理结果:", mappedMessage)
      }

      if (mappedMessage) {
        console.log("插入新消息到列表")
        list.value.push(mappedMessage)
        saveCachedData(list.value)
      } else {
        console.log("消息映射失败，无法插入")
      }
    } else {
      console.log("收到的消息不属于当前对话")
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

