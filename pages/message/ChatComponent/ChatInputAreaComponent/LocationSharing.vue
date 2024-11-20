<template>
  <view class="location-sharing">
    <!-- 地图容器 -->
    <view class="map-container">
      <map
        id="locationMap"
        class="map"
        :latitude="currentLocation.latitude"
        :longitude="currentLocation.longitude"
        :markers="markers"
        :scale="16"
        show-location
        @tap="handleMapTap"
      ></map>
    </view>

    <!-- 头部搜索栏和完成按钮 -->
    <view class="header">
      <view class="search-bar">
        <input 
          type="text" 
          v-model="searchKeyword"
          placeholder="搜索地点" 
          @input="handleSearch"
        />
      </view>
      <button class="complete-btn" @click="handleComplete">完成</button>
    </view>

    <!-- 位置列表 -->
    <view class="location-list">
      <scroll-view scroll-y class="scroll-view">
        <view 
          v-for="(poi, index) in nearbyPOIs" 
          :key="index"
          class="location-item"
          :class="{ 'location-item-selected': selectedPOI && selectedPOI.id === poi.id }"
          @tap="selectLocation(poi)"
        >
          <view class="location-name">{{ poi.name }}</view>
          <view class="location-address">{{ poi.address }}</view>
          <view v-if="poi.distance" class="location-distance">{{ formatDistance(poi.distance) }}</view>
          <view class="location-check" v-if="selectedPOI && selectedPOI.id === poi.id">
            <image src="/static/icons/check.png" class="check-icon" />
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { gaodeApiKey } from '@/config/keys';
import { signRequest } from '@/utils/api/mapUtils';
import { sendMessageToUser } from '@/utils/api/message.js';

const AMAP_API = 'https://restapi.amap.com/v3';

export default {
  name: 'LocationSharing',
  props: {
    // 接收者ID，从父组件传入
    recipientId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 当前位置
      currentLocation: {
        latitude: 39.909604,
        longitude: 116.397228
      },
      searchKeyword: '', // 搜索关键词
      markers: [], // 地图标记点
      nearbyPOIs: [], // 附近兴趣点列表
      selectedPOI: null, // 选中的兴趣点
      searchDebounceTimer: null // 搜索防抖定时器
    }
  },
  mounted() {
    // 组件挂载时获取当前位置并隐藏消息输入框
    this.getCurrentLocation();
    this.hideMessageInput();
  },
  beforeDestroy() {
    // 组件销毁前显示消息输入框
    this.showMessageInput();
  },
  methods: {
    // 获取当前位置
    getCurrentLocation() {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.currentLocation = {
            latitude: res.latitude,
            longitude: res.longitude
          };
          this.updateMarkers();
          this.searchNearbyPOIs();
        },
        fail: (err) => {
          console.error('获取位置失败:', err);
          uni.showToast({
            title: '获取位置失败，请检查定位权限',
            icon: 'none'
          });
        }
      });
    },
    // 更新地图标记点
    updateMarkers() {
      this.markers = [{
        id: 1,
        latitude: this.currentLocation.latitude,
        longitude: this.currentLocation.longitude,
        iconPath: '/static/icons/location-blue.png',
        width: 32,
        height: 32
      }];

      if (this.selectedPOI) {
        this.markers.push({
          id: 2,
          latitude: this.selectedPOI.location.split(',')[1],
          longitude: this.selectedPOI.location.split(',')[0],
          iconPath: '/static/icons/location-red.png',
          width: 32,
          height: 32
        });
      }
    },
    // 搜索附近兴趣点
    async searchNearbyPOIs(keyword = '') {
      try {
        const location = `${this.currentLocation.longitude},${this.currentLocation.latitude}`;
        const params = {
          key: gaodeApiKey,
          location: location,
          keywords: keyword,
          radius: 1000,
          extensions: 'all'
        };
        const signedParams = signRequest(params);
        const url = `${AMAP_API}/place/around?${signedParams}`;
        
        const response = await uni.request({
          url,
          method: 'GET'
        });

        if (response.data.status === '1') {
          this.nearbyPOIs = response.data.pois.map(poi => ({
            id: poi.id,
            name: poi.name,
            address: poi.address,
            location: poi.location,
            distance: poi.distance
          }));
        } else {
          throw new Error(response.data.info || '未知错误');
        }
      } catch (error) {
        console.error('搜索位置失败:', error);
        let errorMessage = '搜索位置失败，请稍后重试';
        if (error.message === 'USERKEY_PLAT_NOMATCH') {
          errorMessage = 'API密钥配置错误，请联系管理员';
        }
        uni.showToast({
          title: errorMessage,
          icon: 'none'
        });
      }
    },
    // 处理搜索输入
    handleSearch(event) {
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }
      
      this.searchDebounceTimer = setTimeout(() => {
        this.searchNearbyPOIs(event.detail.value);
      }, 500);
    },
    // 选择位置
    selectLocation(poi) {
      this.selectedPOI = poi;
      this.updateMarkers();
    },
    // 处理地图点击
    async handleMapTap(e) {
      const { latitude, longitude } = e.detail;
      try {
        const params = {
          key: gaodeApiKey,
          location: `${longitude},${latitude}`
        };
        const signedParams = signRequest(params);
        const url = `${AMAP_API}/geocode/regeo?${signedParams}`;
        const response = await uni.request({ url });
        
        if (response.data.status === '1') {
          const regeocode = response.data.regeocode;
          this.selectedPOI = {
            id: Date.now().toString(),
            name: regeocode.formatted_address,
            address: regeocode.addressComponent.street + regeocode.addressComponent.streetNumber,
            location: `${longitude},${latitude}`
          };
          this.updateMarkers();
        } else {
          throw new Error(response.data.info || '获取地址信息失败');
        }
      } catch (error) {
        console.error('获取地址信息失败:', error);
        uni.showToast({
          title: '获取地址信息失败，请重试',
          icon: 'none'
        });
      }
    },
    // 处理完成按钮点击
    async handleComplete() {
      if (!this.selectedPOI) {
        uni.showToast({
          title: '请选择位置',
          icon: 'none'
        });
        return;
      }

      const locationData = {
        latitude: parseFloat(this.selectedPOI.location.split(',')[1]),
        longitude: parseFloat(this.selectedPOI.location.split(',')[0]),
        name: this.selectedPOI.name,
        address: this.selectedPOI.address,
      };

      const locationDataString = JSON.stringify(locationData);
	  console.log('locationDataString',typeof(locationDataString),'locationDataString')
      try {
        const response = await sendMessageToUser({
          isPosition: true,
          message: locationDataString, 
          recipientId: this.recipientId
        });

        if (response.code === 200) {
          console.log('位置信息发送成功:', response.data);
          this.$emit('location-selected', locationData);
          this.$emit('close');
        } else {
          throw new Error(response.msg || '发送位置信息失败');
        }
      } catch (error) {
        console.error('发送位置信息失败:', error);
        uni.showToast({
          title: '发送位置信息失败，请重试',
          icon: 'none'
        });
      }
    },
    // 格式化距离显示
    formatDistance(distance) {
      if (distance < 1000) {
        return `${distance}米`;
      }
      return `${(distance / 1000).toFixed(1)}千米`;
    },
    // 隐藏消息输入框
    hideMessageInput() {
      this.$emit('hide-message-input', true);
      uni.$emit('hide-chat-input', true);
    },
    // 显示消息输入框
    showMessageInput() {
      this.$emit('show-message-input');
    }
  }
}
</script>

<style lang="scss" scoped>
.location-sharing {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  z-index: 9999;
}

.map-container {
  height: 50%;
  position: relative;
  margin: 0;
  padding: 0;
}

.map {
  width: 100%;
  height: 100%;
  display: block;
}

.header {
  padding: 12px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  background: #fff;
  gap: 12px;
}

.search-bar {
  flex: 1;
  margin-right: 0;
  
  input {
    width: 100%;
    height: 36px;
    background: #f5f5f5;
    border-radius: 18px;
    padding: 0 15px;
    font-size: 14px;
    border: none;
  }
}

.complete-btn {
  min-width: 60px;
  height: 36px;
  line-height: 36px;
  background: #007AFF;
  color: #fff;
  border-radius: 18px;
  font-size: 14px;
  text-align: center;
  padding: 0 15px;
}

.location-list {
  flex: 1;
  overflow: hidden;
  margin-top: 1px;
}

.scroll-view {
  height: 100%;
  -webkit-overflow-scrolling: touch;
}

.location-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  position: relative;
}

.location-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.location-address {
  font-size: 13px;
  color: #999;
}

.location-distance {
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 12px;
  color: #999;
}

.location-check {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

.check-icon {
  width: 24px;
  height: 24px;
}

.location-item-selected {
  border: 2px solid #4CAF50;
  border-radius: 8px;
}

.location-check {
  color: #4CAF50;
}
</style>