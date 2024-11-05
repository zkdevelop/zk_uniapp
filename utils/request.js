// request.js

import {backendHost} from '/config.js';
const BASE_URL = backendHost; // 替换为你的基础URL

// 请求超出时间
const timeout = 5000
 
// 需要修改token，和根据实际修改请求头
export default (params) => {
	let url = params.url;
	let method = params.method || "get";
	let data = params.data || {};
	let header = {
		'Content-Type': 'application/json;charset=UTF-8',
		'Authorization': 'Bearer '+uni.getStorageSync('token'),
		...params.header
	}
	return new Promise((resolve, reject) => {
		// console.log(BASE_URL + url)
		// console.log(data)
		uni.request({
			url: BASE_URL + url,
			method: method,
			header: header,
			data: data,
            timeout,
			success(response) {
				// console.log('request-success')
				const res = response
				// console.log(res)
				// 根据返回的状态码做出对应的操作
				//获取成功
				// console.log(res.statusCode);
				if (res.statusCode == 200) {
					resolve(res.data);
				} else {
					// uni.clearStorageSync()
					switch (res.statusCode) {
						case 404:
							uni.showToast({
								title: '请求地址不存在...',
								duration: 2000,
							})
							break;
						default:
							uni.showToast({
								title: '请重试...',
								duration: 2000,
							})
							break;
					}
				}
			},
			fail(err) {
				// console.log('request-fail')
				console.log(err)
				if (err.errMsg.indexOf('request:fail') !== -1) {
					uni.showToast({
						title: '网络异常',
						icon: "error",
						duration: 2000
					})
				} else {
					uni.showToast({
						title: '未知异常',
						duration: 2000
					})
				}
				reject(err);
			},
			complete() {
				// 不管成功还是失败都会执行
				uni.hideLoading();
				uni.hideToast();
			}
		});
	}).catch(() => {});
};