<template>
	<view class="container">
		<view class="body">
			<video class="local-video" id="local-video" ref="currentVideoRef" autoplay></video>
			<video class="remote-video" id="remote-video" ref="remoteVideoRef" autoplay></video>
		</view>
		<view class="footer">
			<view class="control-buttons">
				<button @click="rejectVideoCall" type="warn">挂断</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		useMeetingStore
	} from '@/store/meeting';

	const meetingStore = useMeetingStore();
	
	const rejectVideoCall = () => {
		meetingStore.rejectVideoCall();
	}
</script>

<style scoped>
	.container {
		width: 100vw;
		height: 100vh;
		background-color: #000;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		position: fixed;
		top:0;
		left: 0;
		/* 	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%); */
		z-index: 9999;
	}

	.body {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.local-video {
		width: 100%;
		height: 100%;
	}

	.remote-video {
		background-color: #fff;
		position: fixed;
		width: 20%;
		height: 20%;
		top: 20px;
		right: 20px
	}

	.footer {
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 0 0 15px 0;
	}

	.control-buttons {
		gap: 15px;
	}

	.control-buttons button {
		width: 25%;
		padding: 10px 20px;
		border-radius: 5px;
		border: none;
		color: white;
		font-weight: bold;
	}

	.control-buttons button[type="default"] {
		background-color: #4CAF50;
	}

	.control-buttons button[type="warn"] {
		background-color: #f44336;
	}
</style>