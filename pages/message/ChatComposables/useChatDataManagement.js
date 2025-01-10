import { ref } from 'vue'
import { getHistoryChatMessages, getGroupChatMessages } from '@/utils/api/message.js'
import { useUserStore } from '@/store/userStore'
import { useGroupStore } from '@/pages/message/store/groupStore'

export function useChatDataManagement(chatInfo, list) {
  const userStore = useUserStore()
  const groupStore = useGroupStore()

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
    // 立即加载缓存数据
    const cachedData = loadCachedData()
    if (cachedData) {
      list.value = cachedData
      console.log('已加载缓存数据')
    }

    try {
      let response
      if (chatInfo.value.type === 'group') {
        response = await getGroupChatMessages({
          opponentId: chatInfo.value.id,
          from: 0,
          to: 10
        })
      } else {
        response = await getHistoryChatMessages({
          opponentId: chatInfo.value.id,
          from: 0,
          to: 10,
          missionId: chatInfo.value.missionId
        })
      }

      if (response.code === 200) {
        let newMessages
        if (chatInfo.value.type === 'group') {
          newMessages = response.data.groupMessageVOS.reverse().map(msg => mapGroupMessage(msg))
        } else {
          newMessages = response.data.messageVOList.reverse().map(msg => mapPrivateMessage(msg))
        }

        const hasChanges = compareMessages(newMessages, list.value)
        if (hasChanges) {
          list.value = newMessages
          saveCachedData(newMessages)
          console.log('消息列表已更新并缓存')
        } else {
          console.log('消息列表无变化')
        }
      } else {
        console.log('获取新消息失败:', response.msg)
      }
    } catch (error) {
      console.log('获取新消息出错:', error)
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
  const mapPrivateMessage = (msg) => {
    let content = msg.message
    let type = msg.messageType.toLowerCase()

    if (type === 'position') {
      try {
        content = JSON.parse(msg.message)
        type = 'location'
      } catch (e) {
        console.log('解析位置数据失败:', e)
      }
    } else if (type === 'image') {
      content = msg.previewUrl || msg.message
    } else if (type === 'text' && msg.message.toLowerCase().endsWith('.txt')) {
      type = 'file'
    } else if (type === 'audio' || type === 'voice_message') {
      content = msg.previewUrl || msg.message
    }

    const mappedMessage = {
      id: msg.id,
      content: content,
      userType: msg.senderId === chatInfo.value.id ? 'other' : 'self',
      avatar: msg.senderId === chatInfo.value.id ? chatInfo.value.avatar[0] : chatInfo.value._selfAvatar,
      timestamp: new Date(msg.sendTime),
      type: type,
      isRead: msg.isRead,
      messageType: msg.messageType,
      selfDestruct: msg.selfDestruct
    }

    return mappedMessage
  }

  // 映射群聊消息
  const mapGroupMessage = (msg) => {
    let content = msg.message
    let type = msg.messageType.toLowerCase()

    if (type === 'position') {
      try {
        content = JSON.parse(msg.message)
        type = 'location'
      } catch (e) {
        console.log('解析位置数据失败:', e)
      }
    } else if (type === 'image') {
      content = msg.previewUrl || msg.message
    } else if (type === 'text' && msg.message.toLowerCase().endsWith('.txt')) {
      type = 'file'
    } else if (type === 'audio' || type === 'voice_message') {
      content = msg.previewUrl || msg.message
    }

    // 从 groupStore 中获取群组信息
    const groupInfo = groupStore.state.groupInfo
    let avatar = chatInfo.value._selfAvatar // 默认头像

    if (groupInfo && groupInfo.groupMembers) {
      const sender = groupInfo.groupMembers.find(member => member.userId === msg.senderId)
      if (sender) {
        avatar = sender.avatarUrl
      }
    }

    const mappedMessage = {
      id: msg.id,
      content: content,
      userType: userStore.state.id === msg.senderId ? 'self' : 'other',
      avatar: avatar,
      timestamp: new Date(msg.sendTime),
      type: type,
      isRead: msg.groupMessageUserReadVO.some(user => user.userId === chatInfo.value.id && user.isRead),
      messageType: msg.messageType,
      selfDestruct: msg.selfDestruct,
      senderName: msg.groupMessageUserReadVO.find(user => user.userId === msg.senderId)?.userName || '未知用户'
    }
    console.log(mappedMessage, 'mappedMessage', msg.senderId, userStore.state.id)

    return mappedMessage
  }

  return {
    loadCachedData,
    saveCachedData,
    fetchAndUpdateData
  }
}

