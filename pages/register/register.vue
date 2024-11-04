<template>
	<view class="layout">
		<view class="text">
			<text>欢迎注册！</text>
		</view>
		<view class="account" style="margin-top: 25px;">
			<view class="title" style="margin-bottom: 7px;">用户名</view>
			<input class="uni-input" focus placeholder="请输入用户名" v-model="username" />
			<view class="title" style="margin: 15px 0px 7px 0px;">密码</view>
			<input class="uni-input" password type="text" placeholder="请输入密码" v-model="password" />
			<view class="title" style="margin: 15px 0px 7px 0px;">再次输入密码</view>
			<input class="uni-input" password type="text" placeholder="请再次输入密码" v-model="passwordRepeat" />
			<view class="title" style="margin: 15px 0px 7px 0px;">手机号</view>
			<input class="uni-input" type="text" placeholder="请输入手机号" v-model="phone" />
			<button type="primary" style="margin-top: 30px;" @click="submitRegister">注册</button>
		</view>
	</view>
</template>

<script>
	import {
		register
	} from '@/utils/api/user.js'
	export default {
		data() {
			return {
				username: 'test-app',
				password: 'test123456',
				passwordRepeat: 'test123456',
				phone: '13888888888',
				department:"二十一室"
			}
		},
		methods: {
			submitRegister() {
				const data = {
					"account": this.username,
					"department":this.department,
					"name": this.username,
					"password": this.password,
					"phone": this.phone,
					"role": "ACTOR",
					"status":"USING"
				}
				register(data).then(res => {
					console.log(res)
					if (res.code == 200) {
						uni.showToast({
							title: '注册成功',
							duration: 2000
						}).then((res) => {
							uni.navigateTo({
								url: '/pages/login/login' // 替换为目标页面的路径
							});
						})

					}
				})
				// uni.navigateTo({
				// 	url: '/pages/login/login' // 替换为目标页面的路径
				// });
			}
		}
	}
</script>

<style lang="scss">
	.layout {
		margin-left: 25px;
		margin-right: 25px;
	}

	.text {
		margin-top: 10px;

		text {
			font-size: 25px;
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		}
	}
</style>