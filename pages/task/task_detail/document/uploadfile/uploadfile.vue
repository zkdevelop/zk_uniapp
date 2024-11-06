<template>
	<view>
		<button type="default" @click="()=>{show = true}" style="width: 80%;background-color: #007AFF;color: #fff;margin-top: 60rpx;">选择文件</button>
		<view class="textStyle" v-for="(item,index) in pathArr" :key="index">
			<view>
				文件名：{{item.name}}
			</view>
			<view>
				文件地址：{{item.url}}
			</view>
			<view>
				文件大小：{{item.sizeMB}}
			</view>
		</view>
		<nk-select-file v-model="show" @confirm="getPath"></nk-select-file>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				pathArr: []
			}
		},
		methods: {
			getPath(event){
				console.log(event);
				this.pathArr = event;
			}
		}
	}
</script>

<style>
.textStyle{
	width: 100%;
	text-align: center;
	margin-top: 40rpx;
}
</style>
