<!-- MessageItem.vue - 消息项组件，用于显示单个聊天消息 -->
<template>
  <view 
    class="message-item"
    :class="{ 'personal-chat': !message.group }"
    @click="$emit('click', message)"
  >
    <view class="avatar-container">
      <!-- 根据消息类型显示群组头像或个人头像 -->
      <group-avatar v-if="message.group" :avatar="message.avatar" class="avatar" />
      <image v-else :src="getAvatarSrc(message.avatar)" class="avatar" mode="aspectFill"></image>
      <!-- 显示未读消息数量 -->
      <view v-if="message.unreadCount > 0" class="avatar-badge">{{ message.unreadCount }}</view>
    </view>
    <view class="message-content-wrapper">
      <view class="message-content">
        <view class="message-title">{{ message.name || message.userName }}</view>
        <view class="message-preview">{{ message.preview || message.latestMessage }}</view>
      </view>
      <view class="message-date">{{ formatDate(message.date || message.sendTime) }}</view>
    </view>
  </view>
</template>

<script>
import GroupAvatar from './GroupAvatar.vue'
import { getAvatarSrc } from '../MainComposables/messageUtils'
import { formatDate } from '../MainComposables/dateUtils'

export default {
  name: 'MessageItem',
  components: {
    GroupAvatar
  },
  // 定义组件的属性
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  setup() {
    // 返回模板中使用的方法
    return {
      getAvatarSrc,
      formatDate
    }
  }
}
</script>

<style scoped>
.message-item {
  display: flex;
  align-items: flex-start;
  padding: 15px 15px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.avatar-container {
  position: relative;
  width: 54px;
  height: 54px;
  margin-right: 10px;
}

.avatar {
  width: 54px;
  height: 54px;
  border-radius: 5px;
  flex-shrink: 0;
}

.avatar-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 10px;
  padding: 1px 4px;
  min-width: 16px;
  height: 16px;
  background-color: #ff3b30;
  color: #fff;
  border-radius: 8px;
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

.personal-chat .avatar-container,
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
</style>

