<template>
	<view>
		<section class="container">
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
		
			<section class="bottom-bar">
			  <van-button v-if="isConnected"
						  type="danger"
						  block
						  @click="ringOffVideoCall">
				挂断视频通话
			  </van-button>
			</section>
	  </section>
	</view>
</template>

<script setup>
	import poster from '../../static/icon/poster.gif';
	import usePeerStore from '../../store/peer';
	import {onMounted, ref, watch} from "vue";
	let mainVideo = ref();
	let secondaryVideo = ref();
	
	let localUserMedia = ref();
	
	let peerStore = usePeerStore();
	
	let router = useRouter();
	
	//用于标记是否已经连接
	let isConnected = ref(false);

	onMounted(()=>{
		getLocalUserMedia({audio: true, video: true}).then(userMedia => {
		    mainVideo.value.srcObject = userMedia;
		    localUserMedia.value = userMedia;
		
		    //先回应
		    peerStore.mediaConnection.answer(localUserMedia.value);
		    peerStore.mediaConnection.on("stream", remoteUserMedia => {
		      mainVideo.value.srcObject = remoteUserMedia;
		
		      secondaryVideo.value.srcObject = localUserMedia.value;
		      isConnected.value = true;
			  uni.showToast({
			  	title: 'connected'
			  })
		    });
		}).catch(() => {
			uni.showToast({
				title: 'failed to obtain local video media',
				icon: 'none'
			})
			uni.navigateBack();
		});
	})
	
	//监听对方挂断
	let cancel = watch(() => [peerStore.dataConnection, peerStore.mediaConnection], ([dataConnection, mediaConnection]) => {
	  //两个连接都为空说明对方已经挂了
	  if (dataConnection === undefined && mediaConnection === undefined) {
	    cancel();
	
	    if (localUserMedia.value) {
	      for (let track of localUserMedia.value.getTracks()) {
	        track.stop();
	      }
	    }
	
		uni.showToast({
			title: 'the other party has hung up'
		})
	
	    uni.navigateBack();
	  }
	}, {immediate: true});
	
	
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
	
	
	function ringOffVideoCall() {
	  //先取消上面的监听
	  cancel();
	
	  for (let track of localUserMedia.value?.getTracks()) {
	    track.stop();
	  }
	
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
