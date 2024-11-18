<template>
	<view class="camouflagePage">
		<view class="statusBar"></view>
		<view class="camouflageLayout">
				<!-- 推特logo -->
			<view style="text-align: center; margin-top: 10px;"><image src="../../../static/icon/X.png" style="width: 25px; height: 25px;"></image></view>
			<view style="margin-top: 250px; text-align: left;">
				<text style="letter-spacing: 3px; font-size: 5ch; font-family: fantasy; font-weight: 550; width: 75%;">查看世界各地的新鲜事。</text>
			</view>
			<view class="createAccount"><button @click="goToRegister" type="primary" style="border-radius: 20px; background: #1d9bf0;">创建账号</button></view>
		</view>
		<view class="camouflageFooter">
			<view><text>已经有账号了？</text><text @click="goToLogin" style="color: #1d9bf0;">登录</text></view>
			<view><text @click="goToFingerLogin" style="color: #1d9bf0;">指纹登录</text></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0,
			}
		},
		onLoad: function() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight;
		},
		methods: {
			goToLogin() {
				uni.navigateTo({
					url: "/pages/login/camouflageLogin/inputAccount/inputAccount"
				})
			},
			goToFingerLogin() {
				uni.navigateTo({
					url: "/pages/fingerLogin/fingerLogin"
				})
			},
			goToRegister() {
				uni.navigateTo({
					url: "/pages/register/register"
				})
			}
		}
	}
</script>

<style lang="scss">
.createAccount {
	margin-top: 40px;
	margin-bottom: 60px;
	border-radius: 30px;
}

.camouflagePage {
	display: flex;
	flex-direction: column;
	height: 100vh;
	.statusBar {
		height: var(--status-bar-height);
		width: 100%;
	}
}
.camouflageLayout {
	text-align: center;
	padding-left: 11%;
	padding-right: 11%;
	flex: 1;
}
.camouflageFooter {
	/* 固定在底部 */
	padding: 0 12% 25px 12%;
	display: flex;
	justify-content: space-between;
}
</style>
