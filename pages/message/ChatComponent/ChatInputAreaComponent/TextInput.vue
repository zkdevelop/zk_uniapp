<!-- TextInput.vue - 文本输入组件，用于用户输入聊天消息 -->
<template>
  <input 
    type="text" 
    class="text-input" 
    placeholder="输入消息..." 
    :value="modelValue"
    @input="updateValue"
    @confirm="sendMessage" 
  />
</template>

<script>
export default {
  name: 'TextInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'send'],
  methods: {
    // 更新输入值
    updateValue(event) {
      // 兼容处理不同平台的事件对象
      const value = event.detail!=undefined ? event.detail.value : event.target.value;
	  console.log(event.detail,'value')
      // 确保始终发送一个字符串值，即使是空字符串
      this.$emit('update:modelValue', value || '');
    },
    // 发送消息
    sendMessage() {
      this.$emit('send')
    }
  }
}
</script>

<style scoped>
.text-input {
  flex: 1;
  height: 36px;
  background-color: #FFFFFF;
  border-radius: 18px;
  padding: 0 15px;
  font-size: 14px;
  border: 1px solid #e0e0e0;
  outline: none;
}

.text-input:focus {
  border-color: #007AFF;
}
</style>