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
				</uni-grid>
			</uni-section>
			
			<uni-section title="音频" type="line" padding>
				<view v-for="(item, index) in audioPath" :key = 'index' style="height: 80px;">
					<free-audio startPic="../../../../static/icon/take_video.png" endPic="../../../../static/icon/pause.png" audioId="audio1" :url="item"></free-audio>
				</view>
			</uni-section>
			<!-- 图片预览组件 -->
			<q-previewImage ref="previewImage" :urls="imgPath" @onLongpress="" @open="" @close=""></q-previewImage>
			<view v-if="videoPlay">
				<video id="myVideo" :src="videoUrl" @fullscreenchange="screenChange" style="height: 1px; width: 1px;" controls autoplay></video>
			</view>
		</scroll-view>
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
				videoPlay: false,
				videoUrl: '',
				musicShow: false,
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
					'../../../../static/file_source/许嵩 - 玫瑰花的葬礼 [mqms2].mp3',
					'../../../../static/file_source/许嵩 - 玫瑰花的葬礼 [mqms2].mp3',
					'../../../../static/file_source/许嵩 - 玫瑰花的葬礼 [mqms2].mp3',
					'../../../../static/file_source/许嵩 - 玫瑰花的葬礼 [mqms2].mp3',
				],
				video_src: '',
				image_src: [],
				FileTypes:[
					{ type: '图片', iconName: 'image'},
					{ type: '视频', iconName: 'camera'}
				],
				videoContext: uni.createVideoContext("myVideo", this),    // this这个是实例对象
				innerAudioContext: uni.createInnerAudioContext()
			}
		},
		methods: {
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
			  let fullScreen = e.detail.fullScreen; // 值true为进入全屏，false为退出全屏
			  // console.log(e, "全屏");
			  if (!fullScreen) {
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