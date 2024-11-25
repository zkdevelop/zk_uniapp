<template>
  <view class="messages-container">
    <view class="messages-view">
      <view class="messages-header">
        <text class="header-title">消息({{ totalMessageCount }})</text>
        <view class="search-icon">
          <image src="/static/message/搜索.png" mode="aspectFit" class="search-image"></image>
        </view>
      </view>
      
      <scroll-view class="messages-list" scroll-y enable-flex :style="{ height: scrollViewHeight + 'px' }">
        <!-- 系统消息 -->
        <view class="message-item system-message">
          <view class="message-icon system-icon">
            <text>📢</text>
            <view class="notification-badge">{{ systemMessage.notificationCount }}</view>
          </view>
          <view class="message-content">
            <view class="message-title">{{ systemMessage.title }}</view>
            <view class="message-preview">{{ systemMessage.preview }}</view>
          </view>
          <view class="message-date">{{ systemMessage.date }}</view>
        </view>
        
        <!-- 消息列表 -->
        <view 
          v-for="(message, index) in combinedMessages" 
          :key="index" 
          class="message-item"
          :class="{ 'personal-chat': !message.group }"
          @click="openChat(message)"
        >
          <group-avatar v-if="message.group" :avatar="message.avatar" class="avatar" />
          <image v-else :src="getAvatarSrc(message.avatar)" class="avatar" mode="aspectFill"></image>
          <view class="message-content-wrapper">
            <view class="message-content">
              <view class="message-title">{{ message.name || message.userName }}</view>
              <view class="message-preview">{{ message.preview || message.latestMessage }}</view>
            </view>
            <view class="message-date">{{ formatDate(message.date || message.sendTime) }}</view>
          </view>
          <view v-if="message.unreadCount > 0" class="unread-badge">{{ message.unreadCount }}</view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { ref, computed, onMounted, onActivated } from 'vue'
import { getChatList } from '@/utils/api/message.js'
import { useUserStore } from '@/store/userStore'
import GroupAvatar from './ChatComponent/GroupAvatar.vue'

export default {
  name: 'Messages',
  components: {
    GroupAvatar
  },
  setup() {
    // 状态定义
    const userStore = useUserStore()
    const missionId = ref('')
    const realMessages = ref([])
    const scrollViewHeight = ref(0)
    const demoMessages = ref([
      {
        id: '1',
        name: '张三',
        avatar: ['/static/avatar/avatar1.png'],
        preview: '你好，最近怎么样？',
        date: '2024-11-25T10:00:00',
        type: 'single',
        unreadCount: 2
      },
      {
        id: '2',
        name: '项目讨论群',
        avatar: ['/static/avatar/group1.png', '/static/avatar/group2.png', '/static/avatar/group3.png'],
        preview: '下周一开会，请大家准时参加',
        date: '2024-11-24T15:30:00',
        type: 'group',
        unreadCount: 5
      }
    ])

    // 计算属性
    const combinedMessages = computed(() => [...demoMessages.value, ...realMessages.value])
    const totalMessageCount = computed(() => {
      const totalUnread = combinedMessages.value.reduce((sum, message) => sum + (message.unreadCount || 0), 0)
      return combinedMessages.value.length + totalUnread
    })
    const systemMessage = computed(() => ({
      title: '推送消息',
      preview: '系统版本更新',
      date: getCurrentDate(),
      notificationCount: Math.floor(Math.random() * 20) + 1
    }))

    // 方法定义
    const fetchChatList = async () => {
      console.log('正在获取聊天列表，使用的 missionId:', missionId.value)
      if (!missionId.value) {
        console.error('fetchChatList 中 missionId 未设置')
        return
      }
      try {
        const response = await getChatList(missionId.value)
        if (response.code === 200) {
          realMessages.value = response.data.map(item => ({
            ...item,
            avatar: item.avatar || '/static/message/默认头像.png',
            preview: item.latestMessage,
            date: item.sendTime
          }))
          console.log('获取到的聊天列表:', realMessages.value)
        } else {
          console.error('获取聊天列表失败:', response.msg)
        }
      } catch (error) {
        console.error('获取聊天列表时发生错误:', error)
      }
    }

    const openChat = (message) => {
      const chatInfo = {
        id: message.id || message.userId,
        name: message.name || message.userName,
        avatar: message.avatar || '/static/message/默认头像.png',
        type: message.group ? 'group' : 'single',
        missionId: missionId.value
      }
      uni.navigateTo({
        url: '/pages/message/chat',
        success: (res) => {
          res.eventChannel.emit('chatInfo', { chatInfo })
        },
        fail: (err) => {
          console.error('导航到聊天页面失败:', err)
        }
      })
    }

    const getCurrentDate = () => {
      const now = new Date()
      const month = now.getMonth() + 1
      const day = now.getDate()
      return `${month}月${day}日`
    }

    const getAvatarSrc = (avatar) => {
      return Array.isArray(avatar) ? avatar[0] : (avatar || '/static/message/默认头像.png')
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        return formatTime(date)
      } else if (diffDays === 1) {
        return '昨天'
      } else if (diffDays < 7) {
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        return weekdays[date.getDay()]
      } else {
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${month}月${day}日`
      }
    }

    const formatTime = (date) => {
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }

    const calculateScrollViewHeight = () => {
      const systemInfo = uni.getSystemInfoSync()
      const headerHeight = 44 // 根据实际头部高度调整
      const tabBarHeight = 50 // 根据实际底部 tabBar 高度调整
      scrollViewHeight.value = systemInfo.windowHeight - headerHeight - tabBarHeight
    }

    // 生命周期钩子
    onMounted(() => {
      missionId.value = userStore.state.missionId
      console.log('从 store 获取的 missionId:', missionId.value)
      fetchChatList()
      calculateScrollViewHeight()
    })

    // 添加 onActivated 钩子
    onActivated(() => {
      console.log('Messages 组件被激活')
      fetchChatList() // 重新获取聊天列表
    })

    return {
      combinedMessages,
      totalMessageCount,
      systemMessage,
      scrollViewHeight,
      openChat,
      getAvatarSrc,
      formatDate
    }
  }
}
</script>

<style>
/* 样式保持不变 */
.messages-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;
}

.messages-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-image {
  width: 20px;
  height: 20px;
}

.messages-list {
  flex: 1;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.message-item {
  display: flex;
  align-items: flex-start;
  padding: 15px 15px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.system-message {
  background-color: #f0f8ff;
}

.message-icon, .avatar {
  width: 54px;
  height: 54px;
  border-radius: 5px;
  margin-right: 10px;
  flex-shrink: 0;
}

.system-icon {
  background-color: #4285f4;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff3b30;
  color: #fff;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 8px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-content-wrapper {
  flex: 1;
  display: flex;
  justify-content: space-between;
  min-width: 0;
  padding-top: 2px;
}

.message-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.message-title {
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.message-preview {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.message-date {
  font-size: 11px;
  color: #999;
  margin-left: 10px;
  flex-shrink: 0;
}

.personal-chat {
  padding: 12px 15px;
}

.personal-chat .message-icon,
.personal-chat .avatar {
  width: 48px;
  height: 48px;
}

.personal-chat .message-title {
  font-size: 13px;
}

.personal-chat .message-preview {
  font-size: 11px;
}

.personal-chat .message-date {
  font-size: 10px;
}

.unread-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff3b30;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>