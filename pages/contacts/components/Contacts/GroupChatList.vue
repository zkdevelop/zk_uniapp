<!-- GroupChatList.vue - 群聊列表组件 -->
<template>
  <view class="group-chat-list">
    <view class="group">
      <view class="group-header" @click="toggleGroup">
        <text class="group-title">群聊 ({{ groupList.length }}个)</text>
        <text class="group-arrow" :class="{ 'expanded': expanded }">›</text>
      </view>
      <view 
        class="group-content" 
        :class="{ 'expanded': expanded }"
      >
        <view v-for="group in groupList" :key="group.id" class="contact-item" @click="enterGroupChat(group)">
          <image :src="group.avatar || '/static/default-group-avatar.png'" class="avatar" mode="aspectFill" />
          <view class="contact-info">
            <text class="contact-name">{{ group.groupName }}</text>
            <text class="contact-title">{{ group.groupMembers.length }}人</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'GroupChatList',
  props: {
    // 群聊列表数据
    groupVOList: {
      type: Array,
      required: true
    }
  },
  setup(props, { emit }) {
    // 处理后的群聊列表
    const groupList = ref(props.groupVOList)

    // 群聊列表展开状态
    const expanded = ref(true)

    // 切换群组展开/收起状态
    const toggleGroup = () => {
      expanded.value = !expanded.value
    }

    // 进入群聊
    const enterGroupChat = (group) => {
      emit('enter-group-chat', group)
    }

    return {
      groupList,
      expanded,
      toggleGroup,
      enterGroupChat
    }
  }
}
</script>

<style scoped>
.group-chat-list {
  background-color: #f5f5f5;
  padding: 10px;
}

.group {
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 4px;
  overflow: hidden;
}

.group-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  background-color: #fafafa;
}

.group-title {
  font-size: 16px;
  color: #333;
}

.group-arrow {
  font-size: 20px;
  color: #999;
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}

.group-arrow.expanded {
  transform: rotate(-90deg);
}

.group-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.group-content.expanded {
  max-height: 1000px;
}

.contact-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}

.contact-info {
  flex: 1;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
}

.contact-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.2;
}

.contact-title {
  font-size: 14px;
  color: #999;
  line-height: 1.2;
}
</style>

