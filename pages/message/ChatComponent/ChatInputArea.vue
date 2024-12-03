<!-- ChatInputArea.vue - 聊天输入区域组件 -->
<template>
  <view class="chat-input-area">
    <view class="chat-input" :class="{ 'elevated': showAttachMenu }">
      <!-- 语音输入模式 -->
      <template v-if="isVoiceInputActive">
        <voice-input-button
          :is-voice-input-active="isVoiceInputActive"
          :is-recording="isRecording"
          :voice-status="voiceStatus"
          :start-voice-record="startVoiceRecord"
          :stop-voice-record="stopVoiceRecord"
          @toggle-voice-input="toggleVoiceInput"
        />
        
        <attach-button
          v-if="!showAttachMenu"
          @click="toggleAttachMenu"
        />
      </template>

      <!-- 文本输入模式 -->
      <template v-else>
        <voice-input-button
          :is-voice-input-active="isVoiceInputActive"
          :is-recording="isRecording"
          :voice-status="voiceStatus"
          :start-voice-record="startVoiceRecord"
          :stop-voice-record="stopVoiceRecord"
          @toggle-voice-input="toggleVoiceInput"
        />
        
        <text-input
          v-model="newMessage"
          @send="sendMessage"
        />
        
        <attach-button
          v-if="!showAttachMenu"
          @click="toggleAttachMenu"
        />
        
        <send-button
          v-if="showAttachMenu || newMessage.trim().length > 0"
          @click="sendMessage"
        />
      </template>
    </view>

    <attachment-menu
      v-if="showAttachMenu"
      @attach="attachItem"
      @close="closeAttachMenu"
    />

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
  setup(props, { emit }) {
    const newMessage = ref('')
    const showLocationSharing = ref(false)
    const isVoiceInputActive = ref(false)

    const { 
      isRecording, 
      recordAuth, 
      duration, 
      voiceStatus,
      startVoiceRecord, 
      stopVoiceRecord
    } = useVoiceInput(emit)
    
    const { 
      attachItem, 
      handleFileSelected, 
      openLocationSharing, 
      closeLocationSharing, 
      handleLocationSelected,
      showLocationSharing: locationSharingState
    } = useAttachmentHandling(emit, props)
    const { sendMessage } = useMessageSending(newMessage, emit, props)

    const toggleVoiceInput = () => {
      isVoiceInputActive.value = !isVoiceInputActive.value
    }

    const toggleAttachMenu = () => {
      emit('toggle-attach-menu', !props.showAttachMenu)
    }

    const closeAttachMenu = () => {
      emit('toggle-attach-menu', false)
    }

    watch(() => props.recipientId, (newVal) => {
      if (!newVal) {
        showLocationSharing.value = false
      }
    })

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

.voice-press-button {
  flex: 1;
  height: 36px;
  background-color: #FFFFFF;
  border: 1px solid #e0e0e0;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
}

.voice-text {
  color: #999;
  font-size: 14px;
}
</style>