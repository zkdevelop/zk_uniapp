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
            :placeholder="inputPlaceholder"
            :disabled="isSending"
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
            :disabled="isSending"
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
import { ref, watch, computed } from 'vue'
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
    },
    placeholder: {
      type: String,
      default: '请输入消息'
    }
  },
  emits: ['send-message', 'update:modelValue', 'attach', 'video-call', 'file-selected', 'toggle-burn-after-reading'],
  setup(props, { emit }) {
    const newMessage = ref('')
    const showLocationSharing = ref(false)
    const isVoiceInputActive = ref(false)
    const isBurnAfterReadingMode = ref(props.initialBurnAfterReadingMode)
    const isAttachMenuVisible = ref(false)
    const isSending = ref(false)

    const inputPlaceholder = computed(() => {
      return isBurnAfterReadingMode.value ? '阅后即焚模式已开启' : props.placeholder
    })

    const handleVoiceFileSelected = (fileInfo) => {
      if (fileInfo && typeof fileInfo === 'object' && fileInfo.fromVoiceInput) {
        if (!fileInfo.path) {
          uni.showToast({
            title: '语音文件保存失败，请重试',
            icon: 'none'
          })
          return
        }
        
        emit('file-selected', fileInfo)
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

    const sendMessage = async () => {
      if (isSending.value || newMessage.value.trim().length === 0) return
      isSending.value = true
      try {
        await sendMessageHandler()
        newMessage.value = ''
      } catch (error) {
        console.log('发送消息失败')
      } finally {
        isSending.value = false
      }
      closeAttachMenu()
    }

    const toggleVoiceInput = () => {
      isVoiceInputActive.value = !isVoiceInputActive.value
      closeAttachMenu()
    }

    const toggleAttachMenu = () => {
      isAttachMenuVisible.value = !isAttachMenuVisible.value
      emit('update:modelValue', isAttachMenuVisible.value)
    }

    const closeAttachMenu = () => {
      isAttachMenuVisible.value = false
      emit('update:modelValue', false)
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
      emit('toggle-burn-after-reading', newVal)
    })

    watch(() => props.initialBurnAfterReadingMode, (newVal) => {
      isBurnAfterReadingMode.value = newVal
    })

    watch(() => props.modelValue, (newValue) => {
      isAttachMenuVisible.value = newValue
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
      handleAttachItem,
      handleFileSelected,
      openLocationSharing,
      closeLocationSharing,
      handleLocationSelected,
      isBurnAfterReadingMode,
      toggleBurnAfterReadingMode,
      isAttachMenuVisible, 
      inputPlaceholder,
      isSending
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

