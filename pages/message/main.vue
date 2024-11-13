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
          :class="{ 'personal-chat': message.type === 'single' }"
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
          <view v-if="message.unreadCount > 0" class="unread-badge">{{ message.unreadCount }}</view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import GroupAvatar from './ChatComponent/GroupAvatar.vue'
import { searchUsers  } from '@/utils/api/contacts.js'
import {  getChatList } from '@/utils/api/message.js'

export default {
  name: 'Messages',
  components: {
    GroupAvatar
  },
  data() {
    return {
      messages: [
        {
          id: '1',
          name: '张三',
          avatar: ['/static/avatar/avatar1.png'],
          preview: '你好，最近怎么样？',
          date: '7月25日',
          type: 'single',
          unreadCount: 2
        },
        {
          id: '2',
          name: '项目讨论群',
          avatar: ['/static/avatar/group1.png', '/static/avatar/group2.png', '/static/avatar/group3.png'],
          preview: '下周一开会，请大家准时参加',
          date: '7月24日',
          type: 'group',
          unreadCount: 5
        }
      ],
      defaultAvatarPath: '../../static/message/默认头像.png',
      scrollViewHeight: 0,
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
      const totalUnread = this.messages.reduce((sum, message) => sum + (message.unreadCount || 0), 0);
      return this.messages.length + totalUnread;
    }
  },
  mounted() {
    this.calculateScrollViewHeight();
    uni.$on('switchToMessages', this.handleSwitchToMessages);
    this.fetchChatList();
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
    },
    calculateScrollViewHeight() {
      const systemInfo = uni.getSystemInfoSync();
      const headerHeight = 44; // 消息头部的大致高度
      const tabBarHeight = 50; // 底部标签栏的大致高度，如果有的话
      this.scrollViewHeight = systemInfo.windowHeight - headerHeight - tabBarHeight;
    },
    async fetchChatList() {
      console.log('使用写死的聊天数据');
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}月${day}日`;
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
  text-align: center;
}

@media screen and (max-width: 375px) {
  .message-item {
    padding: 12px 12px;
  }

  .message-icon, .avatar {
    width: 48px;
    height: 48px;
    margin-right: 8px;
  }

  .message-title {
    font-size: 13px;
  }

  .message-preview {
    font-size: 11px;
  }

  .message-date {
    font-size: 10px;
    margin-left: 8px;
  }

  .personal-chat {
    padding: 9px 12px;
  }

  .personal-chat .message-icon,
  .personal-chat .avatar {
    width: 42px;
    height: 42px;
  }
}
</style>