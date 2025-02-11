// 引入 request 文件
import request from '/utils/request.js'

// 用户登录
export const login = (params) => {
	const data = {
		account: params.account,
		password: params.password
	}
	return request({
		// url: `/user/login?account=${params.account}&password=${params.password}`,
		url: `/user/login`,
		method: 'post',
		header: {
			'Authorization': ''
		},
		data
	})
}
// 用户注册
export const register = (params) => {
	return request({
		url: '/user/register',
		method: 'post',
		data: params
	})
}
// 退出登录
export const logout = (params) => {
	return request({
		url: '/user/logout',
		method: 'post',
	})
}

// 根据用户id查询用户信息
export const searchUser = (id) => {
	return request({
		url:`/user/search/${id}`,
		method:'get'
	})
}

/**
 * 判断用户是否在线
 * @param {userId} userId 
 * @returns 
 */
export function checkUserOnline(userId) {
  return request({
    method: "get",
    url: "/user/online",
    data: { userId:userId }
  });
}