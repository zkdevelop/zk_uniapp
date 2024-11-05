<template>
	<view class="layout">
		<view class="text">
			<text>欢迎注册！</text>
		</view>
		<view class="account" style="margin-top: 25px;">
			<view class="title" style="margin-bottom: 7px;">账户名</view>
			<input class="uni-input" focus placeholder="请输入账户名" v-model="account" />
			<view class="title" style="margin-bottom: 7px;">姓名</view>
			<input class="uni-input" focus placeholder="请输入姓名" v-model="username" />
			<view class="title" style="margin: 15px 0px 7px 0px;">密码</view>
			<input class="uni-input" password type="text" placeholder="请输入密码" v-model="password" />
			<view class="title" style="margin: 15px 0px 7px 0px;">再次输入密码</view>
			<input class="uni-input" password type="text" placeholder="请再次输入密码" v-model="confirmPassword" />
			<view class="title" style="margin: 15px 0px 7px 0px;">部门</view>
			<uni-data-picker :localdata="departments" popup-title="请选择部门" @change="dataPickerChange" />
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
				account:"test-app",
				username: 'test-app',
				password: 'test123456',
				confirmPassword: 'test123456',
				phone: '13888888888',
				department: "二十一室",
				departments: []
			}
		},
		mounted() {
			this.getDepartments();
		},
		methods: {
			validatePasswordComplexity(password) {
				// 密码复杂度校验：至少8个字符，包含大小写字母和数字
				const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
				return regex.test(password);
			},
			submitRegister() {
				const data = {
					"account": this.account,
					"department": this.department,
					"name": this.username,
					"password": this.password,
					"phone": this.phone,
					"role": "ACTOR",
					"status": "USING"
				}
				// 校验两次输入的密码是否一致
				if (this.password !== this.confirmPassword) {
					uni.showToast({
						title: '两次输入的密码不一致',
						icon: 'none'
					});
					return;
				}
				if (!this.validatePasswordComplexity(this.password)) {
					uni.showToast({
						title: '密码必须包含至少8个字符，且包含大小写字母和数字',
						icon: 'none'
					});
					return;
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

			},
			// 获取部门列表
			getDepartments() {
				this.departments = [{
						text: '二十一室',
						value: '二十一室'
					},
					{
						text: '二十二室',
						value: '二十二室'
					},
					{
						text: '二十三室',
						value: '二十三室'
					}
				];
			},
			dataPickerChange(item) {
				this.department = item.detail.value[0].text;
				console.log(this.department);
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