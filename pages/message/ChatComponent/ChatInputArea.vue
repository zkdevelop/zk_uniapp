<!-- ChatInputArea.vue - 聊天输入区域组件 -->
<template>
  <view class="chat-input-area">
    <view class="chat-input" :class="{ 'elevated': showAttachMenu }">
      <!-- 语音/键盘切换按钮 -->
      <toggle-voice-button
        :is-voice-input-active="isVoiceInputActive"
        :is-burn-after-reading-mode="isBurnAfterReadingMode"
        @toggle-voice-input="toggleVoiceInput"
      />
      
      <!-- 语音录音按钮 -->
      <voice-input-button
        v-if="isVoiceInputActive"
        :is-recording="isRecording"
        :voice-status="voiceStatus"
        :start-voice-record="startVoiceRecord"
        :stop-voice-record="stopVoiceRecord"
        class="input-item"
      />
      
      <!-- 文本输入框 -->
      <text-input
        v-else
        v-model="newMessage"
        @send="sendMessage"
        class="input-item"
      />
      
      <!-- 附件按钮 -->
      <attach-button
        v-if="!showAttachMenu"
        @click="toggleAttachMenu"
        :is-burn-after-reading-mode="isBurnAfterReadingMode"
      />
      
      <!-- 发送按钮 -->
      <send-button
        v-if="!isVoiceInputActive && (showAttachMenu || newMessage.trim().length > 0)"
        @click="sendMessage"
      />
    </view>

    <!-- 附件菜单 -->
    <attachment-menu
      v-if="showAttachMenu"
      @attach="attachItem"
      @close="closeAttachMenu"
    />

    <!-- 位置共享组件 -->
    <location-sharing
      v-if="showLocationSharing"
      :recipient-id="recipientId"
      :mission-id="missionId"
      @location-selected="handleLocationSelected"
      @close="closeLocationSharing"
    />
  </view>
</template>

<script>
import { ref, watch } from 'vue'
import AttachmentMenu from './ChatInputAreaComponent/AttachmentMenu.vue'
import LocationSharing from './ChatInputAreaComponent/LocationSharing.vue'
import ToggleVoiceButton from './ChatInputAreaComponent/ToggleVoiceButton.vue'
import VoiceInputButton from './ChatInputAreaComponent/VoiceInputButton.vue'
import TextInput from './ChatInputAreaComponent/TextInput.vue'
import AttachButton from './ChatInputAreaComponent/AttachButton.vue'
import SendButton from './ChatInputAreaComponent/SendButton.vue'
import useVoiceInput from './composables/useVoiceInput'
import useAttachmentHandling from './composables/useAttachmentHandling'
import useMessageSending from './composables/useMessageSending'

export default {
  name: 'ChatInputArea',
  components: {
    AttachmentMenu,
    LocationSharing,
    ToggleVoiceButton,
    VoiceInputButton,
    TextInput,
    AttachButton,
    SendButton
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
    },
    initialBurnAfterReadingMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['send-message', 'toggle-attach-menu', 'attach', 'video-call', 'file-selected', 'toggle-burn-after-reading'],
  setup(props, { emit }) {
    // 新消息内容
    const newMessage = ref('')
    // 是否显示位置共享
    const showLocationSharing = ref(false)
    // 是否激活语音输入
    const isVoiceInputActive = ref(false)
    // 阅后即焚模式
    const isBurnAfterReadingMode = ref(props.initialBurnAfterReadingMode || false)

    // 处理语音文件选择
    const handleVoiceFileSelected = (fileInfo) => {
      console.log('useVoiceInput 回调被触发，完整的文件信息:', JSON.stringify(fileInfo))
      
      if (fileInfo && typeof fileInfo === 'object' && fileInfo.fromVoiceInput) {
        if (!fileInfo.path) {
          console.error('语音文件路径缺失:', fileInfo)
          uni.showToast({
            title: '语音文件保存失败，请重试',
            icon: 'none'
          })
          return
        }
        
        emit('file-selected', fileInfo)
      } else {
        console.error('无效的文件信息:', fileInfo)
      }
    }

    // 使用语音输入钩子
    const { 
      isRecording, 
      recordAuth, 
      duration, 
      voiceStatus,
      startVoiceRecord, 
      stopVoiceRecord
    } = useVoiceInput(handleVoiceFileSelected)
    
    // 使用附件处理钩子
    const { 
      attachItem, 
      handleFileSelected, 
      openLocationSharing, 
      closeLocationSharing, 
      handleLocationSelected,
      showLocationSharing: locationSharingState,
      isBurnAfterReadingMode: burnMode,
      toggleBurnAfterReadingMode
    } = useAttachmentHandling(emit, props)

    // 使用消息发送钩子
    const { sendMessage } = useMessageSending(newMessage, emit, props, burnMode)

    // 切换语音输入模式
    const toggleVoiceInput = () => {
      isVoiceInputActive.value = !isVoiceInputActive.value
    }

    // 切换附件菜单
    const toggleAttachMenu = () => {
      emit('toggle-attach-menu', !props.showAttachMenu)
    }

    // 关闭附件菜单
    const closeAttachMenu = () => {
      emit('toggle-attach-menu', false)
    }

    // 监听接收者ID的变化
    watch(() => props.recipientId, (newVal) => {
      if (!newVal) {
        showLocationSharing.value = false
      }
    })

    // 监听位置共享状态的变化
    watch(locationSharingState, (newVal) => {
      showLocationSharing.value = newVal
    })

    // 监听阅后即焚模式的变化
    watch(burnMode, (newVal) => {
      isBurnAfterReadingMode.value = newVal
      emit('toggle-burn-after-reading', newVal)
    })

    // 监听初始阅后即焚模式的变化
    watch(() => props.initialBurnAfterReadingMode, (newVal) => {
      isBurnAfterReadingMode.value = newVal
    })

    return {
      newMessage,
      showLocationSharing,
      isVoiceInputActive,
      isRecording,
      recordAuth,
      duration,
      voiceStatus,
      toggleVoiceInput,
      startVoiceRecord,
      stopVoiceRecord,
      sendMessage,
      toggleAttachMenu,
      closeAttachMenu,
      attachItem,
      handleFileSelected,
      openLocationSharing,
      closeLocationSharing,
      handleLocationSelected,
      isBurnAfterReadingMode,
      toggleBurnAfterReadingMode
    }
  }
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
  min-height: 56px;
}

.chat-input.elevated {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.input-item {
  flex: 1;
  margin: 0 10px;
}
</style>

