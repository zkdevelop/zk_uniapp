import request from '/utils/request.js'

/**
 * 获取聊天列表
 * @param {string} missionId - 任务ID
 * @returns {Promise} - 返回请求Promise
 */
export const getChatList = (missionId) => {
	missionId='1b2fdd7d0d4d4f91855602e687be632a'
  // 检查missionId是否存在
  if (!missionId) {
    console.error('getChatList 需要 missionId 参数');
    return Promise.reject(new Error('getChatList 需要 missionId 参数'));
  }
  // 发送GET请求获取聊天列表
  return request({
    url: `/message/chatList/${missionId}`,
    method: 'get'
  })
}

/**
 * 向用户发送消息
 * @param {Object} data - 消息数据
 * @param {boolean} [data.isPosition=false] - 是否为位置信息
 * @param {string} data.message - 消息内容
 * @param {string} data.recipientId - 接收者ID
 * @returns {Promise} - 返回请求Promise
 */
export const sendMessageToUser = (data) => {
  // 发送POST请求发送消息
  return request({
    url: '/message/send/user',
    method: 'post',
    data: {
      // 如果未提供isPosition，则默认为false
      isPosition: data.isPosition !== undefined ? data.isPosition : false,
      message: data.message,
      recipientId: data.recipientId
    }
  })
}

/**
 * 获取历史聊天消息
 * @param {Object} data - 查询参数
 * @param {string|number} data.from - 起始消息ID或时间戳
 * @param {string|number} data.to - 结束消息ID或时间戳
 * @param {string} data.opponentId - 对方用户ID
 * @returns {Promise} - 返回请求Promise
 */
export const getHistoryChatMessages = (data) => {
  // 发送POST请求获取历史消息
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