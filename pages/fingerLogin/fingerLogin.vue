<template>
	<view class="layout">
		<view class="fingerView">
			<image src="../../static/icon/finger.png" class="fingerIcon"></image>
		</view>
		<view>
			<text style="color: rgb(45, 130, 254);">点击进行指纹认证</text>
		</view>
		<view style="margin-top: 70px;">
			<text><navigator url="/pages/login/login" open-type="navigateBack">账号密码登录</navigator></text>
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
