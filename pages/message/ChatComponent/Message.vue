<!-- Message.vue -->
<template>
  <view class="message" :class="[message.userType]">
    <view class="message-time">{{ formatTime(message.timestamp) }}</view>
    <view class="message-content">
      <image :src="message.avatar || '/static/message/默认头像.png'" class="avatar" mode="aspectFill"></image>
      <view class="content-wrapper">
        <view v-if="message.userType === 'friend'" class="friend-name">{{ message.name }}</view>
        <view class="content">
          {{ message.content }}
        </view>
      </view>
      <view v-if="message.userType === 'self'" class="message-status">
        <view v-if="status === 'sending'" class="loading-icon"></view>
        <view v-else-if="status === 'failed'" class="failed-icon">!</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Message',
  props: {
    message: {
      type: Object,
      required: true
    },
    status: {
      type: String,
      default: 'sent'
    }
  },
  methods: {
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${month}-${day} ${hours}:${minutes}`;
    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  display: flex;
  flex-direction: column;
  margin-bottom: 20rpx;
  width: 100%;

  .message-time {
    width: 100%;
    text-align: center;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 5rpx;
  }

  .message-content {
    display: flex;
    align-items: flex-start;
    width: 100%;
  }

  .avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }

  .content {
    min-height: 80rpx;
    max-width: 60vw;
    box-sizing: border-box;
    font-size: 28rpx;
    line-height: 1.3;
    padding: 20rpx;
    border-radius: 10rpx;
    background: #fff;
  }

  &.self {
    .message-content {
      flex-direction: row-reverse;
    }
    .avatar {
      margin-right: 0;
      margin-left: 20rpx;
    }
    .content {
      background: #4e8cff;
      color: #fff;
    }
    align-items: flex-end;
  }

  &.friend {
    .message-content {
      flex-direction: row;
    }
    .content {
      background: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    align-items: flex-start;
  }
}

.message-status {
  margin-left: 5px;
  display: flex;
  align-items: center;
}

.loading-icon {
  width: 15px;
  height: 15px;
  border: 2px solid #ccc;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.failed-icon {
  width: 15px;
  height: 15px;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 12px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  max-width: calc(100% - 100rpx);
}

.friend-name {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 5rpx;
}
</style>