// 引入 request 文件
import request from '/utils/request.js'

// 查询任务
export const searchMission = (keyword, curPage, pageSize, statuses) => {
	const data = {
		"keyword": keyword,
		"param": {
			"curPage": curPage,
			"pageSize": pageSize,
		},
		"statuses": statuses
	};
	return request({
		url: `/mission/search`,
		method: 'post',
		data
	})
}

// 查询任务详情
export const getMissionDetail = (missionId) => {
	return request({
		url: `/mission/details?missionId=${missionId}`,
		method: 'get'
	})
}

// 删除任务
export const deleteMission = (missionId) => {
	return request({
		url: `/mission/delete/${missionId}`,
		method: 'delete'
	})
}