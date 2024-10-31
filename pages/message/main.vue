<template>
  <view class="messages-container">
    <view v-if="!showChat" class="messages-view">
      <view class="messages-header">
        <text class="header-title">消息(14)</text>
        <view class="search-icon">
          <text>🔍</text>
        </view>
      </view>
      
      <scroll-view class="messages-list" scroll-y>
        <view class="message-item system-message">
          <view class="message-icon system-icon">
            <text>📢</text>
            <view class="notification-badge">13</view>
          </view>
          <view class="message-content">
            <view class="message-title">推送消息</view>
            <view class="message-preview">系统版本更新</view>
          </view>
          <view class="message-date">7月21日</view>
        </view>
        
        <view 
          v-for="(message, index) in messages" 
          :key="index" 
          class="message-item"
          @click="openChat(message)"
        >
          <group-avatar v-if="message.type === 'group'" :avatar="message.avatar" />
          <image v-else :src="message.avatar[0]" class="avatar" mode="aspectFill"></image>
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

    <chat v-else :chatInfo="selectedChat" @goBack="showChat = false"></chat>
  </view>
</template>

<script>
// 导入所需的组件
import Chat from './Chat.vue'
import GroupAvatar from './ChatComponent/GroupAvatar.vue'

export default {
  name: 'Messages',
  components: {
    Chat,
    GroupAvatar
  },
  // 组件数据
  data() {
    return {
      // 消息列表数据
      messages: [
        { id: '1', name: '张宁鹏', avatar: ['../../static/c1.png'], preview: '你好', date: '7月21日', type: 'single' },
        { id: '2', name: '杨尚基', avatar: ['../../static/c2.png'], preview: '[图片]', date: '7月21日', type: 'single' },
        { id: '3', name: '王彦', avatar: ['../../static/c3.png'], preview: '[视频]', date: '7月22日', type: 'single' },
        { id: '4', name: '项目讨论群', avatar: ['../../static/c1.png', '../../static/c2.png', '../../static/c3.png', '../../static/c1.png'], preview: '下周一开会', date: '7月23日', type: 'group' },
      ],
      showChat: false, // 控制是否显示聊天界面
      selectedChat: null // 当前选中的聊天
    }
  },
  // 组件方法
  methods: {
    // 打开聊天界面
    openChat(message) { 
      // 设置选中的聊天信息
      this.selectedChat = {
        id: message.id,
        name: message.name,
        avatar: message.avatar,
        type: message.type
      };
      this.showChat = true; // 显示聊天界面
      console.log('打开聊天', this.selectedChat);
    }
  }
}
</script>

<style>
/* 消息列表样式 */
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
  padding: 15px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.system-message {
  background-color: #f0f8ff;
}

.message-icon, .avatar, .avatar-wrap {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  margin-right: 15px;
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
  align-items: center;
  min-width: 0;
}

.message-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.message-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-preview {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-date {
  font-size: 12px;
  color: #999;
  margin-left: 15px;
  flex-shrink: 0;
  align-self: flex-start;
}

.messages-container > * {
  transition: opacity 0.3s ease-in-out;
}

.messages-container > *:not(:first-child) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.messages-container > *:not(:first-child):not([style*="display: none"]) {
  opacity: 1;
}

.messages-container > *:not(:first-child)[style*="display: none"] {
  opacity: 0;
}
</style>