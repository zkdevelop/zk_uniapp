// 引入 request 文件
import request from '/utils/request.js'
 
// 查询指令
export const getOrderList = (params) => {
	return request({
		url: `/instruction/search/order/${params.missionId}/${params.curPage}/${params.pageSize}`,
		method: 'get'
	})
}
// 查询告警信息
export const getWarningList = (params) => {
	return request({
		url: `/instruction/search/warning/${params.missionId}/${params.curPage}/${params.pageSize}`,
		method: 'get'
	})
}

// 发送告警信息
export const sendWarning=(data)=>{
	return request({
		url: `/instruction/send/warning`,
		method: 'post',
		data
	})
}