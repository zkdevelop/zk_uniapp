import request from '/utils/request.js'

export const getChatList = (missionId = 'dc029035aec84fb5a88dd401a0942d50') => {
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