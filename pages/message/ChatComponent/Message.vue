<template>
  <view class="message" :class="[message.userType]">
    <!-- 消息时间 -->
    <view class="message-time">{{ formatTime(message.timestamp) }}</view>
    <view class="message-content">
      <!-- 头像 -->
      <image :src="message.avatar || '/static/message/默认头像.png'" class="avatar" mode="aspectFill"></image>
      <view class="content-wrapper">
        <!-- 好友名称（仅在好友消息中显示） -->
        <view v-if="message.userType === 'friend'" class="friend-name">{{ message.name }}</view>
        <!-- 图片消息 -->
        <view class="content" v-if="message.messageType === 'image'">
          <image :src="message.content" mode="widthFix"></image>
        </view>
        <!-- 文件消息 -->
        <view class="content file-message" v-else-if="message.messageType === 'file'">
          <view class="file-icon">📄</view>
          <view class="file-info">
            <text class="file-name">{{ message.content.name }}</text>
            <text class="file-size">{{ message.content.size }}</text>
          </view>
        </view>
        <!-- 阅后即焚消息 -->
        <view class="content burn-after-reading" v-else-if="message.messageType === 'burn-after-reading'">
          <image 
            :src="message.content.mosaicPath" 
            mode="widthFix" 
            @click="$emit('view-burn-after-reading', message)"
          ></image>
          <text class="burn-after-reading-text">阅后即焚</text>
        </view>
        <!-- 文本消息 -->
        <view class="content" v-else>
          {{ message.content }}
        </view>
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
    image {
      width: 200rpx;
    }
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

.file-message {
  display: flex;
  align-items: center;
}

.file-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.file-info {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: bold;
  margin-bottom: 5rpx;
}

.file-size {
  font-size: 24rpx;
  color: #888;
}

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