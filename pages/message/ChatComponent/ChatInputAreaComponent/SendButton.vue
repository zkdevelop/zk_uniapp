<!-- SendButton.vue - 发送按钮组件，用于发送消息 -->
<template>
  <view class="send-button" @click="sendMessage">
    <text class="send-text">发送</text>
  </view>
</template>

<script>
export default {
  name: 'SendButton',
  emits: ['click'],
  methods: {
    sendMessage() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.send-button {
  min-width: 56px;
  height: 36px;
  background-color: #4080FF;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
}

.send-text {
  color: #FFFFFF;
  font-size: 14px;
}
</style>