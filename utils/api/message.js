import request from '/utils/request.js'
import {backendHost} from '/config.js';

// 获取聊天列表
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

// 向用户发送消息
export const sendMessageToUser = (data) => {
  // 发送POST请求发送消息
  return request({
    url: '/message/send/user',
    method: 'post',
    data: {
      isPosition: data.isPosition !== undefined ? data.isPosition : false,
      isSelfDestruct: data.isSelfDestruct !== undefined ? data.isSelfDestruct : false,
      message: data.message,
      recipientId: data.recipientId
    }
  })
}

// 向用户发送文件
export const sendFilesToUser = (data) => {
  return new Promise((resolve, reject) => {
    if (!data.files || data.files.length === 0) {
      reject(new Error('没有要上传的文件'));
      return;
    }

    const file = data.files[0];
    const uploadTask = uni.uploadFile({
      url: backendHost + '/message/send/files', // 更新为正确的后端上传接口地址
      filePath: file.path || file,
      name: 'files',
      header: {
        'Authorization': 'Bearer ' + uni.getStorageSync('token')
      },
      formData: {
        isGroup: data.isGroup,
        isSelfDestruct: data.isSelfDestruct,
        latitude: data.latitude,
        longitude: data.longitude,
        missionId: data.missionId,
        receptionId: data.receptionId
      },
      success: (uploadFileRes) => {
        console.log('服务器原始响应:', uploadFileRes);
        if (uploadFileRes.statusCode === 404) {
          reject(new Error('服务器端点未找到 (404)'));
          return;
        }
        if (uploadFileRes.statusCode !== 200) {
          reject(new Error(`服务器返回错误状态码: ${uploadFileRes.statusCode}`));
          return;
        }
        try {
          let response;
          if (typeof uploadFileRes.data === 'string' && uploadFileRes.data.trim() !== '') {
            response = JSON.parse(uploadFileRes.data);
          } else if (typeof uploadFileRes.data === 'object') {
            response = uploadFileRes.data;
          } else {
            throw new Error('服务器返回了空响应或无效的JSON');
          }
          console.log('解析后的响应:', response);
          resolve(response);
        } catch (error) {
          console.error('解析服务器响应失败:', error);
          reject(new Error('解析服务器响应失败'));
        }
      },
      fail: (error) => {
        console.error('上传失败:', error);
        reject(error);
      }
    });

    uploadTask.onProgressUpdate((res) => {
      console.log('上传进度', res.progress);
      console.log('已经上传的数据长度', res.totalBytesSent);
      console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
    });
  });
};

// 获取历史聊天消息
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