<template>
	<view>
		<view class="page-body">
			<view class="container" style="height: 100%;">
				<map style="width: 100%; height: 100vh" :latitude="current_latitude" :longitude="current_longitude" :markers="covers" :scale="9">
				</map>
				<view class="overlay">
				  <button type="default" plain="true">按钮</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:0, // 使用 marker点击事件 需要填写id
				title: 'map',
				current_latitude: 24.182220,
				current_longitude: 120.686250,
				covers: [{
					latitude: 24.182220,
					longitude: 120.686250,
					iconPath: '../../../../static/icon/location_grey.png'
				}]
			}
		},
		onLoad() {
			// this.getCurrentPosition()
		},
		methods: {
			async getCurrentPosition(){
				const that = this
				uni.getLocation({
					type: 'gcj02',
					isHighAccuracy: true, // 开启高精度
					success: function(res) {
						that.current_longitude = res.longitude; // 经度
						that.current_latitude = res.latitude; // 纬度
						that.covers.push({latitude: res.longitude, longitude: res.latitude, iconPath: '../../../../static/icon/location_grey.png'});
						console.log(res);
					},
					fail: function(error) {
						console.log('获取失败');
					}
				})
				// this.covers.push({latitude: this.current_longitude, longitude: this.current_latitude, iconPath: '../../../../static/icon/location_grey.png'});
			}
		}
	}
</script>

<style>
.container {
	position: relative;
}

.overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 10; /* 确保在 map 之上 */
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
