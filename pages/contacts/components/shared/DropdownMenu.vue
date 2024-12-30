<!-- DropdownMenu.vue - 下拉菜单组件 -->
<template>
  <div class="dropdown-container" v-show="visible">
    <div class="dropdown-menu">
      <div class="dropdown-item" @click="handleGroupChat">
        <image src="/static/message/群聊.png" class="item-icon" mode="aspectFit"></image>
        <text class="item-text">发起群聊</text>
      </div>
     <!-- <div class="dropdown-item" @click="handleAddFriend">
        <image src="/static/message/添加好友.png" class="item-icon" mode="aspectFit"></image>
        <text class="item-text">添加朋友</text>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropdownMenu',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['group-chat', 'add-friend'],
  setup(props, { emit }) {
    const handleGroupChat = () => {
      emit('group-chat')
    }

    const handleAddFriend = () => {
      emit('add-friend')
    }

    return {
      handleGroupChat,
      handleAddFriend
    }
  }
}
</script>

<style scoped>
.dropdown-container {
  position: fixed;
  top: 0;
  right: 0;
  margin-top: calc(var(--status-bar-height) + 44px);
  z-index: 9999;
}

.dropdown-menu {
  background-color: #464646;
  border-radius: 4px;
  margin-right: 10px;
  padding: 8px 0;
  width: 160px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

.item-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}

.item-text {
  color: #ffffff;
  font-size: 16px;
}
</style>

