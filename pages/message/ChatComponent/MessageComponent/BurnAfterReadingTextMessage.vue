<template>
  <view class="burn-after-reading-text" @click="viewBurnAfterReading">
    <view v-if="!revealed" class="burn-button">
      <image
        src="/static/message/envelope.png"
        class="envelope-icon"
        mode="aspectFit"
      />
      <text class="burn-text">阅后即焚</text>
    </view>
    <view v-else class="revealed-message">
      <text class="revealed-content">{{ revealedContent }}</text>
      <view class="countdown">{{ countdown }}s</view>
    </view>
  </view>
</template>

<script>
import { ref, onUnmounted } from "vue";
import { readSelfDestructMessage } from "@/utils/api/message.js";

export default {
  name: "BurnAfterReadingTextMessage",
  props: {
    // 消息ID
    messageId: {
      type: String,
      required: true,
    },
    // 是否为群组消息
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["message-deleted"],
  setup(props, { emit }) {
    // 是否已显示内容
    const revealed = ref(false);
    // 显示的内容
    const revealedContent = ref("");
    // 倒计时秒数
    const countdown = ref(10);
    // 倒计时定时器
    let countdownTimer = null;

    // 查看阅后即焚消息
    const viewBurnAfterReading = async () => {
      if (revealed.value) return;

      try {
        const response = await readSelfDestructMessage({
          isGroup: props.isGroup,
          messageId: props.messageId,
          messageType: "MESSAGE",
        });

        if (response.code === 200) {
          revealed.value = true;
          revealedContent.value = response.data.content || response.data;
          startCountdown();
        }
      } catch (error) {
        console.log("读取阅后即焚消息失败:", error);
      }
    };

    // 开始倒计时
    const startCountdown = () => {
      countdownTimer = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
          clearInterval(countdownTimer);
          revealed.value = false;
          revealedContent.value = "";
          emit("message-deleted", props.messageId);
          console.log("阅后即焚消息倒计时结束，已触发删除事件");
        }
      }, 1000);
    };

    // 组件卸载时清除定时器
    onUnmounted(() => {
      if (countdownTimer) {
        clearInterval(countdownTimer);
        console.log("组件卸载，清除定时器");
      }
      if (revealed.value && countdown.value > 0) {
        emit("message-deleted", props.messageId);
        console.log("组件卸载时消息仍在显示，触发删除事件");
      }
    });

    return {
      revealed,
      revealedContent,
      countdown,
      viewBurnAfterReading,
    };
  },
};
</script>

<style scoped>
.burn-after-reading-text {
  width: 100%;
}

.burn-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.16);
  border-radius: 2px;
  padding: 12px;
}

.envelope-icon {
  width: 20px;
  height: 20px;
}

.burn-text {
  background: #edf1f2;
  padding: 8px 12px;
  border-radius: 2px;
  font-family: NotoSansCJKsc-Medium;
  font-size: 14px;
  color: #414141;
  letter-spacing: 0;
  line-height: 14px;
  font-weight: 500;
}

.revealed-message {
  position: relative;
  width: 100%;
}

.revealed-content {
  display: block;
  background: #4e8cff;
  padding: 20rpx;
  border-radius: 10rpx;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #fff;
  font-size: 28rpx;
  line-height: 1.3;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}

.countdown {
  position: absolute;
  bottom: 30%;
  left: -70%;
  font-size: 24rpx;
  color: #ff0000;
}
</style>
