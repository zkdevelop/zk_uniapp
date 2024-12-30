// contacts.js

import request from '/utils/request.js'

export const searchUsers = (params) => {
  return request({
    url: '/user/searchUsers',
    method: 'post',
    data: params
  })
}

// 创建群组
export const createGroup = (params) => {
  return request({
    url: '/group/create',
    method: 'post',
    data: params
  })
}

