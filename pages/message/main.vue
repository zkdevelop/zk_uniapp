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
        { id: '5', name: '测试用户1', avatar: [''], preview: '这是一条测试消息', date: '7月24日', type: 'single' },
        { id: '6', name: '测试用户2', avatar: [''], preview: '这是另一条测试消息', date: '7月24日', type: 'single' },
        { id: '7', name: '测试用户3', avatar: [''], preview: '这是第三条测试消息', date: '7月24日', type: 'single' },
        { id: '8', name: '测试用户4', avatar: [''], preview: '这是第四条测试消息', date: '7月24日', type: 'single' },
        { id: '9', name: '测试用户5', avatar: [''], preview: '这是第五条测试消息', date: '7月24日', type: 'single' },
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
      return this.messages.length + 1
    }
  },
  mounted() {
    this.calculateScrollViewHeight();
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
    },
    calculateScrollViewHeight() {
      const systemInfo = uni.getSystemInfoSync();
      const headerHeight = 44; // 消息头部的大致高度
      const tabBarHeight = 50; // 底部标签栏的大致高度，如果有的话
      this.scrollViewHeight = systemInfo.windowHeight - headerHeight - tabBarHeight;
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
  overflow: hidden; /* 防止整个容器出现滚动条 */
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
  -webkit-overflow-scrolling: touch; /* 为iOS提供平滑滚动 */
}

.message-item {
  display: flex;
  align-items: flex-start;
  padding: 15px 15px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
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