<!-- SystemMessage.vue - 系统消息组件，用于显示系统通知 -->
<template>
  <view class="message-item system-message">
    <view class="message-icon system-icon">
      <text>📢</text>
      <view class="notification-badge">{{ message.notificationCount }}</view>
    </view>
    <view class="message-content">
      <view class="message-title">{{ message.title }}</view>
      <view class="message-preview">{{ message.preview }}</view>
    </view>
    <view class="message-date">{{ message.date }}</view>
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
.system-message {
  background-color: #f0f8ff;
}

.message-icon, .system-icon {
  width: 54px;
  height: 54px;
  border-radius: 5px;
  margin-right: 10px;
  flex-shrink: 0;
  background-color: #4285f4;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
  position: relative;
}

.notification-badge {
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

.message-content {
  flex: 1;
  min-width: 0;
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

