<template>
	<view style="background: #fff;">
		<view style="padding: 0 0 10px 7px; box-sizing: border-box;">
			<uni-section v-for="(file,file_index) in FileTypes" :key = file_index :title=file.type type="line">
				<uni-grid :column="4" :show-border="false">
					<!-- 图片 -->
					<uni-grid-item v-if="file_index === 0" v-for="(item, index) in imgPath" :key="index">
						<view style="border-radius: 3px; width: 83px; height: 83px; display: flex; align-items: center; justify-content: center;">
							<image :src="item" @click="preview(item)" style="width: 83px; height: 83px;"></image>
						</view>
					</uni-grid-item>
					<!-- 视频 -->
					<uni-grid-item v-if="file_index === 1" v-for="(item, index) in videoPath" :key="index">				
						<view style="background-color: black; border-radius: 3px; width: 83px; height: 83px; display: flex; align-items: center; justify-content: center;">
							<image @touchstart="openVideo()" @click="videoShow(item)" src="../../../../static/icon/take_video.png" style="width: 50px; height: 50px;"></image>
						</view>
					</uni-grid-item>
					<uni-grid-item v-if="file_index === 2" v-for="(item, index) in audioPath" :key="index">
						<view style="background-color: lightgrey; border-radius: 3px; width: 83px; height: 83px; display: flex; align-items: center; justify-content: center;">
							<image @click="openAudioPopup(index)" src="../../../../static/icon/audio.png" style="width: 35px; height: 35px;"></image>
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
		</view>
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
				<!-- 支持mp3、ogg等 -->
				<free-audio startPic="../../../../static/icon/take_video.png" endPic="../../../../static/icon/pause.png" audioId="audio1" :url="audioUrl"></free-audio>
			</view>
		</uni-popup>
		<!-- 文件上传 -->
		<ysh-file-manager ref="filemanager" @result="handleResult"></ysh-file-manager>
		<view style="background-color: #fff;">
			<uni-fab
				:pattern="pattern"
				:content="content"
				:horizontal="horizontal"
				:vertical="vertical"
				:direction="direction"
				@trigger="trigger"
			></uni-fab>
		</view>
	</view>
</template>

<script>
	import freeAudio from '@/components/chengpeng-audio/free-audio.vue'
	import yshFileManager from "@/components/ysh-file-manager/ysh-file-manager.vue"
	import { getMissionFileById, generateUrl } from '../../../../utils/api/mission'
	export default {
		components: {freeAudio ,yshFileManager},
		data() {
			return {
				missionId: '',
				fileInfo: [],
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF',
					iconColor: '#fff'
				},
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'horizontal',
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
					'../../../../static/videos/VID20241104093724.mp4',
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
				content: [{
						iconPath: '../../../../static/icon/图片-选中.png',
						selectedIconPath: '../../../../static/icon/图片-选中.png',
						text: '上传图片',
						active: false
					},
					{
						iconPath: '../../../../static/icon/video.png',
						selectedIconPath: '../../../../static/icon/video.png',
						text: '上传视频',
						active: false
					},
					{
						iconPath: '../../../../static/icon/document_select.png',
						selectedIconPath: '../../../../static/icon/document_select.png',
						text: '其他文件',
						active: false
					}
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
		mounted() {
			this.initializeDocuments();
		},
		onLoad(options) {
			if(options.missionId){
				this.missionId = options.missionId;
			} else {
				console.error('没有传递类型参数');
			};
		},
		methods: {
			initializeDocuments(){
				uni.showLoading({
					title: '正在加载文件',
					mask: true
				})
				getMissionFileById(this.missionId, 1, 50).then(res => {
					this.fileInfo = res.data.missionFiles.records;
					console.log('fileInfo', this.fileInfo)
					uni.hideLoading()
				})
			},
			uploadFile(){
				this.$refs.filemanager._openFile()
			},
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
			trigger(e) {
				if(e.item.text === '上传图片'){
					this.uploadImage()
				}else if(e.item.text === '上传视频'){
					this.uploadVideo()
				}else if(e.item.text === '其他文件'){
					this.uploadFile()
				}
			},
			handleResult(fileInfo) {
				console.log(fileInfo)
			},
			uploadVideo: function () {
				var self = this;
				uni.chooseVideo({
					sourceType: ['camera', 'album'],
					success: function (res) {
						const tempFilePath = res.tempFilePath;
						uni.uploadFile({
							url: `http://139.196.11.210:8500/communicate/minio/upload`,
							filePath: tempFilePath,
							name: 'files',
							formData: {
								"isGroup": false,
								"missionId": "d56f22fe8f3c40bdba6c0ad609e2f3e6",
								"receptionId": "f7c6e52d7aae493db0b9593202885062"
							},
							header: {
								'Content-Type': 'multipart/form-data;', 
								'Authorization': 'Bearer '+ uni.getStorageSync('token'),
							},
							success: (uploadFileRes) => {
								const res = JSON.parse(uploadFileRes.data);
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
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'],
					success: function (res) {
						let ok = 0;
						let index = 0;
						const length = res.tempFilePaths.length;
						for(const tempFilePath of res.tempFilePaths){
							uni.uploadFile({
								url: `http://139.196.11.210:8500/communicate/minio/upload`,
								filePath: tempFilePath,
								name: 'files',
								formData: {
									"isGroup": false,
									"missionId": "d56f22fe8f3c40bdba6c0ad609e2f3e6",
									"receptionId": "f7c6e52d7aae493db0b9593202885062"
								},
								header: {
									'Content-Type': 'multipart/form-data;', 
									'Authorization': 'Bearer '+ uni.getStorageSync('token'),
								},
								success: (uploadFileRes) => {
									const res = JSON.parse(uploadFileRes.data);
									index = index + 1;
									if(res.code === 200) {
										ok = ok + 1; 
									}
									if(ok === length){
										uni.showToast({
											title: '上传成功！',
											icon: 'success',
											duration: 2000
										});
									}
									if(index === length && ok < length){
										const fail = length - ok;
										uni.showToast({
											title: fail+"张上传失败！",
											icon: 'none',
											duration: 2000
										})
									}
								}
							});
						}
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
</style>