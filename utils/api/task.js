// 引入 request 文件
import request from '/utils/request.js'
 
// 获取任务信息
export const taskInfo = (params) => {
	return request({
		url: `/mission/details?account=${params.account}&password=${params.password}`,
		method: 'get'
	})
}
