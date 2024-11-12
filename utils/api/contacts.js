// contacts.js

import request from '/utils/request.js'

export const searchUsers = (params) => {
  return request({
    url: '/user/searchUsers',
    method: 'post',
    data: params
  })
}
 