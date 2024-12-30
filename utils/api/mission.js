// 引入 request 文件
import request from '/utils/request.js'

// 查询任务
export const searchMission = (query) => {
	// console.log('query', query)
	return request({
		url: `/mission/search`,
		method: 'post',
		data: query
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

// 查询文件信息
export const getMissionFileById = (missionId, curPage, pageSize) => {
	return request({
		url: '/missionFile/get/files',
		method: 'get',
		data: {
			missionId: missionId,
			curPage: curPage,
			pageSize: pageSize
		}
	})
}
export const getMissionFile = (curPage, pageSize) => {
	return request({
		url: `/missionFile/get/${curPage}/${pageSize}`,
		method: 'get'
	})
}

// 获取文件Url
export const generateUrl = (objectName) => {
	return request({
		url: `/minio/generateUrl`,
		method: 'get',
		data: {
			objectName: objectName
		}
	})
}

// 获取任务详情
export const getMissionDetails = (params) => {
	return request({
		url: `/mission/details`,
		method: 'post',
		data: params
	})
}

export const getFileUrl = (id) => {
	return request({
		url: '/missionFile/get/file/mission',
		method: 'get',
		data: {
			missionFileId: id
		}
	})
}