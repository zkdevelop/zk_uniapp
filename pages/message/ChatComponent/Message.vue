<template>
  <view class="message" :class="[message.userType]">
    <view class="message-time">{{ formatTime(message.timestamp) }}</view>
    <view class="message-content" :class="{ 'self-message': message.userType === 'self' }">
      <image :src="message.avatar || '/static/message/默认头像.png'" class="avatar" mode="aspectFill"></image>
      <view class="content-wrapper">
        <view v-if="message.userType === 'friend'" class="friend-name">{{ message.name }}</view>
        <view class="content" :class="{ 'location-content': message.type === 'location' }">
          <!-- 位置消息类型 -->
          <template v-if="message.type === 'location' && message.content">
            <view class="location-bubble" @click="openMap(message.content)">
              <view class="location-title">{{ message.content.name }}</view>
              <view class="location-address">{{ message.content.address }}</view>
              <view class="location-map">
                <image
                  class="map-image"
                  :src="getStaticMapUrl(message.content)"
                  mode="aspectFill"
                />
              </view>
            </view>
          </template>

          <!-- 图片消息类型 -->
          <template v-else-if="message.type === 'image'">
            <image 
              :src="message.content" 
              mode="widthFix" 
              class="message-image" 
              @click="previewImage(message.content)"
            ></image>
          </template>

          <!-- 阅后即焚消息类型 -->
          <template v-else-if="message.type === 'burn-after-reading'">
            <view class="burn-after-reading" @click="viewBurnAfterReading(message)">
              <image 
                :src="message.content.mosaicPath" 
                mode="widthFix" 
                class="message-image"
              ></image>
              <text class="burn-after-reading-text">阅后即焚</text>
            </view>
          </template>
          
          <!-- 文件消息类型 -->
          <template v-else-if="message.type === 'file'">
            <view class="file-message">
              <image src="/static/message/file-icon.png" class="file-icon" mode="aspectFit" />
              <text class="file-name">{{ message.content }}</text>
            </view>
          </template>

          <!-- 默认文本消息类型 -->
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
import { gaodeApiKey } from '@/config/keys';
const AMAP_KEY = gaodeApiKey;
const AMAP_API_URL = 'https://restapi.amap.com/v3/staticmap?';

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
      if (!timestamp) return 'Invalid Date';
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
    },
    openMap(location) {
      if (!location || !location.latitude || !location.longitude) {
        console.error('无效的位置数据:', location);
        return;
      }
      uni.openLocation({
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        name: location.name,
        address: location.address,
        success: function () {
          console.log('成功打开地图');
        },
        fail: function (error) {
          console.error('打开地图失败:', error);
        }
      });
    },
    getStaticMapUrl(location) {
      return `${AMAP_API_URL}location=${location.longitude},${location.latitude}&zoom=14&size=480*240&scale=2&markers=mid,,A:${location.longitude},${location.latitude}&key=${AMAP_KEY}`;
    },
    viewBurnAfterReading(message) {
      this.$emit('view-burn-after-reading', message);
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
      align-items: center;
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
  margin: 10rpx 0;
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
  overflow: hidden;
  
  .map-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

.file-message {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .file-icon {
    width: 80rpx;
    height: 80rpx;
    margin-right: 20rpx;
  }
  
  .file-name {
    font-size: 28rpx;
    color: #333;
    word-break: break-all;
  }
}
</style>