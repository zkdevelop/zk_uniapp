<template>
  <view class="chat-header">
    <!-- 返回按钮 -->
    <text class="back-button"   @click="$emit('goBack')">&#8592;</text>
    <!-- 聊天标题容器 -->
    <view class="chat-title-container">
      <!-- 群聊头像 -->
      <group-avatar v-if="chatInfo.type === 'group'" :avatar="chatInfo.avatar" />
      <!-- 单聊头像 -->
      <image v-else :src="chatInfo.avatar[0]" class="avatar" mode="aspectFill"></image>
      <!-- 聊天标题 -->
      <text class="chat-title">{{ chatInfo.name }}</text>
    </view>
    <!-- 菜单按钮 -->
    <text class="menu-button">...</text>
  </view>
</template>

<script>
import GroupAvatar from './GroupAvatar.vue'

export default {
  name: 'ChatHeader',
  components: {
    GroupAvatar
  },
  props: {
    // chatInfo: 聊天信息对象，包含聊天的基本信息
    chatInfo: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #12b7f5;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.chat-title-container {
  display: flex;
  align-items: center;
}

.chat-title-container .avatar,
.chat-title-container .avatar-wrap {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  margin-right: 10px;
}

.back-button, .menu-button {
  font-size: 20px;
  color: #fff;
}

.chat-title {
  font-size: 18px;
  font-weight: bold;
}
</style>