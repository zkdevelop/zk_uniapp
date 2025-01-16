<template> 
  <view class="message" :class="[message.userType]"> 
    <view class="message-time">{{ formatTime(message.timestamp) }}</view>
    <view class="message-content" :class="{ 'self-message': message.userType === 'self' }">
      <view class="avatar-container">
        <image :src="message.avatar || '/static/message/默认头像.png'" class="avatar" mode="aspectFill"></image>
        <view v-if="isGroup && message.userType === 'other'" class="sender-name">
          {{ message.senderName }}
        </view>
      </view>
      <view class="content-wrapper">
        <view v-if="message.userType === 'friend'" class="friend-name">{{ message.name }}</view>
        <view class="content" :class="{ 
          'location-content': message.type === 'location', 
          'file-message': message.type === 'file', 
          'message-image': message.type === 'image', 
          'voice-message': message.type === 'voice_message',
          'audio-message': message.type === 'audio'
        }">
          <!-- 根据消息类型渲染不同的组件 -->
          <LocationMessage v-if="message.type === 'location'" :content="message.content" />
          <ImageMessage v-else-if="message.type === 'image'" :content="message.content" />
          <FileMessage v-else-if="message.type === 'file'" :content="message.content" :messageType="message.messageType" />
          <VoiceMessageBubble 
            v-else-if="message.type === 'voice_message'" 
            :content="{ 
              url: message.content, 
              duration: message.duration, 
              isSelf: message.userType === 'self' 
            }" 
          />
          <AudioMessage
            v-else-if="message.type === 'audio'"
            :content="message.content"
            :messageType="message.messageType"
          />
          <BurnAfterReadingMessage v-else-if="message.type === 'burn-after-reading'" :content="message.content" @view-burn-after-reading="viewBurnAfterReading" />
          <BurnAfterReadingTextMessage
            v-else-if="message.selfDestruct && message.messageType === 'MESSAGE'"
            :messageId="message.id"
            :isGroup="isGroup"
            @message-deleted="handleMessageDeleted"
          />
          <template v-else>
            {{ message.content || '' }}
          </template>
        </view>
      </view>
      <!-- 消息状态（仅对自己发送的消息显示） -->
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
import VoiceMessageBubble from './MessageComponent/VoiceMessageBubble.vue';
import BurnAfterReadingMessage from './MessageComponent/BurnAfterReadingMessage.vue';
import AudioMessage from './MessageComponent/AudioMessage.vue';
import BurnAfterReadingTextMessage from './MessageComponent/BurnAfterReadingTextMessage.vue';

export default {
  name: 'Message',
  components: {
    LocationMessage,
    ImageMessage,
    FileMessage,
    VoiceMessageBubble,
    BurnAfterReadingMessage,
    AudioMessage,
    BurnAfterReadingTextMessage
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    isGroup: {
      type: Boolean,
      default: false
    }
  },
  emits: ['view-burn-after-reading', 'message-deleted'],
  setup(props, { emit }) {
    // 格式化时间显示
    const formatTime = (timestamp) => {
      if (!timestamp) return 'Invalid Date';
      const date = new Date(timestamp);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${month}-${day} ${hours}:${minutes}`;
    };

    // 查看阅后即焚消息
    const viewBurnAfterReading = (message) => {
      emit('view-burn-after-reading', message);
    };

    // 处理消息删除
    const handleMessageDeleted = (messageId) => {
      emit('message-deleted', messageId);
    };

    return {
      formatTime,
      viewBurnAfterReading,
      handleMessageDeleted
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

  // 为不同类型的消息设置样式
  .content:not(.location-content):not(.file-message):not(.message-image):not(.voice-message):not(.audio-message) {
    padding: 20rpx;
    background: #fff;
  }

  // 自己发送的消息样式
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

    .content:not(.location-content):not(.file-message):not(.message-image):not(.voice-message):not(.audio-message) {
      background: #4e8cff;
      color: #fff;
    }
  }

  // 好友发送的消息样式
  &.friend {
    align-items: flex-start;

    .message-content {
      flex-direction: row;
    }

    .content:not(.location-content):not(.file-message):not(.message-image):not(.voice-message):not(.audio-message) {
      background: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
}

// 消息状态样式
.message-status {
  display: flex;
  align-items: center;
  margin-left: 20rpx;
  height: 100%;
  padding: 0 5rpx;
}

// 加载中图标样式
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

// 发送失败图标样式
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

// 特殊消息类型的样式
.message-image, .voice-message, .audio-message {
  background: transparent !important;
  padding: 0 !important;
  overflow: hidden;
}

.sender-name {
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
  text-align: center;
  max-width: 80rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20rpx;
}
</style>

