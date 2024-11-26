<template>
  <view class="location-bubble" @click="openMap(content)">
    <view class="location-title">{{ content.name }}</view>
    <view class="location-address">{{ content.address }}</view>
    <view class="location-map">
      <image
        class="map-image"
        :src="getStaticMapUrl(content)"
        mode="aspectFill"
      />
    </view>
  </view>
</template>

<script>
import { gaodeApiKey } from '@/config/keys';

const AMAP_KEY = gaodeApiKey;
const AMAP_API_URL = 'https://restapi.amap.com/v3/staticmap?';

export default {
  name: 'LocationMessage',
  props: {
    content: {
      type: Object,
      required: true
    }
  },
  methods: {
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
    }
  }
};
</script>

<style lang="scss" scoped>
.location-bubble {
  max-width: 100%;
  width: 480rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
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
  height: 200rpx;
  overflow: hidden;

  .map-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>