// config.js

// 高德地图API Key
export const gaodeApiKey = 'caa070a3ebda631bea2feff72972f28c'
export const gaodeSecurityKey = '93849873dba769e7b6235a79330ae7f7'
//百度地图API Key
export const baiduApiKey = 'A0Pr9wGe6p6C8pFIBeC2tt7QqQ8oDlCD'

// 后端API地址
export const backendHost = 'http://139.196.11.210:8500/communicate'
// export const backendHost = 'http://127.0.0.1:8080'

// 底图地址
export const tileUrls = {
	'google': {
		url: 'https://wprd0{1,2,3,4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&size=1&scl=1&style=8&ltype=11',
		name: "谷歌地图"
	},
	'gaode': {
		url: 'https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
		name: "高德地图"
	}, //能用的
	// 'gaode':'http://192.168.58.168:8098/tiles/img/{z}/{x}/{y}.png',
	// 'baidu':'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=sl',
	'baidu': {
		url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
		name: "百度地图"
	},
	'local': {
		url: 'static/tiles/map/{z}/{x}/{y}.png',
		name: "离线地图"
	},
}