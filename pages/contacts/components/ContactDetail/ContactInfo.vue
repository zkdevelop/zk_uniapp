<!-- ContactInfo.vue - 联系人信息展示组件 -->
<template>
  <view class="main-info">  
    <view class="profile-section">
      <avatar :src="contact.avatarUrl" :size="65" />
      <view class="info-section">
        <view class="name-section">
          <text class="name">{{contact.name}}</text>
          <view class="badge-section">
            <text class="badge">{{ contact.title }}</text>
          </view>
        </view>
        <view class="details-section">
          <view class="detail-item">
            <text class="detail-label">用户名</text>
            <text class="detail-value">{{ contact.username }}</text>
          </view>
          <view class="detail-item">
            <text class="detail-label">设备IP</text>
            <text class="detail-value">{{ contact.ip }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Avatar from '../shared/Avatar.vue'

export default {
  name: 'ContactInfo',
  components: {
    Avatar
  },
  props: {
    contact: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.main-info {
  background-color: #fff;
  margin-bottom: 8px;
  padding: 20px 16px;
}

.profile-section {
  display: flex;
  align-items: flex-start;
}

.info-section {
  flex: 1;
  min-width: 0;
  padding-left: 16px;
}

.name-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.badge-section {
  margin-bottom: 16px;
}

.badge {
  display: inline-block;
  background-color: #e6f0ff;
  padding: 2px 8px;
  border-radius: 4px;
  color: #007AFF;
  font-size: 14px;
}

.details-section {
  margin-top: 8px;
}

.detail-item {
  margin-bottom: 2px;
  display: flex;
  align-items: center;
}

.detail-label {
  color: #666;
  font-size: 15px;
  margin-right: 8px;
}

.detail-value {
  color: #333;
  font-size: 15px;
}
</style>

