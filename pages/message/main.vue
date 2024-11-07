<template>
  <view class="messages-container">
    <view class="messages-view">
      <view class="messages-header">
        <text class="header-title">消息({{ totalMessageCount }})</text>
        <view class="search-icon">
          <text>🔍</text>
        </view>
      </view>
      
      <scroll-view class="messages-list" scroll-y>
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
        
        <view 
          v-for="(message, index) in messages" 
          :key="index" 
          class="message-item"
          @click="openChat(message)"
        >
          <group-avatar v-if="message.type === 'group'" :avatar="message.avatar" class="avatar" />
          <image v-else :src="getAvatarSrc(message.avatar[0])" class="avatar" mode="aspectFill"></image>
          <view class="message-content-wrapper">
            <view class="message-content">
              <view class="message-title">{{ message.name }}</view>
              <view class="message-preview">{{ message.preview }}</view>
            </view>
            <view class="message-date">{{ message.date }}</view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
// script部分保持不变
import GroupAvatar from './ChatComponent/GroupAvatar.vue'

export default {
  name: 'Messages',
  components: {
    GroupAvatar
  },
  data() {
    return {
      messages: [
        { id: '1', name: '张宁鹏', avatar: [''], preview: '你好', date: '7月21日', type: 'single' },
        { id: '2', name: '杨尚基', avatar: [''], preview: '[图片]', date: '7月21日', type: 'single' },
        { id: '3', name: '王彦', avatar: [''], preview: '[视频]', date: '7月22日', type: 'single' },
        { 
          id: '4', 
          name: '项目讨论群', 
          avatar: [
            '',
            '',
            '',
            ''
          ], 
          preview: '下周一开会', 
          date: '7月23日', 
          type: 'group' 
        },
      ],
      defaultAvatarPath: '../../static/message/默认头像.png'
    }
  },
  computed: {
    systemMessage() {
      return {
        title: '推送消息',
        preview: '系统版本更新',
        date: this.getCurrentDate(),
        notificationCount: Math.floor(Math.random() * 20) + 1
      }
    },
    totalMessageCount() {
      return this.messages.length + 1
    }
  },
  mounted() {
    uni.$on('switchToMessages', this.handleSwitchToMessages);
  },
  beforeDestroy() {
    uni.$off('switchToMessages', this.handleSwitchToMessages);
  },
  methods: {
    openChat(message) { 
      const chatInfo = {
        id: message.id,
        name: message.name,
        avatar: message.avatar,
        type: message.type
      };
      uni.navigateTo({
        url: '/pages/message/chat',
        success: (res) => {
          res.eventChannel.emit('chatInfo', { chatInfo: chatInfo });
        },
        fail: (err) => {
          console.error('导航到聊天页面失败:', err);
        }
      });
    },
    getCurrentDate() {
      const now = new Date();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      return `${month}月${day}日`;
    },
    handleSwitchToMessages() {
      uni.$emit('updateTabBarActiveTab', 1);
    },
    getAvatarSrc(avatar) {
      return avatar || this.defaultAvatarPath;
    }
  }
}
</script>

<style>
.messages-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
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
  font-size: 18px;
  font-weight: bold;
}

.search-icon {
  font-size: 20px;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
}

.message-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 15px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.system-message {
  background-color: #f0f8ff;
}

.message-icon, .avatar {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  margin-right: 12px;
  flex-shrink: 0;
}

.system-icon {
  background-color: #4285f4;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 24px;
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff3b30;
  color: #fff;
  font-size: 12px;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
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
  gap: 4px;
}

.message-title {
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.message-preview {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.message-date {
  font-size: 12px;
  color: #999;
  margin-left: 15px;
  flex-shrink: 0;
}
</style>