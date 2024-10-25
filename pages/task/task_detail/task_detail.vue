<template>
	<view class="layout_task_detail">
		<view class="condition_icons">
			<view class="condition_selector">
				<picker mode="selector" :range="options" @change="onPickerChange">
					<view class="picker">
						{{ selectedOption ? selectedOption : defaultOption }}
					</view>
				</picker>
			</view>
			<view class="instructions">
				<view class="instructions_alert">
					<view class="alert_img" style="text-align: center; padding-top: 5px;"><image src="../../../static/icon/alert.png" style="width: 23px; height: 23px;"></image></view>
					<view class="text_setting" style="text-align: center;"><text style="color: #d81e06; font-size: small;">告警</text></view>
				</view>
				<view class="instructions_instruct">
					<view class="alert_img" style="text-align: center;"><image src="../../../static/icon/alert.png" style="width: 23px; height: 23px;"></image></view>
				</view>
				<view class="instructions_document">
					<view class="document">
						<view class="alert_img" style="text-align: center;"><image src="../../../static/icon/alert.png" style="width: 23px; height: 23px;"></image></view>
					</view>
					<view class="map_selector">
						<view class="alert_img" style="text-align: center;"><image src="../../../static/icon/alert.png" style="width: 23px; height: 23px;"></image></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: ['未开始', '进行中', '已完成'], // 下拉选择器的选项
				selectedOption: '' ,// 当前选择的选项
				defaultOption: '未开始'
			}
		},
		methods: {
			onPickerChange(event) {
				const index = event.detail.value; // 获取选择的索引
				this.selectedOption = this.options[index]; // 更新当前选择的选项
			}
		}
	}
</script>

<style lang="scss">
	.layout_task_detail{
		height: 100vh; /* 确保填满整个视口 */
		background-image: url('../../../static/images/taiwan_map.jpg'); /* 替换为你的图片路径 */
		background-size: cover; /* 使背景图覆盖整个视图 */
		background-position: center; /* 背景图居中 */
	}
	.condition_icons{
		display: flex;
		justify-content: space-between; /* 两侧分开 */
		padding: 15px;
	}
	.condition_selector{
		width: 70px;
		height: 30px;
		background: #f9f9f9;
		box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.2); /* 水平偏移、垂直偏移、模糊半径、颜色 */
		border-radius: 3px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.instructions_alert{
		width: 50px;
		height: 50px;
		background: #f9f9f9;
		box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.2); /* 水平偏移、垂直偏移、模糊半径、颜色 */
		border-radius: 3px;
		margin-bottom: 10px;
	}
	.instructions_instruct{
		width: 50px;
		height: 50px;
		background: #f9f9f9;
		box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.2); /* 水平偏移、垂直偏移、模糊半径、颜色 */
		border-radius: 3px;
		margin-bottom: 10px;
	}
	.instructions_document{
		width: 50px;
		height: 100px;
		background: #f9f9f9;
		box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.2); /* 水平偏移、垂直偏移、模糊半径、颜色 */
		border-radius: 3px;
		margin-bottom: 10px;
	}
	.text_setting{
		display: flex;
		align-items: center;/* 垂直居中 */
		justify-content: center;
	}
</style>
