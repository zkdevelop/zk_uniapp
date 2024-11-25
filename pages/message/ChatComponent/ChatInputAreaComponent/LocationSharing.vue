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

const AMAP_API = 'https://restapi.amap.com/v3';

export default {
  name: 'LocationSharing',
  props: {
    recipientId: {
      type: String,
      required: true
    },
    missionId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      currentLocation: {
        latitude: 39.909604,
        longitude: 116.397228
      },
      searchKeyword: '',
      markers: [],
      nearbyPOIs: [],
      selectedPOI: null,
      searchDebounceTimer: null
    }
  },
  mounted() {
    this.getCurrentLocation();
    this.hideMessageInput();
  },
  beforeDestroy() {
    this.showMessageInput();
  },
  methods: {
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
    handleSearch(event) {
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }
      
      this.searchDebounceTimer = setTimeout(() => {
        this.searchNearbyPOIs(event.detail.value);
      }, 500);
    },
    selectLocation(poi) {
      this.selectedPOI = poi;
      this.updateMarkers();
    },
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
    handleComplete() {
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
        type: 'location'
      };

      console.log('LocationSharing: 发送位置数据', locationData);
      this.$emit('location-selected', locationData);
      this.$emit('close');
    },
    formatDistance(distance) {
      if (distance < 1000) {
        return `${distance}米`;
      }
      return `${(distance / 1000).toFixed(1)}千米`;
    },
    hideMessageInput() {
      this.$emit('hide-message-input', true);
      uni.$emit('hide-chat-input', true);
    },
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
  font-weight: bold;
  margin-bottom: 5px;
}

.location-address {
  font-size: 14px;
  color: #666;
}

.location-distance {
  font-size: 12px;
  color: #999;
  position: absolute;
  right: 15px;
  top: 15px;
}

.location-check {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

.check-icon {
  width: 20px;
  height: 20px;
}

.location-item-selected {
  background-color: #f0f0f0;
}
</style>