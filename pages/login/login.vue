<template>
	<view class="layout">
		<view class="iconView">
			<image src="../../static/icon/login.png" class="icon"> </image>
		</view>
		<view class="text">
			<text>欢迎登录！</text>
		</view>
		<view class="account" style="margin-top: 25px;">
			<view class="title" style="margin-bottom: 7px;">用户名</view>
			<input class="uni-input" focus placeholder="请输入用户名" />
			<view class="title" style="margin: 15px 0px 7px 0px;">密码</view>
			<input class="uni-input" password type="text" placeholder="请输入密码" />
			<button @click="goToTask" type="primary" style="margin-top: 15px;">登录</button>
		</view>
		<view class="container">
			<view class="left">
				<label class="checkbox">
					<checkbox :value="autoLogin" @change="toggleAutoLogin">自动登录</checkbox>
				</label>
			</view>
			<view class="right">
				<text @click="goToRegister" class="clicked_text">注册 </text>
				<text @click="goToForgetPassword" class="clicked_text"> 忘记密码</text>
				<text> | </text>
				<text @click="goToFingerLogin" class="clicked_text">指纹登录</text>
			</view>
		</view>
		<!-- <navigator url="/pages/register/register">注册</navigator> -->
	</view>
</template>

<script>
	export default {
		data() {
		    return {
		      autoLogin: false // 初始状态为未选中
		    };
		},
		methods: {
			goToRegister() {
				uni.navigateTo({
					url: '/pages/register/register' // 替换为目标页面的路径
				});
			},
			goToForgetPassword() {
				uni.navigateTo({
					url: '/pages/forgetPassword/forgetPassword'
				})
			},
			goToFingerLogin(){
				uni.navigateTo({
					url: '/pages/fingerLogin/fingerLogin'
				})
			},
			goToTask() {
				uni.redirectTo({
					url: '/pages/task/task'
				})
			},
			toggleAutoLogin(e) {
		        this.autoLogin = e.detail.value.length > 0; // 根据选择框状态更新
				if (this.autoLogin == true) {
					uni.navigateTo({
					url: '/pages/register/register' // 替换为目标页面的路径
					});
				}
			}
	    }
	};
</script>

<style lang="scss">
	.layout{
		margin-left: 25px;
		margin-right: 25px;
	}
	.icon{
		width: 50px;
		height: 50px;
	}
	.iconView{
		margin-top: 100px;
	}
	.text{
		margin-top: 10px;
		text{
			font-size: 25px;
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		}
	}
	.clicked_text {
		color: #4c84ff; /* 设置文本颜色 */
		cursor: pointer; /* 显示手型光标 */
	}
	.container {
	  display: flex;
	  justify-content: space-between; /* 两侧分开 */
	  align-items: center; /* 垂直居中 */
	  margin-top: 15px;
	}
</style>
