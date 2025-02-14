<template>
	<view v-if="showMeetingDialog" class="container">
		<view v-if="isCaller && !isAnswered" class="modal">
			<view>
				<text>正在呼叫...</text>
			</view>
			<view class="modal-content">
				<button @click="rejectVideoCall" type="warn">挂断</button>
			</view>
		</view>
		<!-- 呼叫中 -->
		<view v-else-if="!isCaller && !isAnswered" class="modal">
			<view>
				<text>{{meetingStore?.callerName}} 邀请你视频通话</text>
			</view>
			<view class="modal-content">
				<button @click="acceptVideoCall" type="default">接听</button>
				<button @click="rejectVideoCall" type="warn">拒绝</button>
			</view>
		</view>
		<!-- 通话界面 -->
		<view v-else style="width: 100%;height: 100%;">
				<InCallComponentGroup v-if="isGroup"/>
				<InCallComponentSingle v-else/>
		</view>
	</view>
</template>

<script setup>
	import {
		useMeetingStore
	} from '@/store/meeting'
	import {
		storeToRefs
	} from "pinia";
	import { watchEffect } from 'vue';
	import InCallComponentSingle from './InCallComponentSingle.vue';
	import InCallComponentGroup from './InCallComponentGroup.vue';

	const meetingStore = useMeetingStore()
	const {
		showMeetingDialog,
		isCaller,
		isAnswered,
		isGroup
	} = storeToRefs(meetingStore)
	
	// 接听通话
	const acceptVideoCall=()=>{
		meetingStore.showMeetingDialog=false;
		// meetingStore.acceptVideoCall();
	}
	// 挂断通话
	const rejectVideoCall=()=>{
		meetingStore.showMeetingDialog=false;
		// meetingStore.rejectVideoCall();
	}
</script>

<style scoped>
	.container{
		height: 100%;
		width: 100%;
		position:relative;
	}
	
	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		z-index: 1002;
	}

	.modal-content {
		display: flex;
		justify-content: space-around;
		margin-top: 20px;
	}

	.modal button {
		padding: 10px 20px;
		border-radius: 5px;
		border: none;
		color: white;
		font-weight: bold;
	}

	.modal button[type="default"] {
		background-color: #4CAF50;
	}

	.modal button[type="warn"] {
		background-color: #f44336;
	}
</style>