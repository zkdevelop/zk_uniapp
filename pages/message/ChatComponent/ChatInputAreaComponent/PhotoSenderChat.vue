<template>
  <view class="photo-sender-chat">
    <!-- 聊天输入区域组件 -->
    <ChatInputArea
      :showAttachMenu="showAttachMenu"
      :recipientId="recipientId"
      :missionId="missionId"
      @send-message="onSendMessage"
      @message-sent="onMessageSent"
      @message-failed="onMessageFailed"
      @toggle-attach-menu="toggleAttachMenu"
      @attach="handleAttachment"
    />
  </view>
</template>

<script>
// 导入所需的组件和工具函数
import ChatInputArea from './ChatInputArea.vue'
// import { sendFilesToUser } from '@/utils/api/message.js'
import { sendMessageToUser } from '@/utils/api/message.js'
import { getCurrentCoordinates } from '@/utils/locationUtils'

export default {
  name: 'PhotoSenderChat',
  components: {
    ChatInputArea
  },
  props: {
    // 接收者ID，从父组件传入
    recipientId: {
      type: String,
      required: true
    },
    // 任务ID，从父组件（chat.vue）传入
    missionId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showAttachMenu: false, // 控制附件菜单的显示状态
      chatType: 'single' // 默认为单聊，需要在接收到聊天信息时更新
    }
  },
  methods: {
    // 处理发送消息
    onSendMessage(message) {
      console.log('发送消息:', message)
      // 这里可以添加发送消息的逻辑
    },
    // 处理消息发送成功
    onMessageSent(message) {
      console.log('消息发送成功:', message)
      // 这里可以添加消息发送成功后的处理逻辑
    },
    // 处理消息发送失败
    onMessageFailed(message) {
      console.error('消息发送失败:', message)
      // 这里可以添加消息发送失败后的处理逻辑
    },
    // 切换附件菜单的显示状态
    toggleAttachMenu(show) {
      this.showAttachMenu = show
    },
    // 处理附件选择
    handleAttachment(action, data) {
      if (action === 'album') {
        this.chooseAndSendPhoto()
      } else {
        // 处理其他类型的附件
        console.log('附件操作:', action, data)
      }
    },
    // 选择并发送照片
    async chooseAndSendPhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0]
          try {
            const response = await sendMessageToUser({
              recipientId: this.recipientId,
              content: tempFilePath,
              messageType: 'IMAGE',
              missionId: this.missionId
            })
            if (response.code === 200) {
              this.$emit('photo-sent', {
                type: 'image',
                content: tempFilePath,
                missionId: this.missionId
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
        fail: (error) => {
          console.error('选择图片失败:', error)
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          })
        }
      })
    },
    // 更新聊天类型
    updateChatType(type) {
      this.chatType = type
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