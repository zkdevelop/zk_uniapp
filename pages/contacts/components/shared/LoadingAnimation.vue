<template>
  <view class="loading-animation">
    <view class="dot"></view>
    <view class="dot"></view>
    <view class="dot"></view>
  </view>
</template>

<script>
export default {
  name: 'LoadingAnimation'
}
</script>

<style scoped>
.loading-animation {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: #007AFF;
  border-radius: 50%;
  margin: 0 5px;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>

