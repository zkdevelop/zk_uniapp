<template>
  <view v-if="show" class="scroll-to-bottom" @click="$emit('click')">
    <text class="scroll-to-bottom-icon">&#8595;</text>
  </view>
</template>

<script>
export default {
  name: 'ScrollToBottomButton',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-to-bottom {
  position: fixed;
  bottom: 80rpx;
  right: 20rpx;
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 40rpx;
  cursor: pointer;
}

.scroll-to-bottom-icon {
  transform: translateY(-2rpx);
}
</style>