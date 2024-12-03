<!-- VoiceInputButton.vue - 语音输入按钮组件 -->
<template>
  <view class="voice-input-container">
    <!-- 语音按钮 -->
    <view 
      class="voice-button"
      :class="{ 'recording': isRecording }"
      @touchstart.prevent="startRecording"
      @touchend.prevent="stopRecording"
      @touchcancel.prevent="stopRecording"
    >
      <image 
        :src="isVoiceInputActive ? '/static/message/键盘.png' : '/static/message/语音输入.png'"
        class="voice-icon" 
      />
    </view>

    <!-- 录音状态指示器 -->
    <view v-if="isRecording" class="voice-status-indicator">
      <view 
        class="volume-bar"
        :style="{ height: `${voiceStatus.volume}%` }"
      ></view>
    </view>

    <!-- 录音提示蒙层 -->
    <view v-if="isRecording" class="voice-overlay">
      <view class="voice-popup">
        <view class="voice-time">{{ formatTime(voiceStatus.duration) }}</view>
        <view class="voice-hint">松开 结束</view>
        <view class="voice-volume">
          <view 
            class="volume-wave"
            :style="{ transform: `scale(${1 + voiceStatus.volume / 100})` }"
          ></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'VoiceInputButton',
  props: {
    isVoiceInputActive: {
      type: Boolean,
      required: true
    },
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
  emits: ['toggle-voice-input'],
  data() {
    return {
      stopRecordingCallback: null
    };
  },
  methods: {
    toggleVoiceInput() {
      this.$emit('toggle-voice-input');
    },
    formatTime(ms) {
      const seconds = Math.floor(ms / 1000);
      return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    },
    async startRecording() {
      this.stopRecordingCallback = await this.startVoiceRecord();
    },
    stopRecording() {
      if (this.stopRecordingCallback) {
        this.stopVoiceRecord(this.stopRecordingCallback);
        this.stopRecordingCallback = null;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// 样式保持不变
.voice-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.voice-button {
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 11px;
  margin-right: 10px;
  background: #f5f5f5;
  transition: all 0.3s ease;

  &.recording {
    background: #e0e0e0;
  }
}

.voice-icon {
  width: 24px;
  height: 24px;
}

.voice-status-indicator {
  position: absolute;
  left: -2px;
  bottom: -2px;
  width: 4px;
  height: 40px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;

  .volume-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #1874f5;
    transition: height 0.1s ease;
  }
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
  position: relative;

  .voice-time {
    font-size: 32rpx;
    color: #333;
    margin-bottom: 16rpx;
  }

  .voice-hint {
    font-size: 28rpx;
    color: #666;
  }

  .voice-volume {
    position: absolute;
    bottom: -60rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 120rpx;
    height: 120rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .volume-wave {
      width: 100%;
      height: 100%;
      background: #1874f5;
      border-radius: 50%;
      opacity: 0.2;
      transition: transform 0.1s ease;
    }
  }
}
</style>