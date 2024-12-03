<!-- AttachButton.vue - 附件按钮组件，用于打开附件菜单 -->
<template>
  <view class="attach-button" @click="$emit('click')">
    <image 
      src="/static/message/展开对话工具.png" 
      class="attach-icon"
    />
  </view>
</template>

<script>
export default {
  name: 'AttachButton',
  emits: ['click']
}
</script>

<style scoped>
.attach-button {
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 11px;
}

.attach-icon {
  width: 24px;
  height: 24px;
}
</style>