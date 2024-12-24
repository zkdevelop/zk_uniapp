<!-- SkeletonLoader.vue - 骨架屏组件，用于显示加载中的占位内容 -->
<template>
  <view class="skeleton-loader">
    <view class="skeleton-avatar"></view>
    <view class="skeleton-content">
      <view class="skeleton-title"></view>
      <view class="skeleton-text"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SkeletonLoader'
}
</script>

<style scoped>
.skeleton-loader {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.skeleton-avatar {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #e0e0e0;
  margin-right: 15px;
}

.skeleton-content {
  flex: 1;
}

.skeleton-title {
  height: 16px;
  width: 40%;
  background-color: #e0e0e0;
  margin-bottom: 8px;
}

.skeleton-text {
  height: 14px;
  width: 60%;
  background-color: #e0e0e0;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton-avatar,
.skeleton-title,
.skeleton-text {
  background-image: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>

