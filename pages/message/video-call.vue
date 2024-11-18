<template>
	<view>
		<!-- 视频画面 -->
		<video class="main-video"
			   ref="mainVideo"
			   :poster="poster"
			   autoplay>
		</video>
		<video class="secondary-video"
			   ref="secondaryVideo"
			   :poster="poster"
			   autoplay>
		</video>
		<section class="buttom-bar">
			<button v-if="isConnectioned" type="warn" @click="ringOffVideoCall"></button>
			<button v-else type="warn" @click="cancelVideoCall"></button>
		</section>
	</view>
</template>

<script setup>
	import poster from '../../static/icon/poster.gif';
	import usePeerStore from '../../store/peer';
	import {onMounted, ref} from "vue";
	let mainVideo = ref();
	let secondaryVideo = ref();
	
	let localUserMedia = ref();
	
	let peerStore = usePeerStore();
	
	//用于标记是否已经连接
	let isConnected = ref(false);
 	let videoFacingMode = ref('user');
	
	onMounted((options)=>{
		getLocalUserMedia({audio: true, video: true}).then( userMedia => {
			mainVideo.value.srcObject = userMedia;
			mainVideo.value.muted = true;
			localUserMedia.value = userMedia;
		
			// 发起连接请求
			peerStore.dataConnection = peerStore.localPeer.connect(options.calleePeerId);
			//对对方发过来的数据进行判断
			peerStore.dataConnection.on("data", data => {
			  if (data.instruction === peerStore.instruction.accept) {//接受
				peerStore.mediaConnection = peerStore.localPeer.call(options.calleePeerId, localUserMedia.value);
				peerStore.mediaConnection.on("stream", userMedia => {
				  mainVideo.value.srcObject = userMedia;
				  mainVideo.value.muted = false;
				  //视图互换一下，把对方放在主视图上
				  secondaryVideo.value.srcObject = localUserMedia.value;
				  secondaryVideo.value.muted = true;
				  isConnected.value = true;
				  uni.showToast({
				  	title: 'connected'
				  })
				});
			  } else if (data.instruction === peerStore.instruction.busy) {//忙线
				//由于是对方通知关闭连接，所以此处调用close
				peerStore.dataConnection.close();
				peerStore.dataConnection = undefined;
		
				for (let track of localUserMedia.value?.getTracks()) {
				  track.stop();
				}
		
				uni.showToast({
					title: "the other party is busy on the line",
					icon: 'none'
				});
				uni.navigateBack();
			  } else if (data.instruction === peerStore.instruction.reject) {//拒绝
				//由于是对方通知关闭连接，所以此处调用close
				peerStore.dataConnection.close();
				peerStore.dataConnection = undefined;
		
				for (let track of localUserMedia.value?.getTracks()) {
				  track.stop();
				}
		
				uni.showToast({
					title: "the other party refused",
					icon: 'none'
				})
		
				uni.navigateBack();
			  } else if (data.instruction === peerStore.instruction.ringOff) {//挂断
				//由于是对方通知关闭连接，所以此处调用close
				peerStore.dataConnection.close();
				peerStore.dataConnection = undefined;
		
				peerStore.mediaConnection.close();
				peerStore.mediaConnection = undefined;
		
				for (let track of localUserMedia.value?.getTracks()) {
				  track.stop();
				}
		
				uni.showToast({
					title: "the other party has hung up",
					icon: 'none'
				})
						
				uni.navigateBack();
			  }
			});
		
			//当连接被打开的时候理解发送一个指令给对方
			peerStore.dataConnection.on("open", () => {
			  peerStore.dataConnection.send({
				instruction: peerStore.instruction.request
			  });
			});
		}
		).catch(()=>{
			uni.showToast({
				title: '获取摄像头失败！',
				icon: 'none'
			})
			uni.navigateBack()
		})
	});
	
	function getLocalUserMedia(constrains) {
	  if (navigator.mediaDevices.getUserMedia) {
	    return navigator.mediaDevices.getUserMedia(constrains);
	  } else if (navigator.webkitGetUserMedia) {
	    return navigator.webkitGetUserMedia(constrains);
	  } else if (navigator.mozGetUserMedia) {
	    return navigator.mozGetUserMedia(constrains);
	  } else if (navigator.getUserMedia) {
	    return navigator.getUserMedia(constrains);
	  }
	  throw new Error("unable to get user media");
	}
	
	function cancelVideoCall() {
	  for (let track of localUserMedia.value?.getTracks()) {
	    track.stop();
	  }
	
	  //有可能连接还没建立，所以这里用可选链操作符
	  peerStore.dataConnection?.send({
	    instruction: peerStore.instruction.cancel
	  });
	
	  peerStore.dataConnection = undefined;
	
	  uni.navigateBack();
	}
	
	function ringOffVideoCall() {
	  for (let track of localUserMedia.value?.getTracks()) {
	    track.stop();
	  }
	
	  //挂断的时候这个连接肯定不为空，所以无需判断
	  peerStore.dataConnection.send({
	    instruction: peerStore.instruction.ringOff
	  });
	
	  peerStore.dataConnection = undefined;
	
	  peerStore.mediaConnection = undefined;
	
	  uni.navigateBack();
	}
</script>

<style>

</style>
