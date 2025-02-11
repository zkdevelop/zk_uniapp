<template>
  <view class="upload-progress-bar" v-if="show">
    <view class="progress-bar">
      <view class="progress" :style="{ width: `${progress}%` }"></view>
    </view>
    <text class="progress-text">{{ progress }}%</text>
  </view>
</template>

<script>
export default {
  name: 'UploadProgressBar',
  props: {
    progress: {
      type: Number,
      default: 0
    },
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.upload-progress-bar {
  position: fixed;
  bottom: 70px;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  display: flex;
  align-items: center;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

.progress-text {
  margin-left: 10px;
  font-size: 12px;
  color: #333;
}
</style>

