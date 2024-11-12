<!-- EnhancedChatInput.vue -->
<template>
  <view class="enhanced-chat-input">
    <ChatInputArea 
      @send-message="sendMessage" 
      @attach="handleAttachment"
      @toggle-attach-menu="toggleAttachMenu"
      :show-attach-menu="showAttachMenu"
      ref="chatInputAreaRef"
    />
  </view>
</template>

<script>
import ChatInputArea from './ChatInputArea.vue'

export default {
  name: 'EnhancedChatInput',
  components: {
    ChatInputArea
  },
  data() {
    return {
      showAttachMenu: false
    }
  },
  methods: {
    sendMessage(message) {
      this.$emit('send-message', message)
    },
    toggleAttachMenu(show) {
      this.showAttachMenu = show
    },
    handleAttachment(type, data) {
      if (type === 'camera') {
        this.takePhoto()
      } else {
        this.$emit('attach', type, data)
      }
    },
    takePhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0]
          this.sendPhoto(tempFilePath)
        },
        fail: (err) => {
          console.error('拍照失败:', err)
          uni.showToast({
            title: '拍照失败',
            icon: 'none'
          })
        }
      })
    },
    sendPhoto(filePath) {
      // 发送图片消息
      this.$emit('send-message', {
        type: 'image',
        content: filePath
      })
    }
  }
}
</script>

 