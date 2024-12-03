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
      required: true
    }
  },
  emits: ['update:modelValue', 'send'],
  methods: {
    // 更新输入值
    updateValue(event) {
      this.$emit('update:modelValue', event.target.value)
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
  margin-left: 10px;
  margin-right:10px
  
}
</style>