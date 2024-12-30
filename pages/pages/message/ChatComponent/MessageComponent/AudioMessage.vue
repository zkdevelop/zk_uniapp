<template>
  <view class="audio-message">
    <view v-if="isAudioFile" class="audio-player">
      <view class="player-container">
        <view class="play-pause-button" @click="togglePlay">
          <svg v-if="!isPlaying" class="play-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5.14v14.72L19 12 8 5.14z" fill="currentColor"/>
          </svg>
          <svg v-else class="pause-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5h3v14H8V5zm5 0h3v14h-3V5z" fill="currentColor"/>
          </svg>
        </view>
        
        <view class="time-progress">
          <view class="time-display">
            <text>{{ formatDuration(currentTime) }}</text>
            <text class="duration-separator">/</text>
            <text>{{ formatDuration(duration) }}</text>
          </view>
          <view class="progress-bar" @click="seekAudio">
            <view class="progress" :style="{ width: `${progress}%` }"></view>
          </view>
        </view>

        <view class="controls">
          <view class="volume-control" @click="toggleMute">
            <svg v-if="!isMuted" class="volume-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 9.5c.83.27 1.5 1.34 1.5 2.5s-.67 2.23-1.5 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M3 11v2h2l3.5 3.5V7.5L5 11H3z" fill="currentColor"/>
            </svg>
            <svg v-else class="volume-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 11v2h2l3.5 3.5V7.5L5 11H3z" fill="currentColor"/>
              <path d="M14 9l-2 2m0 0l-2 2m2-2l2 2m-2-2l-2-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AudioMessage',
  props: {
    content: {
      type: String,
      required: true
    },
    messageType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isPlaying: false,
      duration: 0,
      currentTime: 0,
      audioContext: null,
      updateInterval: null,
      isMuted: false,
      previousVolume: 1,
    }
  },
  computed: {
    isAudioFile() {
      return this.messageType === 'AUDIO';
    },
    progress() {
      return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
    }
  },
  mounted() {
    if (this.isAudioFile) {
      this.initAudioContext();
    }
  },
  methods: {
    formatDuration(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    togglePlay() {
      if (this.isPlaying) {
        this.audioContext.pause();
        clearInterval(this.updateInterval);
      } else {
        this.audioContext.play();
        this.updateInterval = setInterval(this.updateProgress, 1000);
      }
      this.isPlaying = !this.isPlaying;
    },
    initAudioContext() {
      this.audioContext = uni.createInnerAudioContext();
      this.audioContext.src = this.content;
      this.audioContext.playbackRate = 1; // 默认速度
      
      this.audioContext.onCanplay(() => {
        // 在音频可以播放时获取总时长
        this.getDuration();
      });
      
      this.audioContext.onEnded(() => {
        this.isPlaying = false;
        this.currentTime = 0;
        clearInterval(this.updateInterval);
      });
      
      this.audioContext.onError((res) => {
        console.error('音频错误:', res.errMsg);
        uni.showToast({
          title: '音频播放错误',
          icon: 'none'
        });
      });
    },
    getDuration() {
      // 尝试获取音频时长
      const checkDuration = () => {
        if (this.audioContext.duration > 0) {
          this.duration = this.audioContext.duration;
        } else {
          setTimeout(checkDuration, 100); // 如果还没有获取到时长，100毫秒后再次尝试
        }
      };
      checkDuration();
    },
    updateProgress() {
      if (this.audioContext) {
        this.currentTime = this.audioContext.currentTime;
      }
    },
    seekAudio(event) {
      if (!this.audioContext) return;
      
      const rect = event.target.getBoundingClientRect();
      const clickPosition = event.clientX - rect.left;
      const percentage = (clickPosition / rect.width) * 100;
      const newTime = (percentage / 100) * this.duration;
      
      this.audioContext.seek(newTime);
      this.currentTime = newTime;
    },
    toggleMute() {
      if (!this.audioContext) return;
      
      if (this.isMuted) {
        this.audioContext.volume = this.previousVolume;
      } else {
        this.previousVolume = this.audioContext.volume;
        this.audioContext.volume = 0;
      }
      this.isMuted = !this.isMuted;
    }
  },
  beforeDestroy() {
    if (this.audioContext) {
      this.audioContext.destroy();
    }
    clearInterval(this.updateInterval);
  }
}
</script>

<style lang="scss" scoped>
/* 样式保持不变 */
.audio-message {
  width: 100%;
  position: relative;
}

.player-container {
  background-color: #ffffff;
  border-radius: 24px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.play-pause-button {
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.play-icon, .pause-icon {
  width: 20px;
  height: 20px;
  color: #333333;
}

.time-progress {
  flex: 1;
  min-width: 0;
}

.time-display {
  display: flex;
  gap: 4px;
  font-size: 12px;
  color: #666666;
  margin-bottom: 4px;
}

.duration-separator {
  color: #999999;
}

.progress-bar {
  height: 4px;
  background-color: #E5E7EB;
  border-radius: 2px;
  overflow: hidden;
  cursor: pointer;
}

.progress {
  height: 100%;
  background-color: #007AFF;
  transition: width 0.1s linear;
}

.controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-control {
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.volume-icon {
  width: 20px;
  height: 20px;
  color: #666666;
}
</style>