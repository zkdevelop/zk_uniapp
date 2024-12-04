<template>
  <view class="voice-input-container">
    <!-- 语音/键盘切换按钮 -->
    <image 
      @click="$emit('toggle-voice-input')"
      :src="isVoiceInputActive ? '/static/message/键盘.png' : '/static/message/语音.png'"
      class="toggle-button"
    />
    <!-- 录音按钮 -->
    <view 
      v-if="isVoiceInputActive"
      @touchstart.prevent="startRecording"
      @touchend.prevent="stopRecording"
      @touchcancel.prevent="stopRecording"
      class="record-button"
    >
      <text class="record-text">按住 说话</text>
    </view>
    <!-- 录音状态覆盖层 -->
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
  name: 'VoiceInputButton',
  props: {
    // 是否处于语音输入模式
    isVoiceInputActive: {
      type: Boolean,
      required: true
    },
    // 是否正在录音
    isRecording: {
      type: Boolean,
      default: false
    },
    // 语音状态对象
    voiceStatus: {
      type: Object,
      default: () => ({
        status: 'ready',
        duration: 0,
        volume: 0
      })
    },
    // 开始录音的方法
    startVoiceRecord: {
      type: Function,
      required: true
    },
    // 停止录音的方法
    stopVoiceRecord: {
      type: Function,
      required: true
    }
  },
  emits: ['toggle-voice-input'],
  methods: {
    // 格式化时间显示
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
    },
    // 开始录音
    startRecording() {
      this.startVoiceRecord()
    },
    // 停止录音
    stopRecording() {
      this.stopVoiceRecord()
    }
  }
}
</script>

<style lang="scss" scoped>
.voice-input-container {
  position: relative;
  display: flex;
  align-items: center; 
}

.toggle-button {
  width: 36px;
  height: 36px;
  margin-right: 10px;
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