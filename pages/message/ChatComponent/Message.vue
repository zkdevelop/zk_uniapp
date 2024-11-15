<template>
  <view class="message" :class="[message.userType]">
    <view class="message-time">{{ formatTime(message.timestamp) }}</view>
    <view class="message-content">
      <image :src="message.avatar || '/static/message/默认头像.png'" class="avatar" mode="aspectFill"></image>
      <view class="content-wrapper">
        <view v-if="message.userType === 'friend'" class="friend-name">{{ message.name }}</view>
        <view class="content" :class="{ 'location-content': message.type === 'location' }">
          <!-- Location Message Type -->
          <template v-if="message.type === 'location'">
            <view class="location-bubble">
              <view class="location-title">{{ message.content.name }}</view>
              <view class="location-address">{{ message.content.address }}</view>
              <view class="location-map">
                <map
                  class="map"
                  :latitude="message.content.latitude"
                  :longitude="message.content.longitude"
                  :markers="[{
                    latitude: message.content.latitude,
                    longitude: message.content.longitude,
                    iconPath: '/static/icons/location-marker.png',
                    width: 32,
                    height: 32
                  }]"
                  :scale="16"
                ></map>
              </view>
            </view>
          </template>
          
          <!-- Image Message Type -->
          <template v-else-if="message.type === 'image'">
            <image 
              :src="message.content" 
              mode="widthFix" 
              class="message-image" 
              @click="previewImage(message.content)"
            ></image>
          </template>
          
          <!-- Default Text Message Type -->
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
    },
    previewImage(url) {
      uni.previewImage({
        urls: [url],
        current: url
      });
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
    
    &.location-content {
      padding: 0;
      background: transparent;
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
    .content:not(.location-content) {
      background: #4e8cff;
      color: #fff;
    }
    align-items: flex-end;
  }

  &.friend {
    .message-content {
      flex-direction: row;
    }
    .content:not(.location-content) {
      background: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    align-items: flex-start;
  }
}

.location-bubble {
  width: 480rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.location-title {
  font-size: 28rpx;
  color: #333;
  padding: 20rpx 20rpx 10rpx;
  font-weight: 500;
}

.location-address {
  font-size: 24rpx;
  color: #999;
  padding: 0 20rpx 20rpx;
}

.location-map {
  width: 100%;
  height: 240rpx;
  
  .map {
    width: 100%;
    height: 100%;
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

.message-image {
  max-width: 100%;
  border-radius: 5px;
}
</style>