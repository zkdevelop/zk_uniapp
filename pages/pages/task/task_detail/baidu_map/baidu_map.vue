<template>
	<view class="map-container">
		<web-view src="/static/html/map_baidu.html"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		mounted() {
			// 通过 id 获取 nvue 子窗体
			const subNVue = uni.getSubNVueById('condition_icons')
			// 打开 nvue 子窗体  
			subNVue.show('none', 300, function() {
				// 打开后进行一些操作...  
				console.log(subNVue, 'subNVue');
				subNVue.setStyle({
					top: '0px',
					bottom: '0px',
					left: '0px',
					right: '0px',
					zIndex: 999
				});
				console.log("open success")
			});
		},
		methods: {

		}
	}
</script>

<style>
	.map_container {
		height: 100vh;
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 0;
	}
</style>