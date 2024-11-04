<template>
	<view class="layout_task_detail">
		<view class="condition_icons">
			<view class="condition_selector">
				<uni-data-select
					v-model="taskItem.type"
					:localdata="range"
					:clear="false"
				></uni-data-select>
			</view>
			<view>
				<view class="instructions_alert" @click="open_alert_popup">
					<view class="alert_img" style="text-align: center; padding-top: 5px;"><image src="../../../static/icon/alert.png" style="width: 22px; height: 22px;"></image></view>
					<view class="text_setting" style="text-align: center;"><text style="color: #d81e06; font-size: small;">告警</text></view>
				</view>
				<view class="instructions_instruct" @click="open_task_instructions">
					<view class="alert_img" style="text-align: center; padding-top: 5px;"><image src="../../../static/icon/flag.png" style="width: 22px; height: 22px;"></image></view>
					<view class="text_setting" style="text-align: center;"><text style="color: #3171d3; font-size: small;">指令</text></view>
				</view>
				<view class="instructions_document">
					<view class="document" @click="goToDocument">
						<view class="alert_img" style="text-align: center; padding-top: 5px;"><image src="../../../static/icon/document.png" style="width: 22px; height: 22px;"></image></view>
						<view class="text_setting" style="text-align: center;"><text style="color: #636363; font-size: small;">文件</text></view>
					</view>
					<view class="map_selector" @click="open_map_selector">
						<view class="alert_img" style="text-align: center; padding-top: 5px;"><image src="../../../static/icon/tuceng.png" style="width: 22px; height: 22px;"></image></view>
						<view class="text_setting" style="text-align: center;"><text style="color: #636363; font-size: small;">图层</text></view>
					</view>
				</view>
			</view>
		</view>
		<view>
			<!-- 详情界面弹窗 -->
			<uni-popup ref="popup" type="bottom" background-color="#fff" :mask-click="false">
				<view class="detail" style="padding: 15px;">
					<view class="detail_top">
						<view><text>现地侦查横须贺基地情况</text></view>
						<view style="margin-right: 10px;" @click="close"><image src="../../../static/icon/close.png" style="width: 15px; height: 15px;"></image></view>
					</view>
					<view class="divider"></view>
					<view class="detail_info">
						<view class="infos"><text>任务名称:  {{ taskItem.task_name }}</text></view>
						<view class="infos"><text>任务描述:  {{ taskItem.description }}</text></view>
						<view class="infos"><text>任务国家:  {{ taskItem.country }}</text></view>
						<view class="infos"><text>任务地点:  {{ taskItem.position }}</text></view>
						<view class="infos"><text>任务时间:  {{ taskItem.start_time }} - {{taskItem.end_time}}</text></view>
						<view class="infos"><text>任务口令:  {{ taskItem.key }}</text></view>
					</view>
					<view class="divider"></view>
					<view class="text_setting">
						<view style="margin-right: 50px;"><image @click="take_video()" src="../../../static/icon/video.png" style="width: 30px; height: 30px;"></image></view>
						<view style="margin-right: 50px;"><image @click="take_picture()" src="../../../static/icon/photo.png" style="width: 33px; height: 33px;"></image></view>
						<view style="margin-right: 50px;"><image @longpress="startRecording()" @touchend="stopRecording()" src="../../../static/icon/micro.png" style="width: 32px; height: 32px;"></image></view>
						<view><image @click="openDeleteTaskPopup()" src="../../../static/icon/delete.png" style="width: 28px; height: 28px;"></image></view>
					</view>
				</view>
			</uni-popup>
		</view>
		<view>
			<!-- 删除任务弹窗 -->
			<uni-popup ref="deleteTaskPopup" type="dialog">
				<uni-popup-dialog :type="msgType" cancelText="取消" confirmText="确定" title="" content="你确定要删除当前任务数据吗？" @confirm="goToMainPage()"
					@close="closeDeleteTaskPopup()"></uni-popup-dialog>
			</uni-popup>
		</view>
		<view>
			<!-- 图层弹窗 -->
			<uni-popup ref="map_selector" type="bottom" background-color="#fff" :mask-click="false">
				<view class="detail" style="padding: 15px;">
					<view class="detail_top">
						<view><text>图层切换</text></view>
						<view style="margin-right: 10px;" @click="close_map_selector"><image src="../../../static/icon/close.png" style="width: 15px; height: 15px;"></image></view>
					</view>
					<view class="divider"></view>
					<view style="margin-top: 20px;">
						<view class="map_icons">
							<view v-for="(item, index) in map_options" :key="index">
								<view class="map_icon" style="margin: 0 15px;"><image :class="{ 'selected': selectedIndex === index }"
										@click="selectImage(index)" :src=item.src style="width: 55px; height: 55px; border-radius: 15px;"></image></view>
								<view style="text-align: center;"><text>{{item.name}}</text></view>
							</view>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<view>
			<!-- 任务指令弹窗 -->
			<uni-popup
			 ref="task_instructions" type="bottom" background-color="#fff" :mask-click="false">
				<view class="detail" style="padding: 15px;">
					<view class="detail_top">
						<view><text>任务指令</text></view>
						<view style="margin-right: 10px;" @click="close_task_instructions"><image src="../../../static/icon/close.png" style="width: 15px; height: 15px;"></image></view>
					</view>
					<view class="divider"></view>
					<view style="margin-top: 20px;">
						<view class="instructions">
							<view v-for="(item, index) in task_instructions" :key = "index" 
									class="instructions_item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
								<view style="display: flex;">
									<view style="margin-right: 10px;"><image :src=item.src style="width: 45px; height: 45px;"></image></view>
									<view>
										<view><text>{{item.sender_name}}</text></view>
										<view><text style="color: #858585;">{{item.detail}}</text></view>
									</view>
								</view>
								<view>
									<button @click="receive_instruction(index)" :disabled="item.isConfirmed" class="mini-btn" type="primary" size="mini">{{isReceived(index)}}</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<view>
			<!-- 告警弹窗 -->
			<uni-popup ref="alert_popup" type="bottom" background-color="#fff">
				<view style="padding: 15px;">
					<view class="detail">
						<view class="detail_top">
							<view><text>告警列表</text></view>
							<view style="margin-right: 10px;" @click="close_alert_popup"><image src="../../../static/icon/close.png" style="width: 15px; height: 15px;"></image></view>
						</view>
						<view class="divider"></view>
					</view>
					<view>
						<view class="head-nav">
							<view :class="navIndex==0?'activite':''" @click="checkIndex(0)" style="width: 50%; text-align: center;">接收</view>
							<view :class="navIndex==1?'activite':''" @click="checkIndex(1)" style="width: 50%; text-align: center;">发送</view>
						</view>
						<!-- 内容切换 -->
						<view class="alert_content" v-if="navIndex==0">
							<uni-collapse ref="collapse" accordion>
								<uni-collapse-item v-for="(item,index) in alert_data" :key="index" :title="item.alert_content" >
									<view class="detail_info" style="margin: 0 15px 5px 0">
										<view class="infos"><text>告警等级:  {{ item.alert_grade }}</text></view>
										<view class="infos"><text>告警时间:  {{ item.alert_time }}</text></view>
										<view class="infos"><text>创建用户:  {{ item.sender_name }}</text></view>
										<view class="infos"><text>告警内容:  {{ item.alert_content }}</text></view>
										<view style="text-align: right;">
											<button class="mini-btn" type="warn" size="mini" style="margin-right: 10px;" @click="delete_alert(index)">删除</button>
											<button class="mini-btn" type="default" size="mini" @click="receive_alert(index)" :disabled='item.isConfirmed'>{{isReceived_alert(index)}}</button>
										</view>
									</view>
								</uni-collapse-item>
							</uni-collapse>
						</view>
						<view class="content" v-if="navIndex==1">
							<uni-collapse ref="collapse" accordion>
								<uni-collapse-item v-for="(item,index) in alert_data_mine" :key="index" :title="item.alert_content" >
									<view class="detail_info" style="margin: 0 15px 5px 0">
										<view class="infos"><text>告警等级:  {{ item.alert_grade }}</text></view>
										<view class="infos"><text>告警时间:  {{ item.alert_time }}</text></view>
										<view class="infos"><text>创建用户:  {{ item.sender_name }}</text></view>
										<view class="infos"><text>告警内容:  {{ item.alert_content }}</text></view>
										<view style="text-align: right;">
											<button class="mini-btn" type="warn" size="mini" style="margin-right: 10px;" @click="delete_alert_mine(index)">删除</button>
										</view>
									</view>
								</uni-collapse-item>
							</uni-collapse>
							<view>
								<button type="primary" @click="open_alert_form">发布告警</button>
							</view>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<view>
			<uni-popup ref="alert_form_popup" type="dialog">
				<view class="example" style="background: #fff; border-radius: 5px; padding: 10px;">
					<view class="detail_top">
						<view><text>发布告警</text></view>
						<view style="margin-right: 10px;" @click="close_alert_form"><image src="../../../static/icon/close.png" style="width: 15px; height: 15px;"></image></view>
					</view>
					<view class="divider"></view>
					<!-- 基础用法，不包含校验规则 -->
					<uni-forms ref="alert_form" :modelValue="alert_form_data">
						<uni-forms-item label="告警等级" style="display: flex; align-items: center;">
							<uni-data-checkbox v-model="alert_form_data.alert_grade" :localdata="grades"/>
						</uni-forms-item>
						<uni-forms-item label="告警内容">
							<uni-easyinput type="textarea" v-model="alert_form_data.alert_content" placeholder="请输入告警内容" />
						</uni-forms-item>
					</uni-forms>
					<button type="primary" @click="submit('alert_form')">提交</button>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				recorderManager: {},
				innerAudioContext: {},
				selectedIndex: 0, // 地图默认选择0：Google地图
				navIndex: 0,
				filePaths: {
					imagePath: '',
					videoPath: '',
					voicePath: ''
				},
				range: [
				  { value: '1', text: "未开始" },
				  { value: '2', text: "进行中" },
				  { value: '3', text: "已完成" },
				],
				alert_form_data:{
					alert_grade: '',
					alert_time: '',
					sender_name: '',
					alert_content: ''
				},
				grades:[
					{ text: '一般告警', value: '一般告警' },
					{ text: '严重告警', value: '严重告警' },
					{ text: '紧急告警', value: '紧急告警' },
				],
				taskItem: {},
				map_options: [
					{ src: '../../../static/icon/google.png', name: 'Google地图' },
					{ src: '../../../static/icon/gaode.png', name: '高德地图' },
					{ src: '../../../static/icon/baidu.png', name: '百度地图'},
					{ src: '../../../static/icon/outline.png', name: '离线地图'},
					// 继续添加更多图片
				],
				task_instructions: [
					{ src: '../../../static/uni.png', sender_name: 'admin', detail: '立即前往执行抓捕任务', isConfirmed: false},
					{ src: '../../../static/uni.png', sender_name: 'lihua', detail: '立即前往执行抓捕任务', isConfirmed: false},
					{ src: '../../../static/uni.png', sender_name: 'wanghao', detail: '立即前往执行抓捕任务', isConfirmed: false},
				],
				alert_data:[
					{ alert_grade: '重要告警', alert_time: '2024.5.1', sender_name: '张三', alert_content: '靠近目标，开始行动！1', isConfirmed: false},
					{ alert_grade: '一般告警', alert_time: '2024.2.6', sender_name: '李四', alert_content: '靠近目标，开始行动！2', isConfirmed: false},
					{ alert_grade: '重要告警', alert_time: '2024.1.3', sender_name: '张三', alert_content: '靠近目标，开始行动！3', isConfirmed: false},
					{ alert_grade: '严重告警', alert_time: '2024.7.9', sender_name: '张三', alert_content: '靠近目标，开始行动！4', isConfirmed: false},
				],
				alert_data_mine:[
					{ alert_grade: '一般告警', alert_time: '2024.5.1', sender_name: '张三', alert_content: '目标视野丢失'},
					{ alert_grade: '一般告警', alert_time: '2024.2.6', sender_name: '李四', alert_content: '发现嫌疑人'},
					{ alert_grade: '重要告警', alert_time: '2024.1.3', sender_name: '张三', alert_content: '行动暂停'},
					{ alert_grade: '严重告警', alert_time: '2024.7.9', sender_name: '张三', alert_content: '行动继续'},
				],
			}
		},
		onNavigationBarButtonTap() {
			this.$refs.popup.open('bottom')
		},
		onLoad(options) {
			if (options.taskItem) {
				this.taskItem = JSON.parse(options.taskItem); // 设置类型
				console.log(this.taskItem);
			} else {
				console.error('没有传递类型参数');
			};
			
			this.recorderManager = uni.getRecorderManager();
			this.innerAudioContext = uni.createInnerAudioContext();
			
			this.innerAudioContext.autoplay = true;
			
			console.log("uni.getRecorderManager()",uni.getRecorderManager())
			let self = this;
			this.recorderManager.onStop(function (res) {
				console.log('recorder stop' + JSON.stringify(res));
				self.filePaths.voicePath = res.tempFilePath;
			});
		},
		methods: {
			take_picture(){
				// 拍照并选择图片
				uni.chooseImage({
				  count: 1, // 默认选择一张图片
				  sourceType: ['camera'], // 只允许从相机拍照
				  success: function (res) {
				    // res.tempFilePaths 是选定照片的临时文件路径列表
				    const tempFilePath = res.tempFilePaths[0];
				    console.log('拍照成功，文件路径：', tempFilePath);
				    
				    // 这里可以进行图片的预览、上传等操作
				    uni.previewImage({
				      urls: [tempFilePath]
				    });
				  },
				  fail: function (err) {
				    console.error('拍照失败：', err);
				  }
				});
			},
			take_video(){
				var self = this;
				// 录制视频
				uni.chooseVideo({
				  sourceType: ['camera'], // 只允许从相机录制
				  maxDuration: 60, // 录像时长最大为60秒
				  camera: 'back', // 使用后置摄像头
				  success: function (res) {
				    // res.tempFilePath 是视频的临时文件路径
				    const tempFilePath = res.tempFilePath;
					self.filePaths.videoPath = res.tempFilePath;
				    console.log('录像成功，文件路径：', tempFilePath);
				  },
				  fail: function (err) {
				    console.error('录像失败：', err);
				  }
				});
			},
			startRecording() {
				console.log('开始录音');
				this.recorderManager.start();
				//显示加载框
				uni.showLoading({
					title: '正在录音'
				});

			},
			stopRecording() {
				console.log('录音结束');
				this.recorderManager.stop();
				uni.hideLoading()
			},
			playVoice() {
				console.log('播放录音');
				console.log('this.voicePath',this.filePaths.voicePath);
				if (this.filePaths.voicePath) {
					this.innerAudioContext.src = this.filePaths.voicePath;
					this.innerAudioContext.play();
				}
			},
			checkIndex(index) {
				console.log(index)
				this.navIndex = index;
			},
			delete_alert(index) {
				this.alert_data.splice(index, 1);
			},
			delete_alert_mine(index) {
				this.alert_data_mine.splice(index, 1);
			},
			close() {
				this.$refs.popup.close()
			},
			open_alert_form() {
				this.$refs.alert_form_popup.open()
			},
			close_alert_form(){
				this.$refs.alert_form_popup.close()
			},
			open_alert_popup() {
				this.$refs.alert_popup.open()
			},
			close_alert_popup() {
				this.$refs.alert_popup.close()
			},
			open_map_selector() {
				this.$refs.map_selector.open()
			},
			close_map_selector() {
				this.$refs.map_selector.close()
			},
			open_task_instructions() {
				this.$refs.task_instructions.open()
			},
			close_task_instructions() {
				this.$refs.task_instructions.close()
			},
			closeDeleteTaskPopup(){
				this.$refs.deleteTaskPopup.close()
			},
			openDeleteTaskPopup(){
				this.$refs.deleteTaskPopup.open()
			},
			goToDocument(){
				uni.navigateTo({
					url: '/pages/task/task_detail/document/document'
				})
			},
			goToMainPage(){
				uni.redirectTo({
					url: '/pages/tabBar/tabBar'
				})
			},
			selectImage(index) {
				this.selectedIndex = index; // 设置选中索引
				if(index === 1){
					uni.navigateTo({
						url: '/pages/task/task_detail/map_test/map_test'
					})
				}else if(index === 2){
					uni.navigateTo({
						url: '/pages/task/task_detail/baidu_map/baidu_map'
					})
				}
			},
			receive_instruction(index){
				this.task_instructions[index].isConfirmed = true;
			},
			receive_alert(index){
				this.alert_data[index].isConfirmed = true;
			},
			isReceived(index) {
				return this.task_instructions[index].isConfirmed ? "已收到" : "收到";
			},
			isReceived_alert(index) {
				return this.alert_data[index].isConfirmed ? "已确认" : "确认";
			},
			submit(ref) {
				this.$refs[ref].validate().then(res => {
					console.log('success', res);
					uni.showToast({
						title: `发布成功`
					})
				}).catch(err => {
					console.log('err', err);
				});
				// 获取当前时间
				const now = new Date();
				
				// 格式化为 YYYY-MM-DD HH:mm:ss
				const formattedDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;				
				console.log(formattedDateTime); // 输出格式为 YYYY-MM-DD HH:mm:ss
				this.alert_form_data.alert_time = formattedDateTime;
				this.alert_form_data.sender_name = "lihua";
				this.alert_data.push(this.alert_form_data);
				this.alert_data_mine.push(this.alert_form_data);
				this.$refs.alert_form_popup.close()
			},
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
		height: 35px;
		background: #f9f9f9;
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
	.divider {  
	  height: 1px;  
	  background-color: #ccc; /* 分割线的颜色 */
	  margin: 10px 0; /* 分割线的上下间距 */
	}
	.detail_top{
		display: flex;
		justify-content: space-between; /* 两侧分开 */
	}
	.detail_info{
		box-sizing: border-box; /* 包括内边距和边框 */
		width: 100%;
		padding: 10px;
		background: #edf2fa;
	}
	.infos{
		margin-bottom: 5px;
	}
	.map_icons{
		display: flex;
		align-items: center;/* 垂直居中 */
		justify-content: center;
	}
	.selected {
	    border: 2px solid #288ff4; /* 设置选中时的边框 */
	}
	.head-nav {
		display: flex;
		align-items: center;
		color: #CCCCCC;
		height: 40px;
	}

	.activite {
		color: #04c9c3;
	}

	.head-nav>view {
		padding-bottom: 10rpx;
	}
	.alert_content {
		/* background: #008000; */
		height: 100%;
	}
</style>
