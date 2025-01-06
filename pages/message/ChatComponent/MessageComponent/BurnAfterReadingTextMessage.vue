<template>
  <view class="burn-after-reading-text" @click="viewBurnAfterReading">
    <view v-if="!revealed" class="burn-button">
      <text>阅后即焚</text>
    </view>
    <view v-else class="revealed-message">
      <text>{{ revealedContent }}</text>
      <view class="countdown">{{ countdown }}s</view>
    </view>
  </view>
</template>

<script>
import { ref, onUnmounted } from 'vue';
import { readSelfDestructMessage } from '@/utils/api/message.js';

export default {
  name: 'BurnAfterReadingTextMessage',
  props: {
    messageId: {
      type: String,
      required: true
    },
    isGroup: {
      type: Boolean,
      default: false
    }
  },
  emits: ['message-deleted'],
  setup(props, { emit }) {
    const revealed = ref(false);
    const revealedContent = ref('');
    const countdown = ref(10);
    let countdownTimer = null;

    const viewBurnAfterReading = async () => {
      if (revealed.value) return;

      try {
        const response = await readSelfDestructMessage({
          isGroup: props.isGroup,
          messageId: props.messageId,
          messageType: 'MESSAGE'
        });

        if (response.code === 200) {
          revealed.value = true;
          revealedContent.value = response.data;
          startCountdown();
        } else {
          console.error('Failed to read burn-after-reading message:', response.msg);
        }
      } catch (error) {
        console.error('Error reading burn-after-reading message:', error);
      }
    };

    const startCountdown = () => {
      countdownTimer = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
          clearInterval(countdownTimer);
          emit('message-deleted', props.messageId);
        }
      }, 1000);
    };

    onUnmounted(() => {
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
    });

    return {
      revealed,
      revealedContent,
      countdown,
      viewBurnAfterReading
    };
  }
};
</script>

<style scoped>
.burn-after-reading-text {
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 10px;
  margin: 5px 0;
}

.burn-button {
  background-color: #ff4d4f;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  display: inline-block;
  cursor: pointer;
}

.revealed-message {
  position: relative;
}

.countdown {
  position: absolute;
  top: 0;
  left: -20px;
  font-size: 12px;
  color: #ff4d4f;
}
</style>

