<template>
  <view class="photo-sender-chat">
    <ChatInputArea
      :showAttachMenu="showAttachMenu"
      :recipientId="recipientId"
      @send-message="onSendMessage"
      @message-sent="onMessageSent"
      @message-failed="onMessageFailed"
      @toggle-attach-menu="toggleAttachMenu"
      @attach="handleAttachment"
    />
  </view>
</template>

<script>
import ChatInputArea from './ChatInputArea.vue'
import { sendMessageToUser } from '@/utils/api/message.js'

export default {
  name: 'PhotoSenderChat',
  components: {
    ChatInputArea
  },
  props: {
    recipientId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showAttachMenu: false
    }
  },
  methods: {
    onSendMessage(message) {
      // 处理发送消息
      console.log('Sending message:', message)
    },
    onMessageSent(message) {
      // 处理消息发送成功
      console.log('Message sent successfully:', message)
    },
    onMessageFailed(message) {
      // 处理消息发送失败
      console.error('Failed to send message:', message)
    },
    toggleAttachMenu(show) {
      this.showAttachMenu = show
    },
    handleAttachment(action, data) {
      if (action === 'album') {
        this.chooseAndSendPhoto()
      } else {
        // 处理其他类型的附件
        console.log('Attachment action:', action, data)
      }
    },
    chooseAndSendPhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0]
          try {
            const response = await sendMessageToUser({
              recipientId: this.recipientId,
              content: tempFilePath,
              messageType: 'IMAGE'
            })
            if (response.code === 200) {
              this.$emit('photo-sent', {
                type: 'image',
                content: tempFilePath
              })
            } else {
              console.error('发送图片消息失败:', response.msg)
              uni.showToast({
                title: '发送失败，请重试',
                icon: 'none'
              })
            }
          } catch (error) {
            console.error('发送图片消息出错:', error)
            uni.showToast({
              title: '发送失败，请重试',
              icon: 'none'
            })
          }
        },
        fail: (err) => {
          console.error('选择图片失败:', err)
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.photo-sender-chat {
  width: 100%;
  height: 100%;
}
</style>