<template>
	<view style="position: relative;" @scroll="onScroll">
		<scroll-view style="padding-bottom: 40px;">
			<uni-section v-for="(file,file_index) in FileTypes" :key = file_index :title=file.type type="line" padding>
				<uni-grid :column="4" :highlight="true">
					<uni-grid-item v-for="(item, index) in 10" :index="index" :key="index">
						<view class="grid-item-box" style="background-color: #fff;">
							<uni-icons :type=file.iconName :size="29" color="#777" />
							<text class="text">文本信息</text>
						</view>
					</uni-grid-item>
				</uni-grid>
			</uni-section>
		</scroll-view>
		<view class="fixed-button">
			<button type="primary" @tap="uploadVideo" style="width: 50%;">上传视频</button>
			<button type="primary" @tap="uploadImage" style="width: 50%;">上传图片</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				video_src: '',
				image_src: [],
				FileTypes:[
					{ type: '图片', iconName: 'image'},
					{ type: '视频', iconName: 'camera'},
					{ type: '音频', iconName: 'mic'}
				]
			}
		},
		methods: {
			uploadVideo: function () {
				var self = this;
				uni.chooseVideo({
					sourceType: ['camera', 'album'],
					success: function (res) {
						self.video_src = res.tempFilePath;
					}
				});
			},
			uploadImage: function() {
				var self = this;
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'],
					success: function (res) {
						self.image_src = res.tempFilePaths;
						console.log(self.image_src);
					}
				});
			}
		}
	}
</script>

<style>
.grid-item-box {
	flex: 1;
	position: relative;
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 15px 0;
}
.fixed-button {
  position: fixed;
  display: flex;
  bottom: 0px; /* 距离屏幕底部20px */
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 5px;
  z-index: 10; /* 确保按钮在其他内容上方 */
  width: 100%;
}
</style>
