<template>
  <view class="container">
    <!-- User avatar, name, username, and phone -->
    <view class="user-info">
      <image class="avatar" :src="userData.avatarUrl || '/static/my/默认头像.svg'"></image>
      <view class="user-details">
        <view class="name-container">
          <text class="name">{{ userData.name || '未设置' }}</text>
          <image class="edit-icon" src="/static/my/编辑.svg"></image>
        </view>
        <view class="info-item">
          <text class="info-label">用户名：</text>
          <text class="info-value">{{ userData.account || '未设置' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">手机：</text>
          <text class="info-value">{{ userData.phone || '未设置' }}</text>
        </view>
      </view>
    </view>

    <!-- Location sharing switch -->
    <view class="switch-item">
      <text>是否开启位置共享</text>
      <switch color="#4285f4" v-model="locationSharing" />
    </view>

    <!-- Settings list -->
    <view class="setting-list">
      <view class="setting-item" @click="onSettingItemClick(settingItems[0])">
        <text>定位信息回传间隔</text>
        <view class="setting-value">
          <text class="setting-value-text">{{ selectedLocationInterval }}</text>
          <image class="expand-icon" src="/static/my/展开.svg"></image>
        </view>
      </view>
      <view class="setting-item" @click="onSettingItemClick(settingItems[1])">
        <text>文件本地存储策略</text>
        <view class="setting-value">
          <text class="setting-value-text">{{ selectedStorageStrategy }}</text>
          <image class="expand-icon" src="/static/my/展开.svg"></image>
        </view>
      </view>
      <view class="setting-item" @click="onSettingItemClick(settingItems[2])">
        <text>修改密码</text>
        <view class="setting-value">
          <image class="expand-icon" src="/static/my/展开.svg"></image>
        </view>
      </view>
    </view>

    <!-- Delete chat history button -->
    <view class="delete-chat" @click="showDeleteConfirm('chat')">
      <text>删除聊天记录</text>
    </view>
    <view class="delete-all" @click="showDeleteConfirm('all')">
      <text>一键删除</text>
    </view>

    <!-- Logout button -->
    <view class="logout" @click="performLogout">
      <text>退出登录</text>
    </view>

    <!-- Confirmation dialog -->
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
    
    <!-- Option picker -->
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

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import OptionPicker from './OptionPicker.vue'
import { useUserStore } from '@/store/userStore'
import { logout } from '@/utils/api/user'

const userStore = useUserStore()

const userData = computed(() => userStore.state)

const locationSharing = ref(false)
const showConfirmDialog = ref(false)
const confirmMessage = ref('')
const deleteType = ref('')
const selectedStorageStrategy = ref('7天')
const storageOptions = [
  { label: '7天', value: '7天' },
  { label: '15天', value: '15天' },
  { label: '30天', value: '30天' },
]
const selectedLocationInterval = ref('5分钟')
const locationIntervalOptions = [
  { label: '1分钟', value: '1分钟' },
  { label: '5分钟', value: '5分钟' },
  { label: '10分钟', value: '10分钟' },
  { label: '30分钟', value: '30分钟' },
]
const showPicker = ref(false)
const pickerTitle = ref('')
const pickerOptions = ref([])
const pickerSelectedValue = ref('')
const pickerType = ref('')

const settingItems = reactive([
  { label: '定位信息回传间隔', value: '5分钟' },
  { label: '文件本地存储策略', value: '7天' },
  { label: '修改密码', value: '' },
])

const loadUserData = async () => {
  console.log('loadUserData 开始执行')
  if (!userData.value.id) {
    console.log('userData 中没有 id，尝试从本地存储获取')
    const userInfo = uni.getStorageSync('userInfo')
    console.log('从本地存储获取的 userInfo:', userInfo)
    if (userInfo && typeof userInfo === 'object') {
      console.log('从本地存储获取到有效的 userInfo，更新 userStore')
      userStore.setUserData(userInfo)
    } else {
      console.log('本地存储中没有有效的 userInfo，尝试从服务器获取')
      await fetchUserInfo()
    }
  } else {
    console.log('userData 中已有 id:', userData.value.id)
  }
  console.log('loadUserData 执行完毕')
}

const fetchUserInfo = async () => {
  console.log('fetchUserInfo 开始执行')
  uni.showLoading({ title: '加载中...', mask: true })
  try {
    console.log('从 userStore 获取用户信息')
    const userInfo = userStore.state
    console.log('获取到的原始 userInfo:', userInfo)

    const userData = {
      id: userInfo.id,
      name: userInfo.name,
      account: userInfo.account,
      phone: userInfo.phone,
      avatarUrl: userInfo.avatarUrl
    }
    console.log('处理后的 userData:', userData)

    console.log('更新 userStore')
    userStore.setUserData(userData)

    console.log('保存用户信息到本地存储')
    uni.setStorageSync('userInfo', userData)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    uni.showToast({ title: '获取用户信息失败', icon: 'none' })
  } finally {
    uni.hideLoading()
    console.log('fetchUserInfo 执行完毕')
  }
}

onMounted(() => {
  console.log('profile 组件 onMounted')
  loadUserData()
})

onShow(() => {
  console.log('profile 组件 onShow')
  loadUserData()
})

const onSettingItemClick = (item) => {
  if (item.label === '文件本地存储策略') {
    openPicker('storage', '文件本地存储策略', storageOptions, selectedStorageStrategy.value)
  } else if (item.label === '定位信息回传间隔') {
    openPicker('location', '定位信息回传间隔', locationIntervalOptions, selectedLocationInterval.value)
  } else if (item.label === '修改密码') {
    uni.navigateTo({
      url: '/pages/forgetPassword/forgetPassword'
    })
  }
}

const openPicker = (type, title, options, selectedValue) => {
  pickerType.value = type
  pickerTitle.value = title
  pickerOptions.value = options
  pickerSelectedValue.value = selectedValue
  showPicker.value = true
}

const closePicker = () => {
  showPicker.value = false
}

const selectOption = (value) => {
  if (pickerType.value === 'storage') {
    selectedStorageStrategy.value = value
    settingItems.find(item => item.label === '文件本地存储策略').value = value
  } else if (pickerType.value === 'location') {
    selectedLocationInterval.value = value
    settingItems.find(item => item.label === '定位信息回传间隔').value = value
  }
  closePicker()
}

const showDeleteConfirm = (type) => {
  deleteType.value = type
  confirmMessage.value = type === 'chat' ? '确定删除聊天记录吗？' : '您确认要删除所有数据吗？'
  showConfirmDialog.value = true
}

const cancelDelete = () => {
  showConfirmDialog.value = false
}

const confirmDelete = () => {
  if (deleteType.value === 'chat') {
    console.log('聊天记录已删除')
  } else {
    console.log('所有数据已删除')
  }
  showConfirmDialog.value = false
}

const performLogout = async () => {
  uni.showLoading({
    title: '正在退出登录',
    mask: true
  })

  try {
    if (uni.getStorageSync('token')) {
      await logout()
    }
  } catch (error) {
    console.error('退出登录失败:', error)
  } finally {
    uni.removeStorageSync('token')
    uni.removeStorageSync('userInfo')
    userStore.clearUserData()
    uni.redirectTo({
      url: '/pages/login/login'
    })
    uni.hideLoading()
  }
}
</script>

<style>
.container {
  padding: 0;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.user-info {
  display: flex;
  align-items: flex-start;
  padding: 20px 17px;
  background-color: #fff;
  margin-bottom: 1px;
}

.avatar {
  width: 73px;
  height: 73px;
  border-radius: 4px;
  background-color: #4285f4;
}

.user-details {
  margin-left: 14px;
  flex: 1;
}

.name-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.name {
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
}

.edit-icon {
  width: 16px;
  height: 16px;
}

.info-item {
  display: flex;
  height: 16px;
  line-height: 16px;
  margin-bottom: 5px;
}

.info-label {
  color: #666;
  min-width: 70px;
}

.info-value {
  color: #333;
}

.switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #fff;
}

.setting-list {
  background-color: #fff;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-value {
  display: flex;
  align-items: center;
}

.setting-value-text {
  color: #4285f4;
  margin-right: 5px;
}

.expand-icon {
  width: 20px;
  height: 20px;
}

.delete-chat {
  background-color: #fff;
  padding: 15px;
  text-align: center;
  margin-top: 11px;
  margin-bottom: 6px;
}

.delete-all {
  background-color: #fff;
  padding: 15px;
  text-align: center;
  margin-bottom: 6px;
}

.logout {
  background-color: #fff;
  padding: 15px;
  text-align: center;
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