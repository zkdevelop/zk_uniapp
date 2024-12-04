<!-- ChatInputArea.vue - 聊天输入区域组件 -->
<template>
  <view class="chat-input-area">
    <view class="chat-input" :class="{ 'elevated': showAttachMenu }">
      <!-- 语音输入按钮 -->
      <voice-input-button
        :is-voice-input-active="isVoiceInputActive"
        :is-recording="isRecording"
        :voice-status="voiceStatus"
        :start-voice-record="startVoiceRecord"
        :stop-voice-record="stopVoiceRecord"
        @toggle-voice-input="toggleVoiceInput"
        class="input-item"
      />
      
      <!-- 文本输入框 -->
      <text-input
        v-if="!isVoiceInputActive"
        v-model="newMessage"
        @send="sendMessage"
        class="input-item"
      />
      
      <!-- 附件按钮 -->
      <attach-button
        v-if="!showAttachMenu"
        @click="toggleAttachMenu"
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
import { ref, watch, onMounted } from 'vue'
import AttachmentMenu from './ChatInputAreaComponent/AttachmentMenu.vue'
import LocationSharing from './ChatInputAreaComponent/LocationSharing.vue'
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
    VoiceInputButton,
    TextInput,
    AttachButton,
    SendButton
  },
  props: {
    // 是否显示附件菜单
    showAttachMenu: {
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
    }
  },
  emits: ['send-message', 'toggle-attach-menu', 'attach', 'video-call', 'file-selected'],
  setup(props, { emit }) {
    const newMessage = ref('')
    const showLocationSharing = ref(false)
    const isVoiceInputActive = ref(false)

    // 使用语音输入组合式函数
    const { 
      isRecording, 
      recordAuth, 
      duration, 
      voiceStatus,
      startVoiceRecord, 
      stopVoiceRecord
    } = useVoiceInput(emit)
    
    // 使用附件处理组合式函数
    const { 
      attachItem, 
      handleFileSelected, 
      openLocationSharing, 
      closeLocationSharing, 
      handleLocationSelected,
      showLocationSharing: locationSharingState
    } = useAttachmentHandling(emit, props)

    // 使用消息发送组合式函数
    const { sendMessage } = useMessageSending(newMessage, emit, props)

    // 切换语音输入模式
    const toggleVoiceInput = () => {
      isVoiceInputActive.value = !isVoiceInputActive.value
    }

    // 切换附件菜单显示状态
    const toggleAttachMenu = () => {
      emit('toggle-attach-menu', !props.showAttachMenu)
    }

    // 关闭附件菜单
    const closeAttachMenu = () => {
      emit('toggle-attach-menu', false)
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
      handleLocationSelected
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