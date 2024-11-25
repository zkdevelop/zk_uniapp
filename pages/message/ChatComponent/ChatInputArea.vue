<template>
  <view class="chat-input-area">
    <!-- 聊天输入框和附加功能按钮 -->
    <view class="chat-input" :class="{ 'elevated': showAttachMenu }">
      <!-- 语音输入按钮 -->
      <view class="voice-button" @click="toggleVoiceInput">
        <image :src="isVoiceInputActive ? '/static/message/键盘输入.png' : '/static/message/语音输入.png'" class="voice-icon" />
      </view>
      
      <!-- 文本输入框 -->
      <input 
        v-if="!isVoiceInputActive"
        type="text" 
        class="text-input" 
        placeholder="输入消息..." 
        v-model="newMessage" 
        @confirm="sendMessage" 
        ref="messageInput"
      />
      
      <!-- 语音输入按钮 -->
      <view v-else class="voice-input-button" @touchstart="startVoiceRecord" @touchend="stopVoiceRecord">
        按住说话
      </view>
      
      <!-- 附加功能按钮（当附加菜单未显示时） -->
      <text v-if="!showAttachMenu" class="attach-button" @click="toggleAttachMenu">+</text>
      
      <!-- 发送按钮（当附加菜单显示时或有文本输入时） -->
      <text v-if="showAttachMenu || newMessage.trim().length > 0" class="send-button" @click="sendMessage">发送</text>
    </view>

    <!-- 附加功能菜单 -->
    <attachment-menu 
      v-if="showAttachMenu" 
      @attach="attachItem"
      @file-selected="handleFileSelected"
      @close="closeAttachMenu"
    >
      <template v-slot:album>
        <view @click="chooseAndSendPhoto">从相册选择</view>
      </template>
      <template v-slot:camera>
        <view @click="takePhoto">拍摄</view>
      </template>
      <template v-slot:video-call>
        <view @click="startVideoCall">视频通话</view>
      </template>
      <template v-slot:location>
        <view @click="openLocationSharing">发送位置</view>
      </template>
    </attachment-menu>

    <!-- 位置共享组件 -->
    <location-sharing 
      v-if="showLocationSharing"
      :recipientId="recipientId"
      :missionId="missionId"
      @location-selected="handleLocationSelected"
      @close="closeLocationSharing"
    />

    <!-- 文件传输组件 -->
    <file-transfer ref="fileTransfer" @file-selected="handleFileSelected" />
  </view>
</template>

<script>
import AttachmentMenu from './ChatInputAreaComponent/AttachmentMenu.vue'
import FileTransfer from './ChatInputAreaComponent/FileTransfer.vue'
import LocationSharing from './ChatInputAreaComponent/LocationSharing.vue'
import { sendFilesToUser } from '@/utils/api/message.js'
import { getCurrentCoordinates } from '@/utils/locationUtils'

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
    },
    missionId: {
      type: String,
      required: true,
      default: ''
    }
  },
  emits: ['send-message', 'toggle-attach-menu', 'attach', 'video-call', 'message-sent'],
  data() {
    return {
      newMessage: '',
      showLocationSharing: false,
      _selfAvatar: '/static/avatar/avatar5.jpeg',
      isVoiceInputActive: false,
      isRecording: false,
      fileName: '',
      fileType: null
    }
  },
  created() {
    console.log('ChatInputArea 接收到的 missionId:', this.missionId);
  },
  watch: {
    recipientId(newVal) {
      if (!newVal) {
        this.showLocationSharing = false;
      }
    }
  },
  methods: {
    async sendMessage() {
      console.log('sendMessage 方法被调用');
      
      if (typeof this.newMessage !== 'string' || !this.newMessage.trim()) {
        console.log('消息为空或不是字符串，不发送');
        return;
      }

      const messageData = {
        content: this.newMessage,
        type: 'text',
        recipientId: this.recipientId,
        missionId: this.missionId
      };
      
      console.log('准备发送消息:', messageData);
      
      this.$emit('send-message', messageData);
      
      this.newMessage = ''; 
    },
    toggleAttachMenu() {
      console.log('切换附件菜单');
      this.$emit('toggle-attach-menu', !this.showAttachMenu);
    },
    closeAttachMenu() {
      console.log('关闭附件菜单');
      this.$emit('toggle-attach-menu', false);
    },
    attachItem(action, data) {
      console.log('附件项被选择:', action);
      if (action === 'file') {
        if (data) {
          this.handleFileSelected(data);
        } else {
          this.$refs.fileTransfer.chooseFile();
        }
      } else if (action === 'burn-after-reading') {
        this.chooseBurnAfterReadingImage();
      } else if (action === 'camera') {
        this.takePhoto();
      } else if (action === 'album') {
        this.chooseAndSendPhoto();
      } else if (action === 'location') {
        this.openLocationSharing();
      } else if (action === 'video-call') {
        this.$emit('video-call', action);
      } else {
        this.$emit('attach', action);
      }
      if (action !== 'location') {
        this.closeAttachMenu();
      }
    },
    handleFileSelected(fileData) {
      console.log('文件被选择:', fileData);
      this.fileName = fileData.path.split('/').pop();
      this.chooseAndSendPhoto(fileData.path);
    },
    chooseBurnAfterReadingImage() {
      console.log('选择阅后即焚图片');
      uni.chooseImage({
        count: 1,
        success: (res) => {
          const image = res.tempFilePaths[0];
          this.applyMosaicEffect(image, (mosaicImage) => {
            this.$emit('attach', 'burn-after-reading', {
              originalPath: image,
              mosaicPath: mosaicImage,
              duration: 5,
              missionId: this.missionId
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
      console.log('拍摄照片');
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          this.$emit('message-sent', {
            type: 'image',
            content: tempFilePath,
            missionId: this.missionId
          });
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
    async chooseAndSendPhoto(filePath = null) {
      console.log('chooseAndSendPhoto 方法被调用');
      console.log('当前 missionId:', this.missionId);
      console.log('当前 recipientId:', this.recipientId);
      console.log('开始选择并发送照片或文件');
      try {
        let tempFilePath = filePath;
        if (!tempFilePath) {
          console.log('获取文件信息...');
          const fileRes = await new Promise((resolve, reject) => {
            uni.chooseFile({
              count: 1,
              success: (res) => {
                console.log('文件选择成功:', JSON.stringify(res));
                resolve(res);
              },
              fail: (err) => {
                console.error('文件选择失败:', err);
                reject(err);
              }
            });
          });
          tempFilePath = fileRes.tempFiles[0].path;
          this.fileName = fileRes.tempFiles[0].name || tempFilePath.split('/').pop();
        } else {
          this.fileName = tempFilePath.split('/').pop();
        }
        
        // 确定文件类型
        const fileExtension = this.fileName.split('.').pop().toLowerCase();
        this.fileType = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension) ? 'image' : 'file';

        console.log('选择的文件名:', this.fileName);
        console.log('文件类型:', this.fileType);

        console.log('开始获取位置信息...');
        let locationRes = { latitude: '0', longitude: '0' };
        try {
          const coordinates = await getCurrentCoordinates();
          console.log('获取到的位置信息:', JSON.stringify(coordinates));
          locationRes = {
            latitude: coordinates.latitude.toString(),
            longitude: coordinates.longitude.toString()
          };
        } catch (error) {
          console.error('获取位置信息失败，使用默认值:', error);
        }

        console.log('位置信息处理完成');
        console.log('选择的文件路径:', tempFilePath);

        console.log('准备上传文件...');
        const sendData = {
          files: [tempFilePath],
          isGroup: false,
          isSelfDestruct: false,
          latitude: locationRes.latitude,
          longitude: locationRes.longitude,
          missionId: this.missionId,
          receptionId: this.recipientId
        };
        console.log('准备调用 sendFilesToUser，参数:', JSON.stringify(sendData));

        try {
          const response = await sendFilesToUser(sendData);
          console.log('sendFilesToUser 调用完成，响应:', JSON.stringify(response));
          console.log('sendFilesToUser 响应数据:', JSON.stringify(response.data));

          console.log('API返回的完整响应:', JSON.stringify(response));
          console.log('API返回的message字段:', response.data.message);

          if (response.code === 200) {
            console.log('文件发送成功，触发message-sent事件');

            this.$emit('message-sent', {
              type: this.fileType,
              content: this.fileType === 'image' ? tempFilePath : response.data.message,
              recipientId: this.recipientId,
              missionId: this.missionId
            });
            this.closeAttachMenu();
          } else {
            throw new Error(response.msg || '发送文件消息失败');
          }
        } catch (error) {
          console.error('发送文件消息出错:', error);
          console.error('错误详情:', error.message);
          uni.showToast({
            title: '发送失败，请重试',
            icon: 'none'
          });
        }

      } catch (error) {
        console.error('选择或发送文件时出错:', error);
        console.error('错误详情:', error.message);
        uni.showToast({
          title: '发送失败，请重试',
          icon: 'none'
        });
      }
    },
    openLocationSharing() {
      console.log('打开位置分享');
      this.showLocationSharing = true;
      this.closeAttachMenu();
    },
    closeLocationSharing() {
      console.log('关闭位置分享');
      this.showLocationSharing = false;
    },
    handleLocationSelected(location) {
      console.log('位置被选择:', JSON.stringify(location));
      this.$emit('send-message', {
        type: 'location',
        content: location,
        missionId: this.missionId
      });
      this.closeLocationSharing();
    },
    startVideoCall() {
      console.log('开始视频通话');
      this.$emit('video-call');
    },
    toggleVoiceInput() {
      this.isVoiceInputActive = !this.isVoiceInputActive;
    },
    startVoiceRecord() {
      console.log('开始录音');
      this.isRecording = true;
      uni.startRecord({
        success: () => {
          console.log('录音开始');
        },
        fail: (err) => {
          console.error('录音开始失败:', err);
          uni.showToast({
            title: '录音开始失败',
            icon: 'none'
          });
        }
      });
    },
    stopVoiceRecord() {
      console.log('停止录音');
      this.isRecording = false;
      uni.stopRecord({
        success: (res) => {
          console.log('录音结束，文件路径:', res.tempFilePath);
          this.$emit('send-message', {
            type: 'voice',
            content: res.tempFilePath,
            recipientId: this.recipientId,
            missionId: this.missionId
          });
        },
        fail: (err) => {
          console.error('录音结束失败:', err);
          uni.showToast({
            title: '录音结束失败',
            icon: 'none'
          });
        }
      });
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

.voice-input-button {
  flex: 1;
  height: 36px;
  line-height: 36px;
  text-align: center;
  background-color: #FFFFFF;
  border: 1px solid #e0e0e0;
  border-radius: 18px;
  margin-right: 10px;
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