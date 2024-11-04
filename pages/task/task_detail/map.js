export function loadBaiduMapScript(ak) {
	return new Promise(function(resolve, reject) {
		window.init = function() {
			resolve(loadBaiduMapScript)
		}
		var script = document.createElement('script')
		script.type = 'text/javascript'
		script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${ak}&callback=init`
		script.onerror = reject
		document.head.appendChild(script)
	})
}

// export function loadGaodeMapScript(ak, securityJsCode) {
// 	return new Promise(function(resolve, reject) {
// 		window.init = function() {
// 			resolve(loadGaodeMapScript)
// 		}
// 		window._AMapSecurityConfig = {
// 			securityJsCode: securityJsCode,
// 		};
// 		var script = document.createElement('script')
// 		script.type = 'text/javascript'
// 		script.src = `https://webapi.amap.com/maps?v=2.0&key=${ak}`
// 		script.onerror = reject
// 		document.head.appendChild(script)
// 	})
// }

export function loadMapScript(baiduApiKey,gaodeApiKey, securityJsCode) {
	return new Promise(function(resolve, reject) {
		window.init = function() {
			resolve(loadMapScript)
		}
		window._AMapSecurityConfig = {
			securityJsCode: securityJsCode,
		};
		var script1 = document.createElement('script')
		script1.type = 'text/javascript'
		script1.src = `https://webapi.amap.com/maps?v=2.0&key=${gaodeApiKey}`
		script1.onerror = reject
		document.head.appendChild(script1)
		
		var script2 = document.createElement('script')
		script2.type = 'text/javascript'
		script2.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${baiduApiKey}&callback=init`
		script2.onerror = reject
		document.head.appendChild(script2)
	})
}