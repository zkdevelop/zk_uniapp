<!-- SystemMessage.vue - 系统消息组件，用于显示系统通知 -->
<template>
  <view class="message-item system-message">
    <view class="avatar-container">
      <view class="system-icon">
        <text>📢</text>
      </view>
      <view v-if="message.notificationCount > 0" class="avatar-badge">{{ message.notificationCount }}</view>
    </view>
    <view class="message-content-wrapper">
      <view class="message-content">
        <view class="message-title">{{ message.title }}</view>
        <view class="message-preview">{{ message.preview }}</view>
      </view>
      <view class="message-date">{{ message.date }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SystemMessage',
  // 定义组件的属性
  props: {
    message: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.message-item {
  display: flex;
  align-items: flex-start;
  padding: 15px 15px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.system-message {
  background-color: #f0f8ff;
}

.avatar-container {
  position: relative;
  width: 54px;
  height: 54px;
  margin-right: 10px;
}

.system-icon {
  width: 54px;
  height: 54px;
  border-radius: 5px;
  background-color: #4285f4;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 24px;
}

.avatar-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff3b30;
  color: #fff;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 8px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-content-wrapper {
  flex: 1;
  display: flex;
  justify-content: space-between;
  min-width: 0;
  padding-top: 2px;
}

.message-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.message-title {
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.message-preview {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.message-date {
  font-size: 11px;
  color: #999;
  margin-left: 10px;
  flex-shrink: 0;
}
</style>

