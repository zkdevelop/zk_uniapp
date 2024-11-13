<template>
  <view class="chat-input-area">
    <view class="chat-input" :class="{ 'elevated': showAttachMenu }">
      <view class="voice-button">
        <image src="/static/message/语音输入.png" class="voice-icon" />
      </view>
      
      <input 
        type="text" 
        class="text-input" 
        placeholder="输入消息..." 
        v-model="newMessage" 
        @confirm="sendMessage" 
        ref="messageInput"
      />
      
      <text v-if="!showAttachMenu" class="attach-button" @click="toggleAttachMenu">+</text>
      
      <text v-if="showAttachMenu" class="send-button" @click="sendMessage">发送</text>
    </view>

    <attachment-menu 
      v-if="showAttachMenu" 
      @attach="attachItem"
      @close="closeAttachMenu"
    >
      <template v-slot:album>
        <!-- 相册功能的自定义内容 -->
      </template>
      <template v-slot:camera>
        <!-- 拍摄功能的自定义内容 -->
      </template>
      <template v-slot:video-call>
        <!-- 视频通话功能的自定义内容 -->
      </template>
    </attachment-menu>

    <location-sharing 
      v-if="showLocationSharing"
      @location-selected="handleLocationSelected"
      @close="closeLocationSharing"
    />

    <file-transfer ref="fileTransfer" @file-selected="handleFileSelected" />
  </view>
</template>

<script>
import AttachmentMenu from './ChatInputAreaComponent/AttachmentMenu.vue'
import FileTransfer from './ChatInputAreaComponent/FileTransfer.vue'
import LocationSharing from './ChatInputAreaComponent/LocationSharing.vue'
import { sendMessageToUser } from '@/utils/api/message.js'

export default {
  name: 'ChatInputArea',
  components: {
    AttachmentMenu,
    FileTransfer,
    LocationSharing
  },
  props: {
    showAttachMenu: {
      type: Boolean,
      default: false
    },
    recipientId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      newMessage: '',
      showLocationSharing: false,
    }
  },
  methods: {
    async sendMessage() {
      if (this.newMessage.trim()) {
        const messageData = {
          message: this.newMessage,
          recipientId: this.recipientId
        };
        
        this.$emit('send-message', {
          content: this.newMessage,
          status: 'sending'
        });
        
        try {
          const response = await sendMessageToUser(messageData);
          if (response.code === 200) {
            this.$emit('message-sent', response.data);
          } else {
            this.$emit('message-failed', this.newMessage);
          }
        } catch (error) {
          console.error('发送消息失败:', error);
          this.$emit('message-failed', this.newMessage);
        }
        
        this.newMessage = '';
      }
    },
    toggleAttachMenu() { 
      this.$emit('toggle-attach-menu', !this.showAttachMenu);
    },
    closeAttachMenu() { 
      this.$emit('toggle-attach-menu', false);
    },
    attachItem(action) { 
      if (action === 'file') {
        this.$refs.fileTransfer.chooseFile();
      } else if (action === 'burn-after-reading') {
        this.chooseBurnAfterReadingImage();
      } else if (action === 'camera') {
        this.takePhoto();
      } else if (action === 'album') {
        this.chooseAndSendPhoto();
      } else if (action === 'location') { 
        this.showLocationSharing = true;
        this.closeAttachMenu();
      } else {
        this.$emit('attach', action);
      }
      if (action !== 'location') {
        this.closeAttachMenu();
      }
    },
    handleFileSelected(fileData) {
      this.$emit('attach', 'file', fileData);
    },
    chooseBurnAfterReadingImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          const image = res.tempFilePaths[0];
          this.applyMosaicEffect(image, (mosaicImage) => {
            this.$emit('attach', 'burn-after-reading', {
              originalPath: image,
              mosaicPath: mosaicImage,
              duration: 5
            });
          });
        },
        fail: (err) => {
          console.error('选择图片失败', err);
        }
      });
    },
    applyMosaicEffect(imagePath, callback) {
      const ctx = uni.createCanvasContext('mosaicCanvas');
      
      ctx.drawImage(imagePath, 0, 0, 300, 300);
      
      ctx.setFillStyle('rgba(0, 0, 0, 0.5)');
      for (let y = 0; y < 300; y += 10) {
        for (let x = 0; x < 300; x += 10) {
          ctx.fillRect(x, y, 10, 10);
        }
      }
      
      ctx.draw(false, () => {
        uni.canvasToTempFilePath({
          canvasId: 'mosaicCanvas',
          success: (res) => {
            callback(res.tempFilePath);
          },
          fail: (err) => {
            console.error('马赛克处理失败', err);
          }
        });
      });
    },
    async takePhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0];
          try {
            const response = await sendMessageToUser({
              recipientId: this.recipientId,
              content: tempFilePath,
              messageType: 'IMAGE'
            });
            if (response.code === 200) {
              this.$emit('send-message', {
                type: 'image',
                content: tempFilePath
              });
            } else {
              console.error('发送图片消息失败:', response.msg);
              uni.showToast({
                title: '发送失败，请重试',
                icon: 'none'
              });
            }
          } catch (error) {
            console.error('发送图片消息出错:', error);
            uni.showToast({
              title: '发送失败，请重试',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('拍照失败:', err);
          uni.showToast({
            title: '拍照失败',
            icon: 'none'
          });
        }
      });
    },
    chooseAndSendPhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0];
          try {
            const response = await sendMessageToUser({
              recipientId: this.recipientId,
              content: tempFilePath,
              messageType: 'IMAGE'
            });
            if (response.code === 200) {
              this.$emit('send-message', {
                type: 'image',
                content: tempFilePath
              });
            } else {
              // console.error('发送图片消息失败:', response.msg);
              uni.showToast({
                title: '发送失败，请重试',
                icon: 'none'
              });
            }
          } catch (error) {
            // console.error('发送图片消息出错:', error);
            uni.showToast({
              title: '发送失败，请重试',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          // console.error('选择图片失败:', err);
          uni.showToast({
            title: '选择图片失败',
            icon: 'none'
          });
        }
      });
    },
    handleLocationSelected(location) { 
      this.sendLocationMessage(location);
      this.closeLocationSharing();
    },
    async sendLocationMessage(location) { 
      try {
        const response = await sendMessageToUser({
          recipientId: this.recipientId,
          content: JSON.stringify(location),
          messageType: 'LOCATION'
        });
        if (response.code === 200) { 
          this.$emit('send-message', {
            type: 'location',
            content: location
          });
        } else { 
          uni.showToast({
            title: '发送失败，请重试',
            icon: 'none'
          });
        }
      } catch (error) { 
        uni.showToast({
          title: '发送失败，请重试',
          icon: 'none'
        });
      }
    },
    closeLocationSharing() { 
      this.showLocationSharing = false;
    }
  },
}
</script>

<style>
.chat-input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #F3F3F3;
  border-top: 1px solid #e0e0e0;
  z-index: 1001;
}

.chat-input.elevated {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.voice-button {
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center; 
  border-radius: 11px;
  margin-right: 10px;
}

.voice-icon {
  width: 24px;
  height: 24px;
}

.attach-button {
  font-size: 24px;
  color: #7f7f7f;
  margin: 0 10px;
}

.text-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 16px;
  background-color: #FFFFFF;
}

.send-button {
  padding: 8px 15px;
  background-color: #4479F0;
  color: #fff;
  border-radius: 18px;
  font-size: 16px;
}
</style>