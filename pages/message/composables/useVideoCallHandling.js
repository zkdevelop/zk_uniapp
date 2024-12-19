// useVideoCallHandling.js - 负责处理视频通话相关的功能
export function useVideoCallHandling(vm) {
  return {
    // 打开视频通话页面
    openVideoPage(action) {
      uni.navigateTo({
        url: `/pages/message/video-call?calleePeerId=${vm.chatInfo.id}`
      });
    },

    // 拒绝视频通话
    rejectVideoCall() {
      console.log('拒绝视频通话，peerStore 状态:', vm.peerStore);
      vm.peerStore.dataConnection.send({
        instruction: vm.peerStore.instruction.reject
      });
      vm.peerStore.dataConnection = undefined;
      vm.peerStore.activateNotification = false;
    },

    // 接受视频通话
    acceptVideoCall() {
      console.log('接受视频通话，peerStore 状态:', vm.peerStore);
      vm.peerStore.activateNotification = false;
      
      uni.showLoading({
        title: "等待对方连接...",
        mask: true
      });
      
      let cancel = watch(() => vm.peerStore.mediaConnection, newValue => {
        if (newValue) {
          uni.hideLoading();
          cancel();
          uni.navigateTo({
            url: "/pages/message/video-answer"
          });
        }
      }, {immediate: true});
      
      vm.peerStore.dataConnection.send({
        instruction: vm.peerStore.instruction.accept
      });
    },
  };
}

