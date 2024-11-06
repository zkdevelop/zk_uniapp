<template>
	<view style="position: relative;" @scroll="onScroll">
		<scroll-view style="padding-bottom: 40px;">
			<uni-section v-for="(file,file_index) in FileTypes" :key = file_index :title=file.type type="line">
				<uni-grid :column="4">
					<!-- 图片 -->
					<uni-grid-item v-if="file_index === 0" v-for="(item, index) in imgPath" :key="index">
						<view class="grid-item-box" style="background-color: #fff; width: 83px; height: 83px;">
							<image :src="item" @click="preview(item)" style="width: 80px; height: 60px;"></image>
						</view>
					</uni-grid-item>
					<!-- 视频 -->
					<uni-grid-item v-if="file_index === 1" v-for="(item, index) in videoPath" :key="index">				
						<view style="background-color: black; width: 83px; height: 83px; display: flex; align-items: center; justify-content: center;">
							<image @touchstart="openVideo()" @click="videoShow(item)" src="../../../../static/icon/take_video.png" style="width: 50px; height: 50px;"></image>
						</view>
					</uni-grid-item>
					<uni-grid-item v-if="file_index === 2" v-for="(item, index) in audioPath" :key="index">
						<view style="background-color: black; width: 83px; height: 83px; display: flex; align-items: center; justify-content: center;">
							<image @click="openAudioPopup(index)" src="../../../../static/icon/take_video.png" style="width: 50px; height: 50px;"></image>
						</view>
					</uni-grid-item>
				</uni-grid>
			</uni-section>
			<!-- 图片预览组件 -->
			<q-previewImage ref="previewImage" :urls="imgPath" @onLongpress="" @open="" @close=""></q-previewImage>
			<!-- 视频预览界面 -->
			<view v-if="videoPlay">
				<video id="myVideo" :src="videoUrl" @fullscreenchange="screenChange" style="height: 1px; width: 1px;" controls autoplay></video>
			</view>
		</scroll-view>
		<!-- 音频预览弹窗 -->
		<uni-popup ref="audioPopup" type="bottom" @maskClick="clickMask()">
			<view style="background: #fff; border-radius: 5px; padding: 10px;">
				<view style="display: flex; justify-content: space-between;">
					<view><text>{{ getFileName(audioUrl) }}</text></view>
					<view style="margin-right: 10px;" @click="clickMask()">
						<image src="../../../../static/icon/close.png" style="width: 15px; height: 15px;"></image>
					</view>
				</view>
				<view class="divider"></view>
				<!-- 支持mp3、ogg -->
				<free-audio startPic="../../../../static/icon/take_video.png" endPic="../../../../static/icon/pause.png" audioId="audio1" :url="audioUrl"></free-audio>
			</view>
		</uni-popup>
		<!-- 文件上传按钮 -->
		<view class="fixed-button">
			<button type="primary" @tap="uploadVideo" style="width: 50%;">上传视频</button>
			<button type="primary" @tap="uploadImage" style="width: 50%;">上传图片</button>
		</view>
	</view>
</template>

<script>
	import freeAudio from '@/components/chengpeng-audio/free-audio.vue'
	export default {
		components: {freeAudio},
		data() {
			return {
				isFullScreen: false,
				videoPlay: false,
				videoUrl: '',
				audioUrl: '',
				imgPath: [
					'../../../../static/images/taiwan_map.jpg',
					'../../../../static/images/taiwan_map.jpg',
					'../../../../static/images/taiwan_map.jpg',
					'../../../../static/images/taiwan_map.jpg',
					'../../../../static/images/taiwan_map.jpg',
					'../../../../static/images/taiwan_map.jpg',
					'../../../../static/images/taiwan_map.jpg',
				],
				videoPath: [
					'../../../../static/videos/VID20241104093724.mp4',
					'../../../../static/videos/VID20241104093724.mp4',
					'../../../../static/videos/VID20241104093724.mp4',
					'../../../../static/videos/VID20241104093724.mp4',
					'../../../../static/videos/VID20241104093724.mp4',
				],
				audioPath: [
					'../../../../static/file_source/许嵩 - 玫瑰花的葬礼 [mqms2].mp3',
					'../../../../static/file_source/林俊杰 - 修炼爱情 [mqms2].ogg',
					'../../../../static/file_source/刘至佳&韩瞳 - 时光背面的我 [mqms2].mp3',
					'../../../../static/file_source/周杰伦 - 半岛铁盒 [mqms2].mgg1.flac',
					'../../../../static/file_source/周杰伦 - 稻香 [mqms2].qmc0.flac',
				],
				video_src: '',
				image_src: [],
				FileTypes:[
					{ type: '图片', iconName: 'image'},
					{ type: '视频', iconName: 'camera'},
					{ type: '音频', iconName: 'mic'}
				],
				videoContext: uni.createVideoContext("myVideo", this),    // 这个是实例对象
			}
		},
		methods: {
			getFileName(url){
				const fileName = url.split('/').pop();
				const nameWithoutExtension = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName;
				return nameWithoutExtension;
			},
			preview(url) {
				// #ifdef MP-WEIXIN
				this.$nextTick(()=>{
					 this.$refs.previewImage.open(url); // 传入当前选中的图片地址(小程序必须添加$nextTick，解决组件首次加载无图)
				})
				// #endif
	
				// #ifndef MP-WEIXIN
				this.$refs.previewImage.open(url); // 传入当前选中的图片地址
				// #endif
			},
			screenChange(e) {
			  this.isFullScreen = e.detail.fullScreen; // 值true为进入全屏，false为退出全屏
			  // console.log(e, "全屏");
			  if (!this.isFullScreen) {
				this.videoPlay = false;
				// 退出全屏
				this.videoContext.stop();
			  }
			},
			// 触发全屏播放的点击事件
			async videoShow(item) {
			  this.videoPlay = true;  // 显示播放盒子
			  this.videoUrl = item;
			  this.videoContext.requestFullScreen({ direction: 0 }); 	
			  this.videoContext.play();
			},
			openVideo(){
				this.videoPlay =  true;
			},
			openAudioPopup(index){
				this.$refs.audioPopup.open()
				this.audioUrl = this.audioPath[index];
			},
			clickMask(){
				this.$refs.audioPopup.close()
				uni.$emit('stop')
			},
			audioPlay(item){
				if(this.musicShow){
					console.log('播放')
					const timout =  setTimeout(() => {
						clearTimeout(timout)
						innerAudioContext.play()
					},500)
				}else{
					console.log('暂停')
					innerAudioContext.pause();
				}
				this.musicShow=!this.musicShow;
			},
			uploadVideo: function () {
				var self = this;
				uni.chooseVideo({
					sourceType: ['camera', 'album'],
					success: function (res) {
						const tempFilePath = res.tempFilePath;
						uni.uploadFile({
							url: `http://139.196.11.210:8500/communicate/minio/upload?isGroup=${false}&missionId=${'d56f22fe8f3c40bdba6c0ad609e2f3e6'}&receptionId=${'69fc9284fc5d4dd7b05092af4715ab9d'}`,
							filePath: tempFilePath, 
							name: 'file',
							header: {
								'Content-Type': 'application/form-data;charset=UTF-8',
								'Authorization': 'Bearer '+uni.getStorageSync('token'),
							},
							success: (uploadFileRes) => {
								var res = JSON.parse(uploadFileRes.data);
								if (res.code === 200) {
									uni.showToast({
										title: '视频上传成功！',
										//将值设置为 success 或者直接不用写icon这个参数
										icon: 'success',
										//显示持续时间为 2秒
										duration: 2000
									});
								} else{
									uni.showToast({
										title: '视频上传失败！',
										icon: 'none',
										//显示持续时间为 2秒
										duration: 2000
									});
								}
								
								console.log(uploadFileRes.data);
							}
						});
					}
				});
			},
			uploadImage: function() {
				var self = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'],
					success: function (res) {
						const tempFilePath = res.tempFilePaths[0];
						console.log(self.image_src);
						uni.uploadFile({
							url: `http://139.196.11.210:8500/communicate/minio/upload?isGroup=${false}&missionId=${'d56f22fe8f3c40bdba6c0ad609e2f3e6'}&receptionId=${'69fc9284fc5d4dd7b05092af4715ab9d'}`,
							files: tempFilePath,
							header: {
								'Content-Type': 'application/form-data;charset=UTF-8',
								'Authorization': 'Bearer '+uni.getStorageSync('token'),
							},
							success: (uploadFileRes) => {
								var res = JSON.parse(uploadFileRes.data);
								if (res.code === 200) {
									uni.showToast({
										title: '图片上传成功！',
										//将值设置为 success 或者直接不用写icon这个参数
										icon: 'success',
										//显示持续时间为 2秒
										duration: 2000
									});
								} else{
									uni.showToast({
										title: '图片上传失败！',
										icon: 'none',
										//显示持续时间为 2秒
										duration: 2000
									});
								}
								console.log(uploadFileRes.data);
							}
						});
					}
				});
			}
		}
	}
</script>

<style>
.divider {
	height: 1px;
	background-color: #ccc;
	/* 分割线的颜色 */
	margin: 10px 0;
	/* 分割线的上下间距 */
}
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