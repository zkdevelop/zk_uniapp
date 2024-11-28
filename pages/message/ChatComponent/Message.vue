<template>
  <view class="message" :class="[message.userType]">
    <view class="message-time">{{ formatTime(message.timestamp) }}</view>
    <view class="message-content" :class="{ 'self-message': message.userType === 'self' }">
      <image :src="message.avatar || '/static/message/默认头像.png'" class="avatar" mode="aspectFill"></image>
      <view class="content-wrapper">
        <view v-if="message.userType === 'friend'" class="friend-name">{{ message.name }}</view>
        <view class="content" :class="{ 'location-content': message.type === 'location', 'file-message': message.type === 'file', 'message-image': message.type === 'image', 'audio-message': message.type === 'audio' }">
          <LocationMessage v-if="message.type === 'location'" :content="message.content" />
          <ImageMessage v-else-if="message.type === 'image'" :content="message.content" />
          <FileMessage v-else-if="message.type === 'file'" :content="message.content" :messageType="message.messageType" />
          <AudioMessage v-else-if="message.type === 'audio'" :content="message.content" :messageType="message.messageType" />
          <BurnAfterReadingMessage v-else-if="message.type === 'burn-after-reading'" :content="message.content" @view-burn-after-reading="viewBurnAfterReading" />
          <template v-else>
            {{ message.content }}
          </template>
        </view>
      </view>
      <view v-if="message.userType === 'self'" class="message-status">
        <view v-if="message.status === 'sending'" class="loading-icon"></view>
        <view v-else-if="message.status === 'failed'" class="failed-icon">!</view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue';
import LocationMessage from './MessageComponent/LocationMessage.vue';
import ImageMessage from './MessageComponent/ImageMessage.vue';
import FileMessage from './MessageComponent/FileMessage.vue';
import AudioMessage from './MessageComponent/AudioMessage.vue';
import BurnAfterReadingMessage from './MessageComponent/BurnAfterReadingMessage.vue';

export default {
  name: 'Message',
  components: {
    LocationMessage,
    ImageMessage,
    FileMessage,
    AudioMessage,
    BurnAfterReadingMessage
  },
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  setup() {
    const formatTime = (timestamp) => {
      if (!timestamp) return 'Invalid Date';
      const date = new Date(timestamp);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${month}-${day} ${hours}:${minutes}`;
    };

    const viewBurnAfterReading = (message) => {
      // 实现查看阅后即焚消息的逻辑
      console.log('查看阅后即焚消息:', message);
    };

    return {
      formatTime,
      viewBurnAfterReading
    };
  }
};
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
    max-width: 100%;
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
    border-radius: 10rpx;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;
  }

  .content:not(.location-content):not(.file-message):not(.message-image):not(.audio-message) {
    padding: 20rpx;
    background: #fff;
  }

  &.self {
    align-items: flex-end;

    .message-content {
      flex-direction: row-reverse;
      align-items: center;
    }

    .avatar {
      margin-right: 0;
      margin-left: 20rpx;
    }

    .content:not(.location-content):not(.file-message):not(.message-image):not(.audio-message) {
      background: #4e8cff;
      color: #fff;
    }
  }

  &.friend {
    align-items: flex-start;

    .message-content {
      flex-direction: row;
    }

    .content:not(.location-content):not(.file-message):not(.message-image):not(.audio-message) {
      background: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
}

.message-status {
  display: flex;
  align-items: center;
  margin-left: 20rpx;
  height: 100%;
  padding: 0 5rpx;
}

.loading-icon {
  width: 30rpx;
  height: 30rpx;
  border: 3rpx solid #ccc;
  border-top: 3rpx solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.failed-icon {
  width: 30rpx;
  height: 30rpx;
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
  max-width: calc(100% - 120rpx);
}

.friend-name {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 5rpx;
}

.message-image {
  background: transparent !important;
  padding: 0 !important;
  overflow: hidden;
}

.audio-message {
  background: transparent !important;
  padding: 0 !important;
  overflow: hidden;
}
</style>