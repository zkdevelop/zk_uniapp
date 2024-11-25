<template>
	<view class="inputAccountPage" style="padding: 0 15px 0 15px">
		<view class="inputAccountContent">
			<view class="statusBarInput"></view>
			<view class="inputAccountHeader">
				<!-- 推特logo -->
				<view class="inputAccountHeaderLeft"><image @click="backToFirstPage" src="../../../../static/icon/关闭.png" style="width: 20px; height: 20px;"></image></view>
				<view class="inputAccountHeaderMiddle"><image src="../../../../static/icon/X.png" style="width: 25px; height: 25px;"></image></view>
			</view>
			<view>
				<view style="text-align: left; margin-top: 30px;">
					<text style="letter-spacing: 3px; font-size:50rpx; font-family: fantasy; font-weight: 550; width: 75%;">要开始使用，请先输入你的手机号码、邮箱地址或@用户名。</text>
				</view>
				<view style="margin-top: 20px"><uni-easyinput class="inputValue" trim="all" v-model="username" placeholder="手机号码/邮件地址或用户名"></uni-easyinput></view>
				<view style="margin-top: 20px"><uni-easyinput class="inputValue" type="password" trim="all" v-model="password" placeholder="密码"></uni-easyinput></view>
			</view>
		</view>
		
		<view class="inputAccountFooter"><button @click="checkLogin" style="background: black; border-radius: 30px; color: white;">下一步</button></view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { login } from '@/utils/api/user.js'
import { useUserStore } from '@/store/userStore'
import { useWebSocket } from '@/pages/WebSocket/WebSocketService.vue'

const { connect } = useWebSocket()
const userStore = useUserStore()

const autoLogin = ref(false)
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
const username = ref('liuyuqi')
const password = ref('iecas.123')

const backToFirstPage = () => {
	uni.navigateBack();
}

const goToTask = () => {
  uni.redirectTo({
    url: '/pages/tabBar/tabBar'
  })
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
        status: res.data.status,
        missionId: res.data.missionId || '' // 添加 missionId，如果不存在则设为空字符串
      }
      userStore.setUserData(userData)

      // 建立 WebSocket 连接，传入 userId 和 token
      connect(res.data.id, res.data.token)

      // 将整个用户信息对象存储到本地存储
      uni.setStorageSync('userInfo', userData)

      console.log('登录成功。用户数据:', userData)
      console.log('保存的 missionId:', userData.missionId) // 添加日志

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
.inputAccountPage {
	display: flex;
	flex-direction: column;
	height: 100vh;
	.inputAccountContent {
		flex: 1;
		.statusBarInput {
			height: var(--status-bar-height);
			width: 100%;
		}
		.inputAccountHeader {
			display: flex;
			justify-content: space-between; /* 左右对齐 */
			align-items: center; /* 垂直居中 */
			position: relative; /* 为居中组件提供定位支持 */
			height: 50px; /* 设置容器高度 */
			.inputAccountHeaderLeft {
				flex-shrink: 0; /* 保证左侧组件大小不被压缩 */
			}
			.inputAccountHeaderMiddle {
				position: absolute;
				left: 50%; /* 相对容器居中 */
				transform: translateX(-50%); /* 水平居中调整 */
			}
		}
	}
	.inputAccountFooter {
		width: 25%;
		margin: 0 0 20px 70%;
	}
}
</style>