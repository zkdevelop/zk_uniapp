<template>
  <view class="message-read-status">
    <view class="nav-bar">
      <view class="back-button" @click="handleBack">
        <text class="back-icon">＜</text>
      </view>
      <view class="title">消息详情</view>
    </view>

    <view v-if="messageData" class="message-info">
      <view class="sender-info">
        <text class="sender-name">{{ messageData.senderName }}</text>
        <text class="message-time">{{ formatTime(messageData.timestamp) }}</text>
      </view>
      <view class="message-content">{{ messageData.content }}</view>
    </view>

    <view class="read-status-container">
      <view class="read-status-tabs">
        <view 
          class="tab" 
          :class="{ active: activeTab === 'read' }"
          @click="setActiveTab('read')"
        >
          <text class="tab-number">{{ readUsers.length }}</text>
          <text class="tab-text">人已读</text>
        </view>
        <view 
          class="tab" 
          :class="{ active: activeTab === 'unread' }"
          @click="setActiveTab('unread')"
        >
          <text class="tab-number">{{ unreadUsers.length }}</text>
          <text class="tab-text">人未读</text>
        </view>
      </view>

      <scroll-view class="user-list" scroll-y>
        <view 
          v-for="user in displayUsers" 
          :key="user.userId" 
          class="user-item"
        >
          <image 
            :src="user.avatarUrl || '/static/message/默认头像.png'" 
            class="user-avatar"
            mode="aspectFill"
          />
          <text class="user-name">{{ user.userName }}</text>
          <text v-if="activeTab === 'read' && user.readTime" class="read-time">
            {{ formatTime(user.readTime) }}
          </text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'MessageReadStatus',
  setup() {
    const messageData = ref(null)
    const activeTab = ref('read')

    const readUsers = computed(() => {
      return messageData.value?.groupMessageUserReadVO?.filter(user => user.isRead) || []
    })
    
    const unreadUsers = computed(() => {
      return messageData.value?.groupMessageUserReadVO?.filter(user => !user.isRead) || []
    })

    const displayUsers = computed(() => {
      return activeTab.value === 'read' ? readUsers.value : unreadUsers.value
    })

    const setActiveTab = (tab) => {
      activeTab.value = tab
    }

    onMounted(() => {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      let eventChannel

      if (currentPage && currentPage.$getAppWebview) {
        eventChannel = currentPage.$getAppWebview().eventChannel
      } else if (currentPage && currentPage.getOpenerEventChannel) {
        eventChannel = currentPage.getOpenerEventChannel()
      } else if (uni && uni.getEnterOptionsSync) {
        const enterOptions = uni.getEnterOptionsSync()
        eventChannel = enterOptions.eventChannel
      }

      if (eventChannel) {
        eventChannel.on('messageData', (data) => {
          messageData.value = data
          console.log('接收到的消息数据：', data)
        })
      } else {
        console.log('无法获取事件通道')
      }
    })

    const formatTime = (timestamp) => {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${month}-${day} ${hours}:${minutes}`
    }

    const handleBack = () => {
      uni.navigateBack()
    }

    return {
      messageData,
      activeTab,
      readUsers,
      unreadUsers,
      displayUsers,
      formatTime,
      handleBack,
      setActiveTab
    }
  }
}
</script>

<style lang="scss" scoped>
.message-read-status {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #F7F7F7;
}

.nav-bar {
  height: 88rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  z-index: 100;
}

.back-button {
  padding: 20rpx 32rpx 20rpx 0;
  margin-left: -32rpx;
}

.back-icon {
  font-size: 36rpx;
  color: #333;
}

.title {
  flex: 1;
  text-align: center;
  font-size: 34rpx;
  font-weight: 500;
  color: #333;
  margin-right: 52rpx;
}

.message-info {
  padding: 32rpx;
  background-color: #fff;
}

.sender-info {
  margin-bottom: 16rpx;
}

.sender-name {
  font-size: 34rpx;
  font-weight: 500;
  color: #333;
  margin-right: 16rpx;
}

.message-time {
  font-size: 24rpx;
  color: #999;
}

.message-content {
  font-family: NotoSansCJKsc-Medium;
  font-size: 32rpx;
  color: #383838;
  letter-spacing: 0;
  text-align: justify;
  font-weight: 500;
  line-height: 1.5;
  word-break: break-all;
}

.read-status-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 20rpx;
  background-color: #fff;
}

.read-status-tabs {
  display: flex;
  border-bottom: 1rpx solid #EEEEEE;
}

.tab {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  .tab-number {
    font-family: NotoSansCJKsc-Regular;
    font-size: 40rpx;
    color: #8D8D8D;
    letter-spacing: 0;
    font-weight: 400;
  }

  .tab-text {
    font-family: NotoSansCJKsc-Regular;
    font-size: 28rpx;
    color: #8D8D8D;
    letter-spacing: 0;
    font-weight: 400;
  }
  
  &.active {
    .tab-number {
      font-family: NotoSansCJKsc-Medium;
      color: #0A0A0A;
      font-weight: 500;
    }
    
    .tab-text {
      font-family: NotoSansCJKsc-Medium;
      color: #0A0A0A;
      font-weight: 500;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 120rpx;
      height: 4rpx;
      background-color: #3D8AF5;
    }
  }
}

.user-list {
  flex: 1;
  overflow-y: auto;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  position: relative;
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 132rpx;  // 头像宽度 + 右边距 + 左边距
    height: 1rpx;
    background-color: #EEEEEE;
  }
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.user-name {
  flex: 1;
  font-family: NotoSansCJKsc-Medium;
  font-size: 30rpx;
  color: #0A0A0A;
  letter-spacing: 0;
  font-weight: 500;
}

.read-time {
  font-size: 24rpx;
  color: #999;
}
</style>

