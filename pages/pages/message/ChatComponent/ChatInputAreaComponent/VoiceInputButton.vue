<template>
  <view class="voice-record-container">
    <view 
      @touchstart.prevent="startRecording"
      @touchend.prevent="stopRecording"
      @touchcancel.prevent="stopRecording"
      class="record-button"
    >
      <text class="record-text">按住 说话</text>
    </view>
    <view v-if="isRecording" class="voice-overlay">
      <view class="voice-popup">
        <view class="voice-time">{{ formatTime(voiceStatus.duration) }}</view>
        <view class="voice-hint">松开 结束</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'VoiceRecordButton',
  props: {
    isRecording: {
      type: Boolean,
      default: false
    },
    voiceStatus: {
      type: Object,
      default: () => ({
        status: 'ready',
        duration: 0,
        volume: 0
      })
    },
    startVoiceRecord: {
      type: Function,
      required: true
    },
    stopVoiceRecord: {
      type: Function,
      required: true
    }
  },
  methods: {
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
    },
    startRecording() {
      this.startVoiceRecord()
    },
    stopRecording() {
      this.stopVoiceRecord()
    }
  }
}
</script>

<style lang="scss" scoped>
.voice-record-container {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
}

.record-button {
  flex: 1;
  height: 36px;
  background-color: #FFFFFF;
  border: 1px solid #e0e0e0;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
}

.record-text {
  color: #999;
  font-size: 14px;
  width: 100%;
  text-align: center;
}

.voice-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.voice-popup {
  width: 240rpx;
  height: 240rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .voice-time {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 16rpx;
  }

  .voice-hint {
    font-size: 28rpx;
    color: #666;
  }
}
</style>