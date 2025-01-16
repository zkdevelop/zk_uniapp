import { ref } from 'vue'
import { getHistoryChatMessages, getGroupChatMessages, getGroupBasicInfo } from '@/utils/api/message.js'
import { useUserStore } from '@/store/userStore'
import { useGroupStore } from '@/pages/message/store/groupStore'

export function useChatDataManagement(chatInfo, list) {
  const userStore = useUserStore()
  const groupStore = useGroupStore()
  const isLoading = ref(false)
  const hasCachedMessages = ref(false)
  const isLoadingGroupInfo = ref(false) // Added: Track loading of group info

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
    console.log('开始获取并更新数据:', {
      聊天类型: chatInfo.value.type,
      群组信息: groupStore.state.groupInfo
    })
    try {
      if (chatInfo.value.type === 'group') {
        // 获取群基本信息
        await loadAndCacheGroupMembers(chatInfo.value.id);
      }

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
        }
        console.log('聊天数据更新:', {
          消息数量: newMessages.length,
          有变化: hasChanges,
          聊天类型: chatInfo.value.type
        });
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
        // 解析位置数据失败
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
    let senderName = '未知用户'

    if (groupInfo && groupInfo.groupMembers) {
      const sender = groupInfo.groupMembers.find(member => member.userId === msg.senderId)
      if (sender) {
        avatar = sender.avatarUrl
        senderName = sender.userName
      }
    }

    console.log('映射群聊消息:', {
      发送者ID: msg.senderId,
      发送者名称: senderName,
      群组信息: groupInfo,
      消息内容: content
    })

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
      senderName: senderName,
      senderId: msg.senderId
    }

    return mappedMessage
  }

  const loadAndCacheGroupMembers = async (groupId) => {
    if (isLoadingGroupInfo.value) {
      console.log('正在获取群组信息，跳过重复请求')
      return
    }

    isLoadingGroupInfo.value = true
    const cacheKey = `group_members_${groupId}`
    const cachedMembers = uni.getStorageSync(cacheKey)

    if (cachedMembers) {
      console.log('使用缓存的群成员信息')
      groupStore.setGroupInfo(JSON.parse(cachedMembers))
    }

    try {
      console.log('从服务器获取群成员信息')
      const response = await getGroupBasicInfo(groupId)
      if (response.code === 200) {
        const groupInfo = {
          id: response.data.id,
          groupName: response.data.groupName,
          groupMembers: response.data.groupMembers
        }
        groupStore.setGroupInfo(groupInfo)
        uni.setStorageSync(cacheKey, JSON.stringify(groupInfo))
        return groupInfo
      } else {
        console.log('获取群组信息失败:', response.msg)
        return cachedMembers ? JSON.parse(cachedMembers) : null
      }
    } catch (error) {
      console.log('获取群组信息时发生错误:', error)
      return cachedMembers ? JSON.parse(cachedMembers) : null
    } finally {
      isLoadingGroupInfo.value = false
    }
  }


  return {
    loadCachedData,
    saveCachedData,
    fetchAndUpdateData,
    loadAndCacheGroupMembers,
    isLoadingGroupInfo  
  }
}

