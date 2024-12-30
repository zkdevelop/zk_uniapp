<!-- ConfirmModal.vue - 确认对话框组件 -->
<template>
  <view class="modal-overlay">
    <view class="modal-content">
      <view class="modal-body">{{ content }}</view>
      <view class="modal-footer">
        <button class="modal-button cancel" @click="$emit('cancel')">取消</button>
        <button class="modal-button confirm" @click="$emit('confirm')">确认</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  emits: ['confirm', 'cancel']
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  width: 80%;
  max-width: 300px;
}

.modal-body {
  padding: 20px;
  text-align: center;
  font-size: 16px;
  color: #333;
}

.modal-footer {
  display: flex;
  border-top: 1px solid #eee;
}

.modal-button {
  flex: 1;
  padding: 10px;
  text-align: center;
  font-size: 16px;
  background-color: transparent;
  border: none;
}

.modal-button.cancel {
  color: #333;
  border-right: 1px solid #eee;
}

.modal-button.confirm {
  color: #FF3B30;
}
</style>

