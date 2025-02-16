<!-- ToggleVoiceButton.vue - 切换语音/键盘输入按钮组件 -->
<template>
  <image
    @click="$emit('toggle-voice-input')"
    :src="getButtonImage()"
    class="toggle-button"
  />
</template>

<script>
export default {
  name: "ToggleVoiceButton",
  props: {
    isVoiceInputActive: {
      type: Boolean,
      required: true,
    },
    isBurnAfterReadingMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["toggle-voice-input"],
  methods: {
    getButtonImage() {
      if (this.isBurnAfterReadingMode) {
        return this.isVoiceInputActive
          ? "/static/message/fire-keyborad.png"
          : "/static/message/fire-voice.png";
      } else {
        return this.isVoiceInputActive
          ? "/static/message/keyboard.png"
          : "/static/message/voice.png";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.toggle-button {
  width: 28px;
  height: 28px;
  margin-right: 10px;
}
</style>
