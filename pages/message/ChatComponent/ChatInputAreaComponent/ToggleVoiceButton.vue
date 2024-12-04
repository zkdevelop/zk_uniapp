<template>
  <image 
    @click="$emit('toggle-voice-input')"
    :src="isVoiceInputActive ? '/static/message/键盘.png' : '/static/message/语音.png'"
    class="toggle-button"
  />
</template>

<script>
export default {
  name: 'ToggleVoiceButton',
  props: {
    isVoiceInputActive: {
      type: Boolean,
      required: true
    }
  },
  emits: ['toggle-voice-input']
}
</script>

<style lang="scss" scoped>
.toggle-button {
  width: 28px;
  height: 28px;
  margin-right: 10px;
}
</style>