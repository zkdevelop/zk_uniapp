<!-- ChatInputArea.vue - 聊天输入区域组件 -->
<template>
  <view class="chat-input-wrapper">
    <view class="chat-content">
      <!-- 附件菜单 -->
      <transition name="slide-up">
        <view v-if="modelValue" class="attachment-menu">
          <attachment-menu
            @attach="handleAttachItem"
            @close="closeAttachMenu"
          />
        </view>
      </transition>

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
            v-if="!modelValue"
            @click="toggleAttachMenu"
            :is-burn-after-reading-mode="isBurnAfterReadingMode"
          />
          
          <!-- 发送按钮 -->
          <send-button
            v-if="!isVoiceInputActive && (modelValue || newMessage.trim().length > 0)"
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
    // 控制附件菜单显示状态
    modelValue: {
      type: Boolean,
      default: false
    },
    // 接收者ID
    recipientId: {
      type: String,
      required: true
    },
    // 任务ID
    missionId: {
      type: String,
      required: true,
      default: ''
    },
    // 初始阅后即焚模式状态
    initialBurnAfterReadingMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['send-message', 'update:modelValue', 'attach', 'video-call', 'file-selected', 'toggle-burn-after-reading'],
  setup(props, { emit }) {
    // 新消息内容
    const newMessage = ref('')
    // 位置共享显示状态
    const showLocationSharing = ref(false)
    // 语音输入激活状态
    const isVoiceInputActive = ref(false)
    // 阅后即焚模式状态
    const isBurnAfterReadingMode = ref(props.initialBurnAfterReadingMode)

    // 处理语音文件选择
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

    // 使用语音输入相关功能
    const { 
      isRecording, 
      recordAuth, 
      duration, 
      voiceStatus,
      startVoiceRecord, 
      stopVoiceRecord
    } = useVoiceInput(handleVoiceFileSelected)
    
    // 使用附件处理相关功能
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

    // 使用消息发送相关功能
    const { sendMessage: sendMessageHandler } = useMessageSending(newMessage, emit, props, isBurnAfterReadingMode)

    // 发送消息
    const sendMessage = () => {
      console.log('发送消息')
      sendMessageHandler()
      // 发送消息后关闭附件菜单
      emit('update:modelValue', false)
    }

    // 切换语音输入状态
    const toggleVoiceInput = () => {
      isVoiceInputActive.value = !isVoiceInputActive.value
      // 切换语音输入时关闭附件菜单
      emit('update:modelValue', false)
    }

    // 切换附件菜单状态
    const toggleAttachMenu = () => {
      console.log('切换附件菜单状态:', !props.modelValue)
      emit('update:modelValue', !props.modelValue)
    }

    // 关闭附件菜单
    const closeAttachMenu = () => {
      console.log('关闭附件菜单')
      emit('update:modelValue', false)
    }

    // 监听接收者ID变化
    watch(() => props.recipientId, (newVal) => {
      if (!newVal) {
        showLocationSharing.value = false
      }
    })

    // 监听位置共享状态变化
    watch(locationSharingState, (newVal) => {
      showLocationSharing.value = newVal
    })

    // 监听阅后即焚模式状态变化
    watch(burnMode, (newVal) => {
      isBurnAfterReadingMode.value = newVal
      emit('toggle-burn-after-reading', newVal)
    })

    // 监听阅后即焚模式状态变化
    watch(isBurnAfterReadingMode, (newVal) => {
      console.log('阅后即焚模式状态变化:', newVal)
      emit('toggle-burn-after-reading', newVal)
    })

    // 监听初始阅后即焚模式状态变化
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
      handleAttachItem,
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
.chat-input-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
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

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.15s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
}
</style>

