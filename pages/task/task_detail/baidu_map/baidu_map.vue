<template>
	<view class="map">
		<web-view src="/static/html/map_baidu.html" style="width: 100%;height: 500px;"></web-view>
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
			console.log(subNVue, 'subNVue')
			// 打开 nvue 子窗体  
			subNVue.show('none', 300, function() {
				// 打开后进行一些操作...  
				console.log("open success")
			});
		},
		methods: {
			
		}
	}
</script>

<style>
.map {
	width: 100%;
	height: 300px;
}
</style>
