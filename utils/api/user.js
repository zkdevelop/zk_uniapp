// 引入 request 文件
import request from '/utils/request.js'
 
// 用户登录
export const login = (params) => {
	return request({
		url: `/user/login?account=${params.account}&password=${params.password}`,
		method: 'post',
	})
}
// 用户注册
export const register = (params) => {
	return request({
		url: '/user/register',
		method: 'post',
		data:params
	})
}