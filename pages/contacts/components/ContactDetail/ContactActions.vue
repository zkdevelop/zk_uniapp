<!-- ContactActions.vue - 联系人操作按钮组件 -->
<template>
  <view>
    <view class="remark-section">
      <view class="action-item" @click="$emit('handle-remark')">
        <text class="action-text">备注</text>
        <text class="icon">›</text>
      </view>
    </view>

    <view class="message-button" @click="$emit('handle-message')">
      <text class="button-text">发信息</text>
    </view>

    <view class="clear-history" @click="$emit('handle-clear-history')">
      <text class="button-text">清空聊天记录</text>
    </view>

    <view class="delete-contact" @click="$emit('handle-delete')">
      <text class="button-text">删除联系人</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ContactActions',
  emits: ['handle-remark', 'handle-message', 'handle-clear-history', 'handle-delete']
}
</script>

<style scoped>
.remark-section {
  background-color: #fff;
  margin-bottom: 8px;
}

.action-item {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-text {
  font-size: 16px;
  color: #333;
}

.icon {
  font-size: 24px;
  color: #999;
}

.message-button, .clear-history, .delete-contact {
  background-color: #fff;
  padding: 12px 0;
  text-align: center;
  margin-bottom: 1px;
}

.button-text {
  font-size: 16px;
}

.message-button .button-text {
  color: #333;
}

.clear-history .button-text {
  color: #007AFF;
}

.delete-contact.delete-contact .button-text {
  color: #ff3b30;
}
</style>

