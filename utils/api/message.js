import request from '/utils/request.js'

export const getChatList = (missionId) => {
  if (!missionId) {
    console.error('getChatList 需要 missionId 参数');
    return Promise.reject(new Error('getChatList 需要 missionId 参数'));
  }
  return request({
    url: `/message/chatList/${missionId}`,
    method: 'get'
  })
}

export const sendMessageToUser = (data) => {
  return request({
    url: '/message/send/user',
    method: 'post',
    data: {
      message: data.message,
      recipientId: data.recipientId
    }
  })
}

export const getHistoryChatMessages = (data) => {
  return request({
    url: '/message/read/single',
    method: 'post',
    data: {
      from: data.from,
      to: data.to,
      opponentId: data.opponentId
    }
  })
}