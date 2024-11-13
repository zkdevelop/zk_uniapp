// utils/api/message.js

import request from '/utils/request.js'

export const getChatList = () => {
  return request({
    url: '/message/chatList',
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

// 新增的接口
export const getHistoryChatMessages = (data) => {
  return request({
    url: '/message/read/single',
    method: 'post',
    data: {
      opponentId: data.opponentId,
      pageParam: {
        curPage: data.curPage,
        pageSize: data.pageSize
      }
    }
  })
}