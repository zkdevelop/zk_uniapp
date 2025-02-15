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
      <view class="message-content" :class="{ 
        'location-content': messageData.type === 'location', 
        'file-message': messageData.type === 'file', 
        'message-image': messageData.type === 'image', 
        'voice-message': messageData.type === 'voice_message',
        'audio-message': messageData.type === 'audio'
      }">
        <LocationMessage v-if="messageData.type === 'location'" :content="messageData.content" />
        <ImageMessage v-else-if="messageData.type === 'image'" :content="messageData.content" />
        <FileMessage v-else-if="messageData.type === 'file'" :content="messageData.content" :messageType="messageData.messageType" />
        <VoiceMessageBubble 
          v-else-if="messageData.type === 'voice_message'" 
          :content="{ 
            url: messageData.content, 
            duration: messageData.duration, 
            isSelf: false 
          }" 
        />
        <AudioMessage
          v-else-if="messageData.type === 'audio'"
          :content="messageData.content"
          :messageType="messageData.messageType"
        />
        <BurnAfterReadingMessage v-else-if="messageData.type === 'burn-after-reading'" :content="messageData.content" @view-burn-after-reading="viewBurnAfterReading" />
        <BurnAfterReadingTextMessage
          v-else-if="messageData.selfDestruct && messageData.messageType === 'MESSAGE'"
          :messageId="messageData.id"
          :isGroup="true"
          @message-deleted="handleMessageDeleted"
        />
        <template v-else>
          {{ messageData.content || '' }}
        </template>
      </view>
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
import LocationMessage from './MessageComponent/LocationMessage.vue'
import ImageMessage from './MessageComponent/ImageMessage.vue'
import FileMessage from './MessageComponent/FileMessage.vue'
import VoiceMessageBubble from './MessageComponent/VoiceMessageBubble.vue'
import BurnAfterReadingMessage from './MessageComponent/BurnAfterReadingMessage.vue'
import AudioMessage from './MessageComponent/AudioMessage.vue'
import BurnAfterReadingTextMessage from './MessageComponent/BurnAfterReadingTextMessage.vue'

export default {
  name: 'MessageReadStatus',
  components: {
    LocationMessage,
    ImageMessage,
    FileMessage,
    VoiceMessageBubble,
    BurnAfterReadingMessage,
    AudioMessage,
    BurnAfterReadingTextMessage
  },
  setup() {
    console.log('消息已读状态组件设置开始')
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
      console.log('消息已读状态组件挂载')
      
      // 从缓存中读取数据
      const cachedData = uni.getStorageSync('messageReadStatusData')
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData)
          console.log('从缓存中读取的消息数据:', parsedData)
          messageData.value = {
            ...parsedData,
            type: parsedData.type || 'text',
            messageType: parsedData.messageType || 'MESSAGE',
            selfDestruct: parsedData.selfDestruct || false,
            id: parsedData.id
          }
          console.log('设置的消息数据:', messageData.value)
          // 使用后清除缓存数据
          uni.removeStorageSync('messageReadStatusData')
          console.log('已清除缓存的消息数据')
        } catch (error) {
          console.log('解析缓存数据失败:', error)
          handleDataLoadError()
        }
      } else {
        console.log('缓存中没有找到消息数据')
        handleDataLoadError()
      }

      console.log('消息已读状态组件挂载完成')
    })

    const handleDataLoadError = () => {
      uni.showToast({
        title: '无法加载消息数据',
        icon: 'none'
      })
      setTimeout(() => {
        console.log('无法加载消息数据，返回上一页')
        uni.navigateBack()
      }, 2000)
    }

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
      console.log('返回上一页')
      uni.navigateBack()
    }

    const viewBurnAfterReading = (message) => {
      console.log('查看阅后即焚消息', message)
    }

    const handleMessageDeleted = (messageId) => {
      console.log('消息已删除', messageId)
    }

    console.log('消息已读状态组件设置完成')
    return {
      messageData,
      activeTab,
      readUsers,
      unreadUsers,
      displayUsers,
      formatTime,
      handleBack,
      setActiveTab,
      viewBurnAfterReading,
      handleMessageDeleted
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

  &.location-content,
  &.file-message,
  &.message-image,
  &.voice-message,
  &.audio-message {
    background: transparent;
    padding: 0;
    overflow: hidden;
  }
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
    left: 132rpx;
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

