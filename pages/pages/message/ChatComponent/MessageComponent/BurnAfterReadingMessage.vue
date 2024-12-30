<template>
  <view class="burn-after-reading" @click="viewBurnAfterReading(content)">
    <image 
      :src="content.mosaicPath" 
      mode="widthFix" 
      class="message-image"
    ></image>
    <text class="burn-after-reading-text">阅后即焚</text>
  </view>
</template>

<script>
export default {
  name: 'BurnAfterReadingMessage',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  methods: {
    viewBurnAfterReading(message) {
      // Implement the logic for viewing burn-after-reading messages
      this.$emit('view-burn-after-reading', message);
    }
  }
};
</script>

<style lang="scss" scoped>
.burn-after-reading {
  position: relative;
  overflow: hidden;
}

.burn-after-reading-text {
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 5rpx 10rpx;
  border-radius: 5rpx;
  font-size: 24rpx;
}

.message-image {
  max-width: 100%;
  border-radius: 5px;
}
</style>