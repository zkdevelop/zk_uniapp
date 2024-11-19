<template>
  <view v-if="isOpen" class="burn-after-reading-overlay" @click="close">
    <!-- 阅后即焚图片 -->
    <image :src="imageSrc" mode="aspectFit" class="burn-after-reading-image" @click.stop />
    <!-- 倒计时 -->
    <view class="countdown">{{ remainingTime }}s</view>
  </view>
</template>

<script>
export default {
  name: 'BurnAfterReading',
  props: {
    // 图片源
    imageSrc: {
      type: String,
      required: true
    },
    // 持续时间（秒）
    duration: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      isOpen: false, // 控制组件是否显示
      remainingTime: 0, // 剩余时间
      timer: null // 定时器
    }
  },
  methods: {
    // 打开阅后即焚预览
    open() {
      this.isOpen = true
      this.remainingTime = this.duration
      this.startCountdown()
    },
    // 关闭阅后即焚预览
    close() {
      this.isOpen = false
      this.stopCountdown()
      
      this.$emit('close')
    },
    // 开始倒计时
    startCountdown() {
      this.timer = setInterval(() => {
        this.remainingTime--
        if (this.remainingTime <= 0) {
          this.close()
        }
      }, 1000)
    },
    // 停止倒计时
    stopCountdown() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    }
  },
  // 组件销毁前清除定时器
  beforeDestroy() {
    this.stopCountdown()
  }
}
</script>

<style lang="scss" scoped>
.burn-after-reading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.burn-after-reading-image {
  max-width: 90%;
  max-height: 90%;
}

.countdown {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 10rpx 20rpx;
  border-radius: 20rpx;
  font-size: 28rpx;
}
</style>