<template>
	<!-- 地图容器 -->
	<div id="map_container" :selectedMap="selectedMap" :change:selectedMap="m.setMapType" :replay
		:change:replay='m.getReplay' :position="position" :change:position='m.getPosition' />
	<!-- task_detail -->
	<view class="layout_task_detail">
		<!-- 按钮组 -->
		<view class="condition_icons">
			<!-- 左侧-选择任务状态按钮 -->
			<view class="condition_selector">
				<uni-data-select v-model="taskItem.type" :localdata="range" :clear="false"></uni-data-select>
			</view>
			<view class="condition_selector">
				<button class="mini-btn" type="primary" size="mini" @click="setReplay(!replay)">
					<text v-if="!replay">
						行动回溯
					</text>
					<text v-else>
						正在回溯
					</text>
				</button>
			</view>
			<!-- 右侧按钮组 -->
			<view class="right-button-groups">
				<!-- 告警按钮 -->
				<view class="instructions_alert" @click="open_alert_popup">
					<view class="alert_img" style="text-align: center; padding-top: 5px;">
						<image src="/static/icon/alert.png" style="width: 22px; height: 22px;"></image>
					</view>
					<view class="text_setting" style="text-align: center;"><text
							style="color: #d81e06; font-size: small;">告警</text></view>
				</view>
				<!-- 指令按钮 -->
				<view class="instructions_instruct" @click="open_task_instructions">
					<view class="alert_img" style="text-align: center; padding-top: 5px;">
						<image src="/static/icon/flag.png" style="width: 22px; height: 22px;"></image>
					</view>
					<view class="text_setting" style="text-align: center;"><text
							style="color: #3171d3; font-size: small;">指令</text></view>
				</view>
				<!-- 文件按钮+图层按钮 -->
				<view class="instructions_document">
					<!-- 文件按钮 -->
					<view class="document" @click="goToDocument">
						<view class="alert_img" style="text-align: center; padding-top: 5px;">
							<image src="/static/icon/document.png" style="width: 22px; height: 22px;"></image>
						</view>
						<view class="text_setting" style="text-align: center;"><text
								style="color: #636363; font-size: small;">文件</text></view>
					</view>
					<!-- 图层按钮 -->
					<view class="map_selector" @click="open_map_selector">
						<view class="alert_img" style="text-align: center; padding-top: 5px;">
							<image src="/static/icon/tuceng.png" style="width: 22px; height: 22px;"></image>
						</view>
						<view class="text_setting" style="text-align: center;"><text
								style="color: #636363; font-size: small;">图层</text></view>
					</view>
				</view>
			</view>
		</view>
		<!-- 详情界面弹窗 -->
		<view>
			<uni-popup ref="popup" type="bottom" background-color="#fff" :mask-click="false">
				<view class="detail" style="padding: 15px;">
					<view class="detail_top">
						<view><text>{{taskItem.task_name}}</text></view>
						<view style="margin-right: 10px;" @click="close">
							<image src="/static/icon/close.png" style="width: 15px; height: 15px;"></image>
						</view>
					</view>
					<view class="divider"></view>
					<view class="detail_info">
						<view class="infos"><text>任务名称: {{ taskItem.task_name }}</text></view>
						<view class="infos"><text>任务描述: {{ taskItem.description }}</text></view>
						<view class="infos"><text>任务国家: {{ taskItem.country }}</text></view>
						<view class="infos"><text>任务地点: {{ taskItem.position }}</text></view>
						<view class="infos"><text>任务时间: {{ taskItem.start_time }} - {{ taskItem.end_time }}</text>
						</view>
						<view class="infos"><text>任务口令: {{ taskItem.key }}</text></view>
					</view>
					<view class="divider"></view>
					<view class="text_setting">
						<!-- 录制视频按钮 -->
						<view style="margin-right: 50px;">
							<image @click="take_video()" src="../../../static/icon/video.png"
								style="width: 30px; height: 30px;"></image>
						</view>
						<!-- 拍摄照片按钮 -->
						<view style="margin-right: 50px;">
							<image @click="take_picture()" src="../../../static/icon/photo.png"
								style="width: 33px; height: 33px;"></image>
						</view>
						<!-- 录制音频按钮 -->
						<view style="margin-right: 50px;">
							<image @longpress="startRecording()" @touchend="stopRecording()"
								src="../../../static/icon/micro.png" style="width: 32px; height: 32px;"></image>
						</view>
						<!-- 删除任务按钮 -->
						<view>
							<image src="../../../static/icon/delete.png" style="width: 28px; height: 28px;"
								@click="deleteMisson"></image>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<!-- 图层弹窗 -->
		<view>
			<uni-popup ref="map_selector" type="bottom" background-color="#fff" :mask-click="false">
				<view class="detail" style="padding: 15px;">
					<view class="detail_top">
						<view><text>图层切换</text></view>
						<view style="margin-right: 10px;" @click="close_map_selector">
							<image src="../../../static/icon/close.png" style="width: 15px; height: 15px;"></image>
						</view>
					</view>
					<view class="divider"></view>
					<view style="margin-top: 20px;">
						<view class="map_icons">
							<view v-for="(item, index) in map_options" :key="index">
								<view class="map_icon" style="margin: 0 15px;">
									<!-- 									<image :class="{ 'selected': selectedIndex === index }" @click="selectImage(index)"
										:src=item.src style="width: 55px; height: 55px; border-radius: 15px;"></image> -->
									<image :class="{ 'selected': selectedMap === item.key }"
										@click="selectImage(item.key)" :src=item.src
										style="width: 55px; height: 55px; border-radius: 15px;"></image>
								</view>
								<view style="text-align: center;"><text>{{ item.name }}</text></view>
							</view>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<!-- 任务指令弹窗 -->
		<view>
			<uni-popup ref="task_instructions" type="bottom" background-color="#fff" :mask-click="false">
				<view class="detail" style="padding: 15px;">
					<view class="detail_top">
						<view><text>任务指令</text></view>
						<view style="margin-right: 10px;" @click="close_task_instructions">
							<image src="../../../static/icon/close.png" style="width: 15px; height: 15px;"></image>
						</view>
					</view>
					<view class="divider"></view>
					<view style="margin-top: 20px;">
						<view class="instructions">
							<view v-for="(item, index) in task_instructions" :key="index" class="instructions_item"
								style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
								<view style="display: flex;">
									<view style="margin-right: 10px;">
										<image :src=item.src style="width: 45px; height: 45px;"></image>
									</view>
									<view>
										<view><text>{{ item.sender_name }}</text></view>
										<view><text style="color: #858585;">{{ item.detail }}</text></view>
									</view>
								</view>
								<view>
									<button @click="receive_instruction(index)" :disabled="item.isConfirmed"
										class="mini-btn" type="primary" size="mini">{{ isReceived(index) }}</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
		<!-- 告警弹窗 -->
		<view>
			<uni-popup ref="alert_popup" type="bottom" background-color="#fff">
				<view style="padding: 15px;">
					<view class="detail">
						<view class="detail_top">
							<view><text>告警列表</text></view>
							<view style="margin-right: 10px;" @click="close_alert_popup">
								<image src="../../../static/icon/close.png" style="width: 15px; height: 15px;"></image>
							</view>
						</view>
						<view class="divider"></view>
					</view>
					<view>
						<view class="head-nav">
							<view :class="navIndex == 0 ? 'activite' : ''" @click="checkIndex(0)"
								style="width: 50%; text-align: center;">接收</view>
							<view :class="navIndex == 1 ? 'activite' : ''" @click="checkIndex(1)"
								style="width: 50%; text-align: center;">发送</view>
						</view>
						<!-- 内容切换 -->
						<view class="alert_content" v-if="navIndex == 0">
							<uni-collapse ref="collapse" accordion>
								<uni-collapse-item v-for="(item, index) in alert_data" :key="index"
									:title="item.alert_content">
									<view class="detail_info" style="margin: 0 15px 5px 0">
										<view class="infos"><text>告警等级: {{ item.alert_grade }}</text></view>
										<view class="infos"><text>告警时间: {{ item.alert_time }}</text></view>
										<view class="infos"><text>创建用户: {{ item.sender_name }}</text></view>
										<view class="infos"><text>告警内容: {{ item.alert_content }}</text></view>
										<view style="text-align: right;">
											<button class="mini-btn" type="warn" size="mini" style="margin-right: 10px;"
												@click="delete_alert(index)">删除</button>
											<button class="mini-btn" type="default" size="mini"
												@click="receive_alert(index)" :disabled='item.isConfirmed'>{{
													isReceived_alert(index) }}</button>
										</view>
									</view>
								</uni-collapse-item>
							</uni-collapse>
						</view>
						<view class="content" v-if="navIndex == 1">
							<uni-collapse ref="collapse" accordion>
								<uni-collapse-item v-for="(item, index) in alert_data_mine" :key="index"
									:title="item.alert_content">
									<view class="detail_info" style="margin: 0 15px 5px 0">
										<view class="infos"><text>告警等级: {{ item.alert_grade }}</text></view>
										<view class="infos"><text>告警时间: {{ item.alert_time }}</text></view>
										<view class="infos"><text>创建用户: {{ item.sender_name }}</text></view>
										<view class="infos"><text>告警内容: {{ item.alert_content }}</text></view>
										<view style="text-align: right;">
											<button class="mini-btn" type="warn" size="mini" style="margin-right: 10px;"
												@click="delete_alert_mine(index)">删除</button>
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
		<!-- 发布告警弹窗 -->
		<view>
			<uni-popup ref="alert_form_popup" type="dialog">
				<view class="example" style="background: #fff; border-radius: 5px; padding: 10px;">
					<view class="detail_top">
						<view><text>发布告警</text></view>
						<view style="margin-right: 10px;" @click="close_alert_form">
							<image src="../../../static/icon/close.png" style="width: 15px; height: 15px;"></image>
						</view>
					</view>
					<view class="divider"></view>
					<!-- 基础用法，不包含校验规则 -->
					<uni-forms ref="alert_form" :modelValue="alert_form_data">
						<uni-forms-item label="告警等级" style="display: flex; align-items: center;">
							<uni-data-checkbox v-model="alert_form_data.alert_grade" :localdata="grades" />
						</uni-forms-item>
						<uni-forms-item label="告警内容">
							<uni-easyinput type="textarea" v-model="alert_form_data.alert_content"
								placeholder="请输入告警内容" />
						</uni-forms-item>
					</uni-forms>
					<button type="primary" @click="submit('alert_form')">提交</button>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script module="m" lang="renderjs">
	import {
		points
	} from "../../../static/route/points.js"
	import {
		tileUrls
	} from "../../../config.js"
	import "../../../static/leaflet/leaflet.js"
	let map = null;
	let baseTileLayer = null;
	let markers = [];
	export default {
		data() {
			return {
				baiduApiKey: 'A0Pr9wGe6p6C8pFIBeC2tt7QqQ8oDlCD',
				gaodeApiKey: 'caa070a3ebda631bea2feff72972f28c',
				gaodeSecurityKey: '93849873dba769e7b6235a79330ae7f7',
				position: {
					longitude: 120.686250,
					latitude: 24.182220,
				},
				mapType: 'gaode',
			}
		},
		created() {

		},
		mounted() {
			// 设置当前地图中心点
			this.$ownerInstance.callMethod('setPoint');
		},
		methods: {
			/** position变更时调用方法
			 * @param {Object} position
			 */
			getPosition(position) {
				this.position = position;
				console.log(this.position, 'position')
				if (map == null) {
					this.initMap();
				}
				if (map != null) {
					map.setView(L.latLng(this.position.latitude,this.position.longitude), 12);
					// 加载行动轨迹
					this.getLine();
				}
			},
			/** mathType变更时调用方法
			 * @param {Object} position
			 */
			setMapType(value) {
				this.mapType = value;
				this.changeMap(this.mapType);
			},
			/** 初始化地图
			 */
			initMap() {
				var container = L.DomUtil.get('map_container');
				if (container != null) {
					container._leaflet_id = null;
					L.DomUtil.empty(container);
				}
				// 初始化地图容器
				map = L.map('map_container', {
					zoom: 12,
					center: [this.position.latitude, this.position.longitude],
					zoomControl: false, //禁用 + - 按钮
					attributionControl: false, // 移除右下角leaflet标识
				});
				// 添加底图图层
				baseTileLayer = L.tileLayer(tileUrls['gaode'].url)
				baseTileLayer.addTo(map);
				// 取消右下角版权表leaflet前缀,添加至地图
				L.control.attribution({
					prefix: ''
				}).addTo(map);
			},
			/**  切换地图
			 * @param {String} mapType 地图类型
			 */
			changeMap(mapType) {
				console.log("change-to-" + mapType)
				// 移除原底图图层
				baseTileLayer.remove();
				// 添加对应图层
				baseTileLayer = L.tileLayer(
					tileUrls[mapType].url, {
						attribution: `&copy;${tileUrls[mapType].name}`
					}
				)
				baseTileLayer.addTo(map);
			},
			/** 任务回溯状态变更时调用方法
			 * @param {Boolean} replay
			 */
			getReplay(replay) {
				this.replay = replay;
				if (replay) {
					this.replayMission();
				}
			},
			replayMission() {
				let index = 1;
				// 设置起始点
				map.flyTo([points[0].latitude, points[0].longitude], 15);
				marker[0].openPopup();
				// 定时器回溯
				const interval = setInterval(() => {
					// 回溯结束
					if (index >= points.length || !this.replay) {
						clearInterval(interval);
						// 设置回溯状态为false
						this.$ownerInstance.callMethod('setReplay', false);
						return;
					}
					const point = points[index];
					// 移动至对应点
					map.flyTo([point.latitude, point.longitude], 15);
					// 弹出点标记
					markers[index].openPopup();
					index++;
				}, 4000);
			},
			/** 绘制点与点之间的线段
			 * @param {Array} points 轨迹点
			 */
			addLine(points) {
				let latlngs = points.map(point => [point.latitude, point.longitude])
				var polyline = L.polyline(latlngs, {
					color: 'red'
				}).addTo(map).bringToFront();
			},
			/** 添加点标记
			 * @param {Object} point
			 */
			addMarker(point) {
				var marker = L.marker([point.latitude, point.longitude]).addTo(map);
				marker.bindPopup(`<view style="display:flex;flex-direction:column"><text>${point.description}</text>
							<image src='${point.image}' style="max-width: 300px; max-height: 300px;"/></view>`);
				markers.push(marker);
			},
			getLine() {
				// 加载行动轨迹
				let prev = null;
				let index = 0;

				for (let index = 0; index < points.length; index++) {
					let curr = points[index];
					// 加载地图点
					this.addMarker(curr);
					// 加载连线
				};
				this.addLine(points);
			}
		}
	}
</script>

<script>
	import {
		deleteMission
	} from '@/utils/api/mission.js'
	import {
		backendHost
	} from '/config.js';
	export default {
		data() {
			return {
				recorderManager: {},
				innerAudioContext: {},
				selectedMap: 'gaode', //当前地图
				navIndex: 0,
				filePaths: {
					imagePath: '',
					videoPath: '',
					voicePath: ''
				},
				range: [{
						value: '1',
						text: "未开始"
					},
					{
						value: '2',
						text: "进行中"
					},
					{
						value: '3',
						text: "已完成"
					},
				],
				alert_form_data: {
					alert_grade: '',
					alert_time: '',
					sender_name: '',
					alert_content: ''
				},
				grades: [{
						text: '一般告警',
						value: '一般告警'
					},
					{
						text: '严重告警',
						value: '严重告警'
					},
					{
						text: '紧急告警',
						value: '紧急告警'
					},
				],
				taskItem: {},
				position: {
					longitude: '120.686250',
					latitude: '24.182220',
				},
				map_options: [{
						key: 'google',
						src: '../../../static/icon/google.png',
						htmlSrc: '/static/html/map_gaode.html',
						name: 'Google地图'
					},
					{
						key: 'gaode',
						src: '../../../static/icon/gaode.png',
						htmlSrc: '/static/html/map_gaode.html',
						name: '高德地图'
					},
					{
						key: 'baidu',
						src: '../../../static/icon/baidu.png',
						htmlSrc: '/static/html/map_baidu.html',
						name: '百度地图'
					},
					{
						key: 'local',
						src: '../../../static/icon/offline.png',
						htmlSrc: '/static/html/map_gaode.html',
						name: '离线地图'
					},
					// 继续添加更多图片
				],
				task_instructions: [{
						src: '../../../static/uni.png',
						sender_name: 'admin',
						detail: '立即前往执行抓捕任务',
						isConfirmed: false
					},
					{
						src: '../../../static/uni.png',
						sender_name: 'lihua',
						detail: '立即前往执行抓捕任务',
						isConfirmed: false
					},
					{
						src: '../../../static/uni.png',
						sender_name: 'wanghao',
						detail: '立即前往执行抓捕任务',
						isConfirmed: false
					},
				],
				alert_data: [{
						alert_grade: '重要告警',
						alert_time: '2024.5.1',
						sender_name: '张三',
						alert_content: '靠近目标，开始行动！1',
						isConfirmed: false
					},
					{
						alert_grade: '一般告警',
						alert_time: '2024.2.6',
						sender_name: '李四',
						alert_content: '靠近目标，开始行动！2',
						isConfirmed: false
					},
					{
						alert_grade: '重要告警',
						alert_time: '2024.1.3',
						sender_name: '张三',
						alert_content: '靠近目标，开始行动！3',
						isConfirmed: false
					},
					{
						alert_grade: '严重告警',
						alert_time: '2024.7.9',
						sender_name: '张三',
						alert_content: '靠近目标，开始行动！4',
						isConfirmed: false
					},
				],
				alert_data_mine: [{
						alert_grade: '一般告警',
						alert_time: '2024.5.1',
						sender_name: '张三',
						alert_content: '目标视野丢失'
					},
					{
						alert_grade: '一般告警',
						alert_time: '2024.2.6',
						sender_name: '李四',
						alert_content: '发现嫌疑人'
					},
					{
						alert_grade: '重要告警',
						alert_time: '2024.1.3',
						sender_name: '张三',
						alert_content: '行动暂停'
					},
					{
						alert_grade: '严重告警',
						alert_time: '2024.7.9',
						sender_name: '张三',
						alert_content: '行动继续'
					},
				],
				// 行动回溯，false停止，true播放
				replay: false
			}
		},
		onNavigationBarButtonTap() {
			this.$refs.popup.open('bottom')
		},
		onLoad(options) {
			// 页面加载时执行
			if (options.taskItem) {
				this.taskItem = JSON.parse(options.taskItem); // 设置类型
			} else {
				console.error('没有传递类型参数');
			};

			this.recorderManager = uni.getRecorderManager();
			this.innerAudioContext = uni.createInnerAudioContext();

			this.innerAudioContext.autoplay = true;

			console.log("uni.getRecorderManager()", uni.getRecorderManager())
			let self = this;
			this.recorderManager.onStop(function(res) {
				console.log('recorder stop' + JSON.stringify(res));
				self.filePaths.voicePath = res.tempFilePath;
			});
		},
		methods: {
			take_picture() {
				// 拍照并选择图片
				uni.chooseImage({
					count: 1, // 默认选择一张图片
					sourceType: ['camera'], // 只允许从相机拍照
					success: function(res) {
						// res.tempFilePaths 是选定照片的临时文件路径列表
						const tempFilePath = res.tempFilePaths[0];
						console.log('拍照成功，文件路径：', tempFilePath);

						// 这里可以进行图片的预览、上传等操作
						uni.previewImage({
							urls: [tempFilePath]
						});
						// 文件上传
						uni.uploadFile({
							url: `${backendHost}/minio/upload?isGroup=${false}&missionId=${'d56f22fe8f3c40bdba6c0ad609e2f3e6'}&receptionId=${'69fc9284fc5d4dd7b05092af4715ab9d'}`,
							filePath: tempFilePath,
							name: 'file',
							header: {
								'Content-Type': 'application/form-data;charset=UTF-8',
								'Authorization': 'Bearer ' + uni.getStorageSync('token'),
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
								} else {
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
					},
					fail: function(err) {
						console.error('拍照失败：', err);
					}
				});
			},
			take_video() {
				var self = this;
				// 录制视频
				uni.chooseVideo({
					sourceType: ['camera'], // 只允许从相机录制
					maxDuration: 60, // 录像时长最大为60秒
					camera: 'back', // 使用后置摄像头
					success: function(res) {
						// res.tempFilePath 是视频的临时文件路径
						const tempFilePath = res.tempFilePath;
						self.filePaths.videoPath = res.tempFilePath;
						console.log('录像成功，文件路径：', tempFilePath);
						// 文件上传
						uni.uploadFile({
							url: `${backendHost}/minio/upload?isGroup=${false}&missionId=${'d56f22fe8f3c40bdba6c0ad609e2f3e6'}&receptionId=${'69fc9284fc5d4dd7b05092af4715ab9d'}`,
							filePath: tempFilePath,
							name: 'file',
							header: {
								'Content-Type': 'application/form-data;charset=UTF-8',
								'Authorization': 'Bearer ' + uni.getStorageSync('token'),
							},
							success: (uploadFileRes) => {
								var res = JSON.parse(uploadFileRes.data);
								if (res.code === 200) {
									uni.showToast({
										title: '视频上传成功！',
										//将值设置为 success 或者直接不用写icon这个参数
										icon: 'success',
										//显示持续时间为 1秒
										duration: 2000
									});
								} else {
									uni.showToast({
										title: '视频上传失败！',
										icon: 'none',
										//显示持续时间为 1秒
										duration: 2000
									});
								}

								console.log(uploadFileRes.data);
							}
						});
					},
					fail: function(err) {
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
				console.log('this.voicePath', this.filePaths.voicePath);
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
			close_alert_form() {
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
			goToDocument() {
				uni.navigateTo({
					url: '/pages/task/task_detail/document/document'
				})
			},
			goToMainPage() {
				uni.redirectTo({
					url: '/pages/tabBar/tabBar'
				})
			},
			selectImage(value) {
				// this.selectedIndex = index; // 设置选中索引
				this.selectedMap = value; // 设置选中地图
				this.$refs.map_selector.close()
			},
			receive_instruction(index) {
				this.task_instructions[index].isConfirmed = true;
			},
			receive_alert(index) {
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
				const formattedDateTime =
					`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
				console.log(formattedDateTime); // 输出格式为 YYYY-MM-DD HH:mm:ss
				this.alert_form_data.alert_time = formattedDateTime;
				this.alert_form_data.sender_name = "lihua";
				this.alert_data.push(this.alert_form_data);
				this.alert_data_mine.push(this.alert_form_data);
				this.$refs.alert_form_popup.close()
			},
			// 设置经纬度
			setPoint() {
				this.position.latitude = this.taskItem.latitude;
				this.position.longitude = this.taskItem.longitude;
			},
			// 删除任务
			deleteMisson() {
				const id = this.taskItem.id;
				uni.showModal({
					title: '提示',
					content: '确定删除任务？',
					success: function(res) {
						uni.showLoading({
							title: "正在删除",
							mask: true
						});
						deleteMission(id).then((res) => {
							uni.hideLoading();
							if (res.code == 200) {
								uni.showToast({
									title: '删除成功',
									duration: 2000
								})
							} else {
								uni.showToast({
									title: res.msg,
									duration: 2000
								})
							}
						})
					}
				});
			},
			setReplay(value) {
				this.replay = value;
			},
		}
	}
</script>

<style lang="scss">
	@import url("/static/leaflet/leaflet.css");

	.layout_task_detail {
		/* 确保填满整个视口 */
		height: 100vh;
		z-index: 20;
	}

	#map_container {
		height: 100%;
		width: 100%;
		position: absolute;
		left: 0;
		tip: 0;
		z-index: 0;
	}

	.condition_icons {
		display: flex;
		justify-content: space-between;
		/* 两侧分开 */
		padding: 15px;
		width: 100%;
		// 消除内边距影响
		box-sizing: border-box;
		position: absolute;
		top: 0;
		left: 0;
	}

	.condition_selector {
		width: 70px;
		height: 35px;
		background: #f9f9f9;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.instructions_alert {
		width: 50px;
		height: 50px;
		background: #f9f9f9;
		box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.2);
		/* 水平偏移、垂直偏移、模糊半径、颜色 */
		border-radius: 3px;
		margin-bottom: 10px;
	}

	.instructions_instruct {
		width: 50px;
		height: 50px;
		background: #f9f9f9;
		box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.2);
		/* 水平偏移、垂直偏移、模糊半径、颜色 */
		border-radius: 3px;
		margin-bottom: 10px;
	}

	.instructions_document {
		width: 50px;
		height: 100px;
		background: #f9f9f9;
		box-shadow: 2px 4px 4px rgba(0, 0, 0, 0.2);
		/* 水平偏移、垂直偏移、模糊半径、颜色 */
		border-radius: 3px;
		margin-bottom: 10px;
	}

	.text_setting {
		display: flex;
		align-items: center;
		/* 垂直居中 */
		justify-content: center;
	}

	.divider {
		height: 1px;
		background-color: #ccc;
		/* 分割线的颜色 */
		margin: 10px 0;
		/* 分割线的上下间距 */
	}

	.detail_top {
		display: flex;
		justify-content: space-between;
		/* 两侧分开 */
	}

	.detail_info {
		box-sizing: border-box;
		/* 包括内边距和边框 */
		width: 100%;
		padding: 10px;
		background: #edf2fa;
	}

	.infos {
		margin-bottom: 5px;
	}

	.map_icons {
		display: flex;
		align-items: center;
		/* 垂直居中 */
		justify-content: center;
	}

	.selected {
		border: 2px solid #288ff4;
		/* 设置选中时的边框 */
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