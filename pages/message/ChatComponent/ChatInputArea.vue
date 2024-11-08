<template>
  <view class="chat-input-area">
    <!-- 聊天输入框和按钮区域 -->
    <view class="chat-input" :class="{ 'elevated': showAttachMenu }">
      <!-- 语音按钮 -->
      <view class="voice-button">
        <image src="/static/message/语音输入.png" class="voice-icon" />
      </view>
      
      <!-- 文本输入框 -->
      <input 
        type="text" 
        class="text-input" 
        placeholder="输入消息..." 
        v-model="newMessage" 
        @confirm="sendMessage" 
        ref="messageInput"
      />
      
      <!-- 附件按钮（当附件菜单未显示时） -->
      <text v-if="!showAttachMenu" class="attach-button" @click="toggleAttachMenu">+</text>
      
      <!-- 发送按钮（当附件菜单显示时） -->
      <text v-if="showAttachMenu" class="send-button" @click="sendMessage">发送</text>
    </view>

    <!-- 附件菜单组件 -->
    <attachment-menu 
      v-if="showAttachMenu" 
      @attach="attachItem"
      @close="closeAttachMenu"
    >
      <!-- 为未实现的功能预留插槽 -->
      <template v-slot:album>
        <!-- 相册功能的自定义内容 -->
      </template>
      <template v-slot:camera>
        <!-- 拍摄功能的自定义内容 -->
      </template>
      <template v-slot:video-call>
        <!-- 视频通话功能的自定义内容 -->
      </template>
      <template v-slot:location>
        <!-- 位置功能的自定义内容 -->
      </template>
    </attachment-menu>

    <!-- 文件传输组件 -->
    <file-transfer ref="fileTransfer" @file-selected="handleFileSelected" />
  </view>
</template>

<script>
import AttachmentMenu from './ChatInputAreaComponent/AttachmentMenu.vue'
import FileTransfer from './ChatInputAreaComponent/FileTransfer.vue'

export default {
  name: 'ChatInputArea',
  components: {
    AttachmentMenu,
    FileTransfer
  },
  props: {
    showAttachMenu: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newMessage: '', // 存储用户输入的消息
    }
  },
  methods: {
    // 发送消息
    sendMessage() {
      if (this.newMessage.trim()) {
        this.$emit('send-message', this.newMessage);
        this.newMessage = ''; // 清空输入框
      }
    },
 
    // 切换附件菜单的显示状态
    toggleAttachMenu() {
      this.$emit('toggle-attach-menu', !this.showAttachMenu);
    },
    // 关闭附件菜单
    closeAttachMenu() {
      this.$emit('toggle-attach-menu', false);
    },
    // 处理附件项的点击
    attachItem(action) {
      if (action === 'file') {
        this.$refs.fileTransfer.chooseFile();
      } else if (action === 'burn-after-reading') {
        this.chooseBurnAfterReadingImage();
      } else {
        this.$emit('attach', action);
      }
      this.closeAttachMenu();
    },
    // 处理文件选择
    handleFileSelected(fileData) {
      this.$emit('attach', 'file', fileData);
    },
    // 选择阅后即焚图片
    chooseBurnAfterReadingImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          const image = res.tempFilePaths[0];
          this.applyMosaicEffect(image, (mosaicImage) => {
            this.$emit('attach', 'burn-after-reading', {
              originalPath: image,
              mosaicPath: mosaicImage,
              duration: 5 // 默认持续时间为5秒
            });
          });
        },
        fail: (err) => {
          console.error('选择图片失败', err);
        }
      });
    },
    // 应用马赛克效果到图片
    applyMosaicEffect(imagePath, callback) {
      const ctx = uni.createCanvasContext('mosaicCanvas');
      
      // 在画布上绘制原始图片
      ctx.drawImage(imagePath, 0, 0, 300, 300);
      
      // 应用马赛克效果
      ctx.setFillStyle('rgba(0, 0, 0, 0.5)');
      for (let y = 0; y < 300; y += 10) {
        for (let x = 0; x < 300; x += 10) {
          ctx.fillRect(x, y, 10, 10);
        }
      }
      
      // 将处理后的图像保存为临时文件
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