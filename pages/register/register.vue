<template>
	<view class="layout">
		<view class="text">
			<text>欢迎注册！</text>
		</view>
		<view class="account" style="margin-top: 25px;">
			<view class="title" style="margin-bottom: 7px;">用户名</view>
			<input class="uni-input" focus placeholder="请输入用户名" />
			<view class="title" style="margin: 15px 0px 7px 0px;">密码</view>
			<input class="uni-input" password type="text" placeholder="请输入密码" />
			<view class="title" style="margin: 15px 0px 7px 0px;">再次输入密码</view>
			<input class="uni-input" password type="text" placeholder="请再次输入密码" />
			<button type="primary" style="margin-top: 30px;">注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.layout{
		margin-left: 25px;
		margin-right: 25px;
	}
	.text {
		margin-top: 10px;
		text{
			font-size: 25px;
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		}
	}
</style>
