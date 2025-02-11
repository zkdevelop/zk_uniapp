<template>
  <view class="chat-input-wrapper">
    <view class="chat-content">
      <!-- 附件菜单 -->
      <view v-if="isAttachMenuVisible" class="attachment-menu">
        <attachment-menu
          @attach="handleAttachItem"
          @close="closeAttachMenu"
        />
      </view>

      <!-- 输入区域 -->
      <view class="input-container">
        <view class="chat-input">
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
            @click="toggleAttachMenu"
            :is-burn-after-reading-mode="isBurnAfterReadingMode"
          />
          
          <!-- 发送按钮 -->
          <send-button
            v-if="!isVoiceInputActive && (isAttachMenuVisible || newMessage.trim().length > 0)"
            @click="sendMessage"
          />
        </view>
      </view>
    </view>

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
    modelValue: {
      type: Boolean,
      default: false
    },
    recipientId: {
      type: String,
      required: true
    },
    missionId: {
      type: [String, Array],
      required: true
    },
    initialBurnAfterReadingMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['send-message', 'update:modelValue', 'attach', 'video-call', 'file-selected', 'toggle-burn-after-reading'],
  setup(props, { emit }) {
    console.log('ChatInputArea setup function called')
    
    const newMessage = ref('')
    const showLocationSharing = ref(false)
    const isVoiceInputActive = ref(false)
    const isBurnAfterReadingMode = ref(props.initialBurnAfterReadingMode)
    const isAttachMenuVisible = ref(false)

    const handleVoiceFileSelected = (fileInfo) => {
      console.log('语音输入回调被触发，完整的文件信息:', JSON.stringify(fileInfo))
      
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

    const { 
      isRecording, 
      recordAuth, 
      duration, 
      voiceStatus,
      startVoiceRecord, 
      stopVoiceRecord
    } = useVoiceInput(handleVoiceFileSelected)
    
    const { 
      attachItem: handleAttachItem, 
      handleFileSelected, 
      openLocationSharing, 
      closeLocationSharing, 
      handleLocationSelected,
      showLocationSharing: locationSharingState,
      isBurnAfterReadingMode: burnMode,
      toggleBurnAfterReadingMode
    } = useAttachmentHandling(emit, props)

    const { sendMessage: sendMessageHandler } = useMessageSending(newMessage, emit, props, isBurnAfterReadingMode)

    const sendMessage = () => {
      console.log('发送消息')
      sendMessageHandler()
      closeAttachMenu()
    }

    const toggleVoiceInput = () => {
      isVoiceInputActive.value = !isVoiceInputActive.value
      console.log('切换语音输入状态:', isVoiceInputActive.value)
      closeAttachMenu()
    }

    const toggleAttachMenu = () => {
      console.log('切换附件菜单状态');
      isAttachMenuVisible.value = !isAttachMenuVisible.value;
      emit('update:modelValue', isAttachMenuVisible.value);
    }

    const closeAttachMenu = () => {
      console.log('关闭附件菜单');
      isAttachMenuVisible.value = false;
      emit('update:modelValue', false);
    }

    watch(() => props.recipientId, (newVal) => {
      if (!newVal) {
        showLocationSharing.value = false
      }
    })

    watch(locationSharingState, (newVal) => {
      showLocationSharing.value = newVal
    })

    watch(burnMode, (newVal) => {
      isBurnAfterReadingMode.value = newVal
      emit('toggle-burn-after-reading', newVal)
    })

    watch(isBurnAfterReadingMode, (newVal) => {
      console.log('阅后即焚模式状态变化:', newVal)
      emit('toggle-burn-after-reading', newVal)
    })

    watch(() => props.initialBurnAfterReadingMode, (newVal) => {
      isBurnAfterReadingMode.value = newVal
    })

    watch(() => props.modelValue, (newValue) => {
      console.log('附件菜单状态变化:', newValue);
      isAttachMenuVisible.value = newValue;
    });

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
      handleAttachItem,
      handleFileSelected,
      openLocationSharing,
      closeLocationSharing,
      handleLocationSelected,
      isBurnAfterReadingMode,
      toggleBurnAfterReadingMode,
      isAttachMenuVisible, 
    }
  }
}
</script>

<style>
.chat-input-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index:999
}

.chat-content {
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
}

.input-container {
  width: 100%;
  background-color: #F3F3F3;
  border-top: 1px solid #e0e0e0;
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 10px;
  min-height: 56px;
}

.attachment-menu {
  width: 100%;
  background-color: #F6F6F6;
}

.input-item {
  flex: 1;
  margin: 0 10px;
}
</style>