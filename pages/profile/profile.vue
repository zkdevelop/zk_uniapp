<template>
  <view>
    <view class="container">
      <!-- 用户头像和名称 -->
      <view class="user-info">
        <image class="avatar" src="/static/avatar-placeholder.png"></image>
        <view class="name-container">
          <text class="name">张宁鹏</text>
          <text class="edit-icon">✎</text>
        </view>
      </view>

      <!-- 用户名和设备IP -->
      <view class="info-item">
        <text class="info-label">用户名:</text>
        <text class="info-value">zhangningp</text>
      </view>
      <view class="info-item">
        <text class="info-label">设备IP:</text>
        <text class="info-value">192.168.178.1</text>
      </view>

      <!-- 位置共享开关 -->
      <view class="switch-item">
        <text>是否开启位置共享</text>
        <switch color="#4285f4" />
      </view>

      <!-- 设置选项列表 -->
      <view class="setting-list">
        <view class="setting-item" v-for="(item, index) in settingItems" :key="index" @click="onSettingItemClick(item)">
          <text>{{ item.label }}</text>
          <view class="setting-value">
            <text>{{ item.value }}</text>
            <text class="arrow">></text>
          </view>
        </view>
      </view>

      <!-- 删除聊天记录按钮 -->
      <view class="delete-chat" @click="showDeleteConfirm('chat')">
        <text>删除聊天记录</text>
      </view>
      <view class="delete-all" @click="showDeleteConfirm('all')">
        <text>一键删除</text>
      </view>

      <!-- 退出登录按钮 -->
      <view class="logout" @click="logout()">
        <text>退出登录</text>
      </view>

      <!-- 确认弹窗 -->
      <view v-if="showConfirmDialog" class="dialog-overlay">
        <view class="dialog-content">
          <view class="dialog-body">
            <text>{{ confirmMessage }}</text>
          </view>
          <view class="dialog-footer">
            <button class="dialog-btn cancel-btn" @click="cancelDelete">取消</button>
            <button class="dialog-btn confirm-btn" @click="confirmDelete">确认</button>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 选项选择器 -->
    <OptionPicker
      v-if="showPicker"
      :title="pickerTitle"
      :options="pickerOptions"
      :selectedValue="pickerSelectedValue"
      @select="selectOption"
      @close="closePicker"
    />
  </view>
</template>

<script>
import OptionPicker from './OptionPicker.vue'

export default {
  name: 'MainPage',
  components: {
    OptionPicker,
  },
  data() {
    return {
      settingItems: [
        { label: '定位信息回传间隔', value: '5分钟' },
        { label: '文件本地存储策略', value: '7天' },
        { label: '修改密码', value: '' },
      ],
      showConfirmDialog: false,
      confirmMessage: '',
      deleteType: '',
      selectedStorageStrategy: '7天',
      storageOptions: [
        { label: '7天', value: '7天' },
        { label: '15天', value: '15天' },
        { label: '30天', value: '30天' },
      ],
      selectedLocationInterval: '5分钟',
      locationIntervalOptions: [
        { label: '1分钟', value: '1分钟' },
        { label: '5分钟', value: '5分钟' },
        { label: '10分钟', value: '10分钟' },
        { label: '30分钟', value: '30分钟' },
      ],
      showPicker: false,
      pickerTitle: '',
      pickerOptions: [],
      pickerSelectedValue: '',
      pickerType: '',
    }
  },
  methods: {
    onSettingItemClick(item) {
      if (item.label === '文件本地存储策略') {
        this.openPicker('storage', '文件本地存储策略', this.storageOptions, this.selectedStorageStrategy);
      } else if (item.label === '定位信息回传间隔') {
        this.openPicker('location', '定位信息回传间隔', this.locationIntervalOptions, this.selectedLocationInterval);
      } else if (item.label === '修改密码') {
		  uni.navigateTo({
		  	url: '/pages/forgetPassword/forgetPassword'
		  })
	  }
    },
    openPicker(type, title, options, selectedValue) {
      this.pickerType = type;
      this.pickerTitle = title;
      this.pickerOptions = options;
      this.pickerSelectedValue = selectedValue;
      this.showPicker = true;
    },
    closePicker() {
      this.showPicker = false;
    },
    selectOption(value) {
      if (this.pickerType === 'storage') {
        this.selectedStorageStrategy = value;
        this.settingItems.find(item => item.label === '文件本地存储策略').value = value;
      } else if (this.pickerType === 'location') {
        this.selectedLocationInterval = value;
        this.settingItems.find(item => item.label === '定位信息回传间隔').value = value;
      }
      this.closePicker();
    },
    showDeleteConfirm(type) {
      this.deleteType = type;
      this.confirmMessage = type === 'chat' ? '确定删除聊天记录吗？' : '您确认要删除所有数据吗？';
      this.showConfirmDialog = true;
    },
    cancelDelete() {
      this.showConfirmDialog = false;
    },
    confirmDelete() {
      if (this.deleteType === 'chat') {
        console.log('聊天记录已删除');
      } else {
        console.log('所有数据已删除');
      }
      this.showConfirmDialog = false;
    },
	logout(){
		uni.redirectTo({
			url: '/pages/login/login'
		})
	}
  }
}
</script>

<style>
.container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 60px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-color: #4285f4;
}

.name-container {
  margin-left: 15px;
}

.name {
  font-size: 18px;
  font-weight: bold;
}

.edit-icon {
  margin-left: 5px;
  color: #4285f4;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-label {
  color: #666;
  width: 80px;
}

.info-value {
  color: #333;
}

.switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.setting-list {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.setting-value {
  display: flex;
  align-items: center;
}

.arrow {
  color: #ccc;
  margin-left: 5px;
}

.delete-chat, .delete-all {
  background-color: #fff;
  padding: 15px;
  text-align: center;
  margin-top: 20px;
  border-radius: 8px;
}

.logout {
  background-color: #fff;
  padding: 15px;
  text-align: center;
  margin-top: 20px;
  border-radius: 8px;
  color: #ff3b30;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background-color: #fff;
  border-radius: 12px;
  width: 80%;
  max-width: 300px;
}

.dialog-body {
  padding: 20px;
  text-align: center;
  font-size: 16px;
}

.dialog-footer {
  display: flex;
  border-top: 1px solid #f0f0f0;
}

.dialog-btn {
  flex: 1;
  padding: 12px;
  text-align: center;
  font-size: 16px;
  border: none;
  background-color: transparent;
}

.cancel-btn {
  color: #007aff;
  border-right: 1px solid #f0f0f0;
}

.confirm-btn {
  color: #ff3b30;
}
</style>