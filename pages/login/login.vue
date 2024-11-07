<template>
  <view class="layout">
    <view class="iconView">
      <image src="../../static/icon/login.png" class="icon"></image>
    </view>
    <view class="text">
      <text>欢迎登录！</text>
    </view>
    <view class="account" style="margin-top: 25px;">
      <view class="title" style="margin-bottom: 7px;">用户名</view>
      <input class="uni-input" focus placeholder="请输入用户名" v-model="username" />
      <view class="title" style="margin: 15px 0px 7px 0px;">密码</view>
      <input class="uni-input" password type="text" placeholder="请输入密码" v-model="password" />
      <button @click="checkLogin" type="primary" style="margin-top: 15px;">登录</button>
    </view>
    <view class="container">
      <view class="left">
        <label class="checkbox">
          <checkbox :value="autoLogin" @change="toggleAutoLogin">自动登录</checkbox>
        </label>
      </view>
      <view class="right">
        <text @click="goToRegister" class="clicked_text">注册 </text>
        <text @click="goToForgetPassword" class="clicked_text"> 忘记密码</text>
        <text> | </text>
        <text @click="goToFingerLogin" class="clicked_text">指纹登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { login } from '@/utils/api/user.js'
import { useUserStore } from '@/store/userStore'
import { useWebSocket } from '@/pages/WebSocket/WebSocketService.vue'

const { connect } = useWebSocket()

const userStore = useUserStore()

const autoLogin = ref(false)
const username = ref('test-app')
const password = ref('test123456')

const goToRegister = () => {
  uni.navigateTo({
    url: '/pages/register/register'
  })
}

const goToForgetPassword = () => {
  uni.navigateTo({
    url: '/pages/forgetPassword/forgetPassword'
  })
}

const goToFingerLogin = () => {
  uni.navigateTo({
    url: '/pages/fingerLogin/fingerLogin'
  })
}

const goToTask = () => {
  uni.redirectTo({
    url: '/pages/tabBar/tabBar'
  })
}

const toggleAutoLogin = (e) => {
  autoLogin.value = e.detail.value.length > 0
  if (autoLogin.value) {
    uni.navigateTo({
      url: '/pages/register/register'
    })
  }
}

const checkLogin = () => {
  uni.showLoading({
    title: '正在登录',
    mask: true
  })

  login({
    account: username.value,
    password: password.value
  }).then(res => {
    if (res.code === 200) {
      // 存储成功登录的账号密码
      uni.setStorageSync('username', username.value)
      uni.setStorageSync('password', password.value)
      uni.setStorageSync('token', res.data.token)
      
      // 设置用户数据到 store
      const userData = {
        id: res.data.id,
        account: res.data.account,
        name: res.data.name,
        department: res.data.department,
        role: res.data.role,
        phone: res.data.phone,
        created: res.data.created,
        avatar: res.data.avatar,
        avatarUrl: res.data.avatarUrl,
        token: res.data.token,
        status: res.data.status
      }
      userStore.setUserData(userData)

      // 建立 WebSocket 连接，传入 userId 和 token
      connect(res.data.id, res.data.token)

      // 将整个用户信息对象存储到本地存储
      uni.setStorageSync('userInfo', userData)

      console.log('登录成功。用户数据:', userData)

      uni.hideLoading()
      uni.showToast({
        title: '登录成功',
        duration: 2000
      }).then(() => {
        goToTask()
      })
    } else {
      throw new Error(res.message || '登录失败')
    }
  }).catch(error => {
    console.error('登录失败:', error)
    uni.hideLoading()
    uni.showToast({
      title: error.message || '登录失败',
      icon: 'none',
      duration: 2000
    })
  })
}
</script>

<style lang="scss">
.layout {
  margin-left: 25px;
  margin-right: 25px;
}

.icon {
  width: 50px;
  height: 50px;
}

.iconView {
  margin-top: 100px;
}

.text {
  margin-top: 10px;

  text {
    font-size: 25px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
}

.clicked_text {
  color: #4c84ff;
  cursor: pointer;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.uni-input {
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 15px;
  margin-bottom: 10px;
}

.checkbox {
  display: flex;
  align-items: center;
}

button {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
}
</style>