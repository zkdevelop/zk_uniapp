// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif


// 修改main.js，在代码段末尾添加内容，这个是安卓版本的供参考
// #ifdef APP-PLUS 
import {
	logout
} from '@/utils/api/user'
let main = plus.android.runtimeMainActivity();
// 重写plus.runtime.quit
plus.runtime.quit = function() {
	uni.showModal({
		title: '提示',
		content: '是否退出应用？',
		success: function(res) {
			if (res.confirm) {
				// 退出的时候操作的代码
				// 退出登录
				if (uni.getStorageSync('token') != "") {
					logout().then(res => {
						console.log(res);
						uni.removeStorageSync('token');
						uni.removeStorageSync('userInfo');
					})
				}
				// 退出当前应用， 改方法只在App中生效
				main.finish();
			} else if (res.cancel) {
				// console.log('用户点击取消');  
			}
		}
	});
};
// #endif 