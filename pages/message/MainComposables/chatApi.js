// 导入获取聊天列表的API函数
import { getChatList } from '@/utils/api/message.js'

// 获取聊天列表的函数
export const fetchChatList = async (missionId) => {
  console.log('正在获取聊天列表，使用的 missionId:', missionId)
  if (!missionId) {
    console.log('fetchChatList 中 missionId 未设置')
    return null
  }
  try {
    const response = await getChatList(missionId)
    if (response.code === 200) {  
      const messages = response.data.map(item => ({
        ...item,
        avatar: item.avatar || '/static/message/defaultimg.png',
        preview: item.latestMessage,
        date: item.sendTime
      }))
      console.log('获取到的聊天列表:', messages)
      return messages
    } else {
      console.log('获取聊天列表失败:', response.msg)
      return null
    }
  } catch (error) {
    console.log('获取聊天列表时发生错误:', error)
    return null
  }
}

