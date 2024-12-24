// chatApi.js - 聊天相关的API调用

import { getChatList } from '@/utils/api/message.js'

// 获取聊天列表
export const fetchChatList = async (missionId, isLoading, realMessages) => {
  console.log('正在获取聊天列表，使用的 missionId:', missionId)
  if (!missionId) {
    console.error('fetchChatList 中 missionId 未设置')
    return
  }
  try {
    isLoading.value = true
    const response = await getChatList(missionId)
    if (response.code === 200) {  
      realMessages.value = response.data.map(item => ({
        ...item,
        avatar: item.avatar || '/static/message/默认头像.png',
        preview: item.latestMessage,
        date: item.sendTime
      }))
      console.log('获取到的聊天列表:', realMessages.value)
    } else {
      console.error('获取聊天列表失败:', response.msg)
    }
  } catch (error) {
    console.error('获取聊天列表时发生错误:', error)
  } finally {
    isLoading.value = false
  }
}

