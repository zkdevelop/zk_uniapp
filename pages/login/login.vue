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
import { useUserStore } from '@/store/userStore'
import { login } from '@/utils/api/user.js'
import { useWebSocket } from '@/pages/WebSocket/WebSocketService.vue'

const userStore = useUserStore()
const { connect } = useWebSocket()

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

const checkLogin = async () => {
  try {
    const res = await login({
      account: username.value,
      password: password.value
    })
    if (res.code == 200) {
      userStore.setUserData(res.data)
      uni.setStorageSync('token', res.data.token)
      uni.setStorageSync('userInfo', res.data.account)
      
      // 登录成功后连接到 WebSocket，传递 用户 ID
      connect(res.data.id)

      await uni.showToast({
        title: '登录成功',
        duration: 2000
      })
      goToTask()
    } else {
      uni.showToast({
        title: '登录失败',
        icon: 'none',
        duration: 2000
      })
    }
  } catch (error) {
    uni.showToast({
      title: '登录出错',
      icon: 'none',
      duration: 2000
    })
  }
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