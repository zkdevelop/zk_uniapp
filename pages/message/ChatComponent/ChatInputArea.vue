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
  </view>
</template>

<script>
import AttachmentMenu from './ChatInputAreaComponent/AttachmentMenu.vue'
import LocationSharing from './ChatInputAreaComponent/LocationSharing.vue'
import { getCurrentCoordinates } from '@/utils/locationUtils'

export default {
  name: 'ChatInputArea',
  components: {
    AttachmentMenu,
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
  emits: ['send-message', 'toggle-attach-menu', 'attach', 'video-call', 'file-selected'],
  data() {
    return {
      newMessage: '',
      showLocationSharing: false,
      _selfAvatar: '/static/avatar/avatar5.jpeg',
      isVoiceInputActive: false,
      isRecording: false,
      fileName: '',
      fileType: null,
      selectedFile: null
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
    // 发送文本消息
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

    // 切换附件菜单显示状态
    toggleAttachMenu() {
      console.log('切换附件菜单');
      this.$emit('toggle-attach-menu', !this.showAttachMenu);
    },

    // 关闭附件菜单
    closeAttachMenu() {
      console.log('关闭附件菜单');
      this.$emit('toggle-attach-menu', false);
    },

    // 处理附件项选择
    attachItem(action, data) {
      console.log('附件项被选择:', action);
      if (action === 'file' || action === 'album') {
        this.chooseAndSendPhoto();
      } else if (action === 'burn-after-reading') {
        this.chooseBurnAfterReadingImage();
      } else if (action === 'camera') {
        this.takePhoto();
      } else if (action === 'location') {
        this.openLocationSharing();
      } else if (action === 'video-call') {
        this.$emit('video-call', action);
      } else {
        this.$emit('attach', action);
      }
      if (action !== 'location' && action !== 'file') {
        this.closeAttachMenu();
      }
    },

    // 选择并发送照片或文件
    async chooseAndSendPhoto(filePath = null) {
      console.log('chooseAndSendPhoto 方法被调用');
      try {
        let tempFilePath = filePath;
        if (!tempFilePath) {
          console.log('获取图片信息...');
          const imageRes = await new Promise((resolve, reject) => {
            uni.chooseImage({
              count: 1,
              success: (res) => {
                console.log('图片选择成功:', JSON.stringify(res));
                resolve(res);
              },
              fail: (err) => {
                console.error('图片选择失败:', err);
                reject(err);
              }
            });
          });
          tempFilePath = imageRes.tempFilePaths[0];
          this.fileName = tempFilePath.split('/').pop();
        } else {
          this.fileName = tempFilePath.split('/').pop();
        }
        
        this.fileType = 'image';

        console.log('选择的图片名:', this.fileName);
        console.log('文件类型:', this.fileType);

        // 发出文件选择事件
        this.$emit('file-selected', {
          type: this.fileType,
          path: tempFilePath,
          name: this.fileName,
          recipientId: this.recipientId,
          missionId: this.missionId
        });
        this.closeAttachMenu();
      } catch (error) {
        console.error('选择图片时出错:', error);
        uni.showToast({
          title: '选择失败，请重试',
          icon: 'none'
        });
      }
    },

    // 拍摄照片
    async takePhoto() {
      console.log('拍摄照片');
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          this.$emit('file-selected', {
            type: 'image',
            path: tempFilePath,
            name: 'camera_photo.jpg',
            recipientId: this.recipientId,
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

    // 打开位置共享
    openLocationSharing() {
      console.log('打开位置分享');
      this.showLocationSharing = true;
      this.closeAttachMenu();
    },

    // 关闭位置共享
    closeLocationSharing() {
      console.log('关闭位置分享');
      this.showLocationSharing = false;
    },

    // 处理位置选择
    handleLocationSelected(location) {
      console.log('位置被选择:', JSON.stringify(location));
      this.$emit('send-message', {
        type: 'location',
        content: location,
        missionId: this.missionId
      });
      this.closeLocationSharing();
    },

    // 开始视频通话
    startVideoCall() {
      console.log('开始视频通话');
      this.$emit('video-call');
    },

    // 切换语音输入
    toggleVoiceInput() {
      this.isVoiceInputActive = !this.isVoiceInputActive;
    },

    // 开始语音录制
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

    // 停止语音录制
    stopVoiceRecord() {
      console.log('停止录音');
      this.isRecording = false;
      uni.stopRecord({
        success: (res) => {
          console.log('录音结束，文件路径:', res.tempFilePath);
          this.$emit('file-selected', {
            type: 'voice',
            path: res.tempFilePath,
            name: 'voice_message.mp3',
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