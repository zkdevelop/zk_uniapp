<template>
  <view class="location-sharing">
    <view v-if="currentLocation">
      <text class="location-text">当前位置：{{ currentLocation.latitude }}, {{ currentLocation.longitude }}</text>
      <button class="send-location-btn" @click="sendLocation">发送位置</button>
    </view>
    <view v-else>
      <text class="loading-text">正在获取位置...</text>
    </view>
    <button class="close-btn" @click="close">关闭</button>
  </view>
</template>

<script>
export default {
  name: 'LocationSharing',
  data() {
    return {
      currentLocation: null
    }
  },
  mounted() { 
    this.getCurrentLocation()
  },
  methods: {
    getCurrentLocation() { 
      uni.getLocation({
        type: 'gcj02',
        success: (res) => { 
          this.currentLocation = {
            latitude: res.latitude,
            longitude: res.longitude
          }
        },
        fail: (err) => { 
          uni.showToast({
            title: '获取位置失败，请检查定位权限',
            icon: 'none'
          })
        }
      })
    },
    sendLocation() { 
      if (this.currentLocation) {
        this.$emit('location-selected', this.currentLocation)
      } else { 
      }
    },
    close() { 
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.location-sharing {
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.location-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}

.send-location-btn {
  background-color: #4479F0;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  margin-bottom: 10px;
}

.loading-text {
  font-size: 14px;
  color: #666;
}

.close-btn {
  background-color: #ccc;
  color: #333;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
}
</style>