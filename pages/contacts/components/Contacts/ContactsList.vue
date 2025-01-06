<!-- GroupChatList.vue - 群聊列表组件 -->
<template>
  <view class="group-chat-list">
    <view v-for="group in groupList" :key="group.id" class="group-item">
      <!-- 群聊主项 -->
      <view class="group-main" @click="enterGroupChat(group)">
        <text class="group-name">{{ group.groupName }}</text>
        <text class="expand-icon" @click.stop="toggleGroup(group)">{{ group.expanded ? '▼' : '▶' }}</text>
      </view>
      <!-- 群成员列表 -->
      <view v-if="group.expanded" class="group-members">
        <view v-for="member in group.groupMembers" :key="member.userId" class="member-item" @click="enterPrivateChat(member)">
          <text class="member-name">{{ member.userName }}</text>
          <!-- 在线状态指示器 -->
          <view :class="['status-indicator', member.status ? 'online' : 'offline']"></view>
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
    // 处理后的群聊列表，添加了expanded属性用于控制成员列表的展开/收起
    const groupList = ref(props.groupVOList.map(group => ({
      ...group,
      expanded: false // 初始状态为收起
    })))

    // 切换群组展开/收起状态
    const toggleGroup = (group) => {
      group.expanded = !group.expanded
    }

    // 进入群聊
    const enterGroupChat = (group) => {
      emit('enter-group-chat', group)
    }

    // 进入私聊
    const enterPrivateChat = (member) => {
      emit('enter-private-chat', member)
    }

    return {
      groupList,
      toggleGroup,
      enterGroupChat,
      enterPrivateChat
    }
  }
}
</script>

<style scoped>
.group-chat-list {
  padding: 10px;
}

.group-item {
  margin-bottom: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.group-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background-color: #f0f0f0;
}

.group-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.expand-icon {
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.group-members {
  background-color: #ffffff;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.member-name {
  font-size: 14px;
  color: #333;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.online {
  background-color: #4CAF50;
}

.offline {
  background-color: #9E9E9E;
}
</style>

