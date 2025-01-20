<template>
	<view>
		<uni-nav-bar :fixed="true" status-bar shadow rightIcon="more-filled" @clickRight="open" title="任务详情" />
	</view>
	<!-- 地图容器 -->
	<view id="map_container" :selectedMap="selectedMap" :change:selectedMap="m.setMapType" :replay
		:change:replay='m.setReplay' :position="position" :change:position='m.setPosition' :geoJson="geoJson"
		:change:geoJson='m.setGeoJson' />
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
					<view style="height: 50px;">
						
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
					<view style="height: 50px;">
						
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
					<view v-if="instruct_none" style="text-align: center;">
						<image  src="../../../static/images/none.png" style="width: 60%; height: 60%;" mode="widthFix"></image>
						<view>暂未发现任务指令</view>
					</view>
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
					<view style="height: 50px;">
						
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
							<view v-if="alert_none1" style="text-align: center;">
								<image  src="../../../static/images/none.png" style="width: 60%; height: 60%;" mode="widthFix"></image>
								<view>暂未发现告警信息</view>
							</view>
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
							<view v-if="alert_none2" style="text-align: center; margin-bottom: 15px;" >
								<image  src="../../../static/images/none.png" style="width: 60%; height: 60%;" mode="widthFix"></image>
								<view>暂未发现告警信息</view>
							</view>
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
					<view style="height: 50px;">
						
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
	import "../../../static/leaflet/proj4.js"
	import "../../../static/leaflet/proj4leaflet.js"
	// 引入leaflet库
	let map = null;
	let baseTileLayer = null;
	let markers = [];
	let featureGroup = L.featureGroup();
	L.CRS.Baidu = new L.Proj.CRS('EPSG:900913',
		'+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs', {
			resolutions: function() {
				var level = 21
				var res = [];
				res[0] = Math.pow(2, 18);
				for (var i = 1; i < level; i++) {
					res[i] = Math.pow(2, (18 - i))
				}
				return res;
			}(),
			origin: [0, 0],
			bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
		});
	export default {
		data() {
			return {
				position: {
					longitude: 120.686250,
					latitude: 24.182220,
				},
				mapType: 'gaode',
				geoJson: null
			}
		},
		created() {

		},
		mounted() {
			// 设置当前地图中心点
			// this.$ownerInstance.callMethod('setPoint');
			console.log(this.position,'m,this.position')
			// 设置geoJson数据
			// this.$ownerInstance.callMethod('setGeoJson');
			this.$nextTick(() => {
				this.initMap();
				this.getLine();
				// 加载geoJson数据
				this.addGeoJsonLayer(this.geoJson, 'red', featureGroup);
			});
		},
		methods: {
			/** position变更时调用方法
			 * @param {Object} position
			 */
			setPosition(position) {
				console.log(position,"m.position")
				this.position = position;
				if (map != null) {
					map.setView(L.latLng(this.position.latitude, this.position.longitude), 12);
				}
			},
			/** 
			 * mathType变更时调用方法
			 * @param {Object} position
			 */
			setMapType(value) {
				if (this.mapType == 'baidu' || value == 'baidu') {
					this.mapType = value;
					this.initMap();
					// 加载行动轨迹
					this.getLine();
					// 加载geoJson数据
					// 加载geoJson数据
					this.addGeoJsonLayer(this.geoJson, 'red', featureGroup);
				} else {
					this.mapType = value;
					this.changeMap(this.mapType);
					// 加载geoJson数据
					// this.addGeoJsonLayer(this.geoJson, 'red', featureGroup);
				}
			},
			/** 任务回溯状态变更时调用方法
			 * @param {Boolean} replay
			 */
			setReplay(replay) {
				this.replay = replay;
				if (replay) {
					this.replayMission();
				}
			},
			/**
			 * GeoJson变更时调用方法
			 * @param {Object} geoJson
			 */
			setGeoJson(value) {
				this.geoJson = value;
				// console.log(value, 'geoJson');
				// 加载geoJson数据
				this.addGeoJsonLayer(this.geoJson, 'red', featureGroup);
			},
			/** 初始化地图
			 */
			initMap() {
				// 清除原有地图容器
				if(map!=null){
					map.remove();
				}
				var container = L.DomUtil.get('map_container');
				if (container != null) {
					container._leaflet_id = null;
					L.DomUtil.empty(container);
				}
				// 判断是否为百度地图
				if (this.mapType == 'baidu') {
					// 初始化地图容器
					map = L.map('map_container', {
						crs: L.CRS.Baidu,
						zoom: 12,
						center: [this.position.latitude, this.position.longitude],
						zoomControl: false, //禁用 + - 按钮
						attributionControl: false, // 移除右下角leaflet标识
					});
					// 添加底图图层
					baseTileLayer = L.tileLayer(tileUrls[this.mapType].url, {
						tms: true,
						subdomains: tileUrls[this.mapType].subdomains,
						attribution: `&copy;${tileUrls[this.mapType].name}`,
					})
					baseTileLayer.addTo(map);
				} else {
					// 初始化地图容器
					map = L.map('map_container', {
						zoom: 12,
						center: [this.position.latitude, this.position.longitude],
						zoomControl: false, //禁用 + - 按钮
						attributionControl: false, // 移除右下角leaflet标识
					});
					// 添加底图图层
					baseTileLayer = L.tileLayer(tileUrls[this.mapType].url, {
						subdomains: tileUrls[this.mapType].subdomains,
						attribution: `&copy;${tileUrls[this.mapType].name}`,
					})
					baseTileLayer.addTo(map);
				}

				// 取消右下角版权表leaflet前缀,添加至地图
				L.control.attribution({
					prefix: ''
				}).addTo(map);
				// 重新计算地图尺寸
				setTimeout(() => {
					map.invalidateSize();
				}, 500);
			},
			/**  切换地图
			 * @param {String} mapType 地图类型
			 */
			changeMap(mapType) {
				// 移除原底图图层
				if (baseTileLayer != null) {
					baseTileLayer.remove();
					// 移除所有 attribution 信息
					const attributions = map.attributionControl._attributions;
					for (const attr in attributions) {
						if (attributions.hasOwnProperty(attr)) {
							map.attributionControl.removeAttribution(attr);
						}
					}
				}
				// 添加对应图层
				baseTileLayer = L.tileLayer(
					tileUrls[mapType].url, {
						attribution: `&copy;${tileUrls[mapType].name}`,
						subdomains: tileUrls[this.mapType].subdomains
					}
				)
				baseTileLayer.addTo(map);
				// 重新计算地图尺寸
				setTimeout(() => {
					map.invalidateSize();
				}, 500);
			},
			replayMission() {
				let index = 1;
				// 设置起始点
				map.flyTo([points[0].latitude, points[0].longitude], 15);
				markers[0].openPopup();
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
			addGeoJsonLayer(geoJson, color, featureGroup) {
				if (!geoJson) {
					return;
				}
				// 清除featureGroup中所有图层
				if (featureGroup) {
					featureGroup.eachLayer((layer) => {
						map.removeLayer(layer);
					});
					featureGroup = L.featureGroup();
				}
				// 加载geojson数据
				L.geoJSON(geoJson, {
					style: {
						color: color
					},
					onEachFeature: (_feature, layer) => {
						featureGroup.addLayer(layer);
					}
				}).addTo(map);
			},
			getLine() {
				// 加载行动轨迹
				let prev = null;
				let index = 0;
				markers = [];
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
		deleteMission,
		getMissionDetails,
		searchMission
	} from '@/utils/api/mission.js'
	import {
		backendHost
	} from '/config.js';
	import {
		getOrderList,
		getWarningList,
		sendWarning
	} from '@/utils/api/order.js'
	import {
		searchUser
	} from '@/utils/api/user.js'
	import {
		toRaw
	} from 'vue'
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	
	innerAudioContext.autoplay = true;
	export default {
		data() {
			return {
				selectedMap: 'gaode', //当前地图
				navIndex: 0,
				instruct_none: false,
				alert_none1: false,
				alert_none2: false,
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
						src: '../../static/icon/google.png',
						htmlSrc: '/static/html/map_gaode.html',
						name: '谷歌地图'
					},
					{
						key: 'gaode',
						src: '../../static/icon/gaode.png',
						htmlSrc: '/static/html/map_gaode.html',
						name: '高德地图'
					},
					{
						key: 'baidu',
						src: '../../static/icon/baidu.png',
						htmlSrc: '/static/html/map_baidu.html',
						name: '百度地图'
					},
					{
						key: 'local',
						src: '../../static/icon/offline.png',
						htmlSrc: '/static/html/map_gaode.html',
						name: '离线地图'
					},
					// 继续添加更多图片
				],
				task_instructions: [
					// {
					// 	src: '../../../static/uni.png',
					// 	sender_name: 'admin',
					// 	detail: '测试指令1',
					// 	isConfirmed: false
					// },
					// {
					// 	src: '../../../static/uni.png',
					// 	sender_name: 'lihua',
					// 	detail: '测试指令2',
					// 	isConfirmed: false
					// },
					// {
					// 	src: '../../../static/uni.png',
					// 	sender_name: 'wanghao',
					// 	detail: '测试指令3',
					// 	isConfirmed: false
					// },
				],
				alert_data: [
					// {
					// 	alert_grade: '重要告警',
					// 	alert_time: '2024.5.1',
					// 	sender_name: '张三',
					// 	alert_content: '告警内容',
					// 	isConfirmed: false
					// },
					// {
					// 	alert_grade: '一般告警',
					// 	alert_time: '2024.2.6',
					// 	sender_name: '李四',
					// 	alert_content: '告警内容',
					// 	isConfirmed: false
					// },
					// {
					// 	alert_grade: '重要告警',
					// 	alert_time: '2024.1.3',
					// 	sender_name: '张三',
					// 	alert_content: '告警内容',
					// 	isConfirmed: false
					// },
					// {
					// 	alert_grade: '严重告警',
					// 	alert_time: '2024.7.9',
					// 	sender_name: '张三',
					// 	alert_content: '告警内容',
					// 	isConfirmed: false
					// },
				],
				alert_data_mine: [
					// {
					// 	alert_grade: '一般告警',
					// 	alert_time: '2024.5.1',
					// 	sender_name: '张三',
					// 	alert_content: '告警内容'
					// },
					// {
					// 	alert_grade: '一般告警',
					// 	alert_time: '2024.2.6',
					// 	sender_name: '李四',
					// 	alert_content: '告警内容'
					// },
					// {
					// 	alert_grade: '重要告警',
					// 	alert_time: '2024.1.3',
					// 	sender_name: '张三',
					// 	alert_content: '告警内容'
					// },
					// {
					// 	alert_grade: '严重告警',
					// 	alert_time: '2024.7.9',
					// 	sender_name: '张三',
					// 	alert_content: '告警内容'
					// },
				],
				// 行动回溯，false停止，true播放
				replay: false,
				query: {
					"param": {
						"curPage": 1,
						"pageSize": 10
					},
					"statuses": [
						"USING",
						"UNUSED",
						"COMING"
					]
				},
				// geoJson数据
				geoJson: '0'
			}
		},
		// onNavigationBarButtonTap() {
		// 	this.$refs.popup.open('bottom')
		// },
		mounted() {
			uni.showLoading({
				title: '正在加载任务',
				mask: true
			})
			searchMission(this.query).then(res => {
				this.taskItem = res.data.records.map(e => ({
					id: e.id,
					task_name: e.missionName,
					country: e.missionCountry,
					position: e.missionCity,
					start_time: e.missionStartTime,
					end_time: e.missionEndTime,
					type: this.getTaskType(e.missionStartTime, e.missionEndTime),
					description: e.missionDescription,
					key: e.missionPassword,
					latitude: e.latitude,
					longitude: e.longitude,
					geoJson: e.geoJson
				}))[0];
				this.position.latitude = this.taskItem.latitude;
				this.position.longitude = this.taskItem.longitude;
				this.geoJson = this.taskItem.geoJson;
				this.getOrder();
				this.getWarning();
				// console.log(toRaw(this.position),'taskItem');
				uni.hideLoading()
			});
		},
		onLoad(options) {
			// 页面加载时执行
			// if (options.taskItem) {
			// 	this.taskItem = JSON.parse(options.taskItem); // 设置类型
			// } else {
			// 	console.error('没有传递类型参数');
			// };
			let self = this;
			this.recorderManager.onStop(function(res) {
				// console.log('recorder stop' + JSON.stringify(res));
				self.filePaths.voicePath = res.tempFilePath;
				uni.uploadFile({
					url: `http://139.196.11.210:8500/communicate/mission/upload/file`,
					filePath: res.tempFilePath,
					name: 'file',
					formData: {
						"latitude": "12",
						"longitude": "123",
						"missionId": this.taskItem.id,
					},
					header: {
						'Content-Type': 'multipart/form-data;', 
						'Authorization': 'Bearer '+ uni.getStorageSync('token'),
					},
					success: (uploadFileRes) => {
						const res = JSON.parse(uploadFileRes.data);
						if (res.code === 200) {
							uni.showToast({
								title: '音频上传成功！',
								//将值设置为 success 或者直接不用写icon这个参数
								icon: 'success',
								//显示持续时间为 2秒
								duration: 2000
							});
						} else{
							uni.showToast({
								title: '音频上传失败！',
								icon: 'none',
								//显示持续时间为 2秒
								duration: 2000
							});
						}
						console.log(uploadFileRes.data);
					}
				});
			});
		},
		methods: {
			take_picture() {
				var self = this;
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
							url: 'http://139.196.11.210:8500/communicate/mission/upload/file',
							filePath: tempFilePath,
							name: 'files',
							formData: {
								"latitude": "12",
								"longitude": "123",
								"missionId": self.taskItem.id,
							},
							header: {
								'Content-Type': 'multipart/form-data;', 
								'Authorization': 'Bearer '+ uni.getStorageSync('token'),
							},
							success: (uploadFileRes) => {
								const res = JSON.parse(uploadFileRes.data);
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
							url: `http://139.196.11.210:8500/communicate/mission/upload/file`,
							filePath: tempFilePath,
							name: 'file',
							formData: {
								"latitude": "12",
								"longitude": "123",
								"missionId": self.taskItem.id,
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
					},
					fail: function(err) {
						console.error('录像失败：', err);
					}
				});
			},
			startRecording() {
				console.log('开始录音');
				recorderManager.start();
				//显示加载框
				uni.showLoading({
					title: '正在录音'
				});

			},
			stopRecording() {
				console.log('录音结束');
				recorderManager.stop();
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
				// console.log(index)
				this.navIndex = index;
			},
			delete_alert(index) {
				this.alert_data.splice(index, 1);
			},
			delete_alert_mine(index) {
				this.alert_data_mine.splice(index, 1);
			},
			open() {
				this.$refs.popup.open()
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
				this.$refs.task_instructions.open();
			},
			close_task_instructions() {
				this.$refs.task_instructions.close()
			},
			goToDocument() {
				uni.navigateTo({
					url: `/pages/task/task_detail/document/document?missionId=${this.taskItem.id}`
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
				uni.showLoading({
					title: '正在发送',
					mask: true
				})
				// console.log(this.taskItem.memberIds, 'memberIds')
				let data = {
					isOrder: false,
					message: this.alert_form_data.alert_content,
					receiverMissionMemberIds: [],
					relatedMissionId: this.taskItem.id
				}
				// 获取receiverMissionMemberIds信息
				getMissionDetails({
					missionId: this.taskItem.id
				}).then(res => {
					if (res.code === 200) {
						// console.log(res, 'getMissionDetails');
						sendWarning(data).then(res => {
							if (res.code === 200) {
								uni.showToast({
									title: '发送成功',
									duration: 2000
								})
							} else {
								uni.showToast({
									title: '发送失败',
									icon: 'none',
									duration: 2000
								})
							}
							uni.hideLoading();
						})
					}
				})
				this.$refs.alert_form_popup.close()
				// 重新加载告警
				this.getWarning();
			},
			// 设置经纬度
			// setPoint() {
			// 	this.position.latitude = this.taskItem.latitude;
			// 	this.position.longitude = this.taskItem.longitude;
			// 	console.log(this.position,'position')
			// },
			// setGeoJson() {
			// 	this.geoJson = this.taskItem.geoJson;
			// 	console.log(this.geoJson, 'owner-setGeoJson')
			// },
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
			getOrder() {
				// 加载指令
				getOrderList({
					missionId: this.taskItem.id,
					curPage: 1,
					pageSize: 20
				}).then(res => {
					if (res.code === 200) {
						this.task_instructions = res.data.records.map(item => ({
							src: '../../../static/uni.png',
							sender_name: item.user.name,
							detail: item.message,
							isConfirmed: item.isRead
						}))
						if(this.task_instructions.length === 0) {
							this.instruct_none = true;
						} else {
							this.instruct_none = false;
						}
					}else {
						this.instruct_none = true;
					}
				})
			},
			getTaskType(startTime, endTime) {
				const start = new Date(startTime);
				const end = new Date(endTime);
				if (this.currentTime < start) {
					return "1"; // 未开始
				} else if (this.currentTime >= start && this.currentTime <= end) {
					return "2"; // 进行中
				} else {
					return "3"; // 已完成
				}
			},
			getWarning() {
				// 加载告警
				getWarningList({
					missionId: this.taskItem.id,
					curPage: 1,
					pageSize: 20
				}).then(res => {
					console.log(res.data.records,'res')
					if (res.code === 200) {
						const userInfo = uni.getStorageSync('userInfo')
						// 收到的告警信息
						this.alert_data = res.data.records.map(
							item => ({
								alert_grade: '严重告警',
								alert_time: item.sendTime,
								sender_name: item.user.name,
								alert_content: item.message,
								isConfirmed: item.isRead
							}))
						// // 筛选发送的告警信息
						// this.alert_data_mine = res.data.records.filter(item => item.senderId === userInfo.id).map(
						// 	item => ({
						// 		alert_grade: '严重告警',
						// 		alert_time: item.sendTime,
						// 		sender_name: item.senderId,
						// 		alert_content: item.message,
						// 	}))
						if(this.alert_data.length === 0){
							this.alert_none1 = true;
						} else {
							this.alert_none1 = false;
						}
						if(this.alert_data_mine.length === 0){
							this.alert_none2 = true;
						} else {
							this.alert_none2 = false;
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import url("/static/leaflet/leaflet.css");

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
		top: 100px;
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