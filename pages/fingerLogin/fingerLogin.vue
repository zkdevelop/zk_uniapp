<template>
	<view class="layout">
		<view class="fingerView" @tap="fingerprint()" :disabled="disabled">
			<image src="../../static/icon/finger.png" class="fingerIcon"></image>
		</view>
		<view @tap="fingerprint()" :disabled="disabled">
			<text style="color: rgb(45, 130, 254);">点击进行指纹认证</text>
		</view>
		<view style="margin-top: 70px;">
			<text><navigator url="/pages/login/login" open-type="navigateBack" hover-class="null">账号密码登录</navigator></text>
		</view>
		<view style="color:red;">{{ result }}</view>
	</view>
</template>

<script>
	import { login } from '@/utils/api/user.js'
export default {
	data() {
		return {
			result: '',
			disabled:true,
			show:false,
		}
	},
	onLoad() {
		// #ifdef APP-PLUS
		if (!plus.fingerprint.isSupport()) {
			this.result = '此设备不支持指纹识别';
			this.disabled = true;
		} else if (!plus.fingerprint.isKeyguardSecure()) {
			this.result = '此设备未设置密码锁屏，无法使用指纹识别';
			this.disabled = true;
		} else if (!plus.fingerprint.isEnrolledFingerprints()) {
			this.result = '此设备未录入指纹，请到设置中开启';
			this.disabled = true;
		} else {
			this.result = '此设备支持指纹识别';
			this.disabled = false;
		}
		// #endif
		// #ifdef MP-WEIXIN
		this.disabled = false;
		this.result = '请在微信真机中使用，模拟器不支持';
		// #endif
		// #ifndef APP-PLUS || MP-WEIXIN
		this.result = '此平台不支持指纹识别';
		// #endif
	},
	methods: {
		printCancel:function(){
			plus.fingerprint.cancel();
			this.result="停止指纹识别"
		},
		fingerprint: function() {
			let that=this;
			// #ifdef APP-PLUS
			plus.fingerprint.authenticate(function() {
				plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
				that.show=false;
				that.result='指纹识别成功';
				const username = uni.getStorageSync('username');
				const password = uni.getStorageSync('password');
				login({
					account: username,
					password: password
				}).then(res => {
					console.log(res)
					if (res.code == 200) {
						uni.setStorageSync('token', res.data.token)
						uni.setStorageSync('userInfo', res.data.account)
						console.log(uni.getStorageSync('token'));
						uni.showToast({
							title: '登录成功',
							duration: 2000,
						}).then(
							that.goToTask()
						)
					}
				})
				//plus.nativeUI.alert('指纹识别成功');
			}, function(e) {
				switch (e.code) {
					case e.AUTHENTICATE_MISMATCH:
						plus.nativeUI.toast('指纹匹配失败，请重新输入');
						break;
					case e.AUTHENTICATE_OVERLIMIT:
						plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
						plus.nativeUI.alert('指纹识别失败次数超出限制，请使用其它方式进行认证');
						break;
					case e.CANCEL:
						plus.nativeUI.toast('已取消识别');
						break;
					default:
						plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
						plus.nativeUI.alert('指纹识别失败，请重试');
						break;
				}
			});
			// Android平台手动弹出等待提示框 
			if ('Android' == plus.os.name) {
				this.show=true;
				// plus.nativeUI.showWaiting('指纹识别中...').onclose = function() {
				// 	plus.fingerprint.cancel();
				// }
			}
			// #endif

			// #ifdef MP-WEIXIN
			wx.startSoterAuthentication({
				requestAuthModes: ['fingerPrint'],
				challenge: '123456',
				authContent: '请用指纹解锁',
				success(res) {
					uni.showToast({
						title: '识别成功',
						mask: false,
						duration: 1500
					});
				}
			})
			// #endif
		},
		goToTask() {
			uni.redirectTo({
			  url: '/pages/tabBar/tabBar'
			});
		}
	}
}
</script>

<style lang="scss">
	.layout{
		text-align: center;
	}
	.fingerView{
		margin: 100px 0px 20px 0px;
		text-align: center;
	}
	.fingerIcon{
		width: 60px;
		height: 60px;
	}
</style>
