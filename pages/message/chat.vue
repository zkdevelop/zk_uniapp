<!-- chat.vue -->
<template>
  <view class="page">
    <ChatHeader :chat-info="chatInfo" @go-back="goBack" />

    <MessageList
      :messages="list"
      :scroll-top="scrollTop"
      :scroll-into-view="scrollIntoView"
      @load-more="loadMoreMessages"
      @scroll="onScroll"
      @view-burn-after-reading="viewBurnAfterReadingImage"
    />

    <ChatInputArea 
      @send-message="sendMessage" 
      @message-sent="handleMessageSent"
      @message-failed="handleMessageFailed"
      @attach="handleAttachment"
      :show-attach-menu="showAttachMenu"
      @toggle-attach-menu="toggleAttachMenu"
      :recipientId="chatInfo.id"
    />

    <BurnAfterReading
      v-if="currentBurnAfterReadingImage"
      :imageSrc="currentBurnAfterReadingImage"
      :duration="burnAfterReadingDuration"
      @close="closeBurnAfterReadingPreview"
      ref="burnAfterReadingRef"
    />

    <ScrollToBottomButton
      :show="showScrollToBottom"
      @click.stop="scrollToBottom"
    />

    <view v-if="showNewMessageTip" class="new-message-tip" @click.stop="scrollToBottom">
      新消息
    </view>

    <div v-if="showAttachMenu" class="overlay" @click="handleOverlayClick"></div>
  </view>
</template>

<script>
import ChatHeader from './ChatComponent/ChatHeader.vue'
import MessageList from './ChatComponent/MessageList.vue'
import ChatInputArea from './ChatComponent/ChatInputArea.vue'
import BurnAfterReading from './ChatComponent/BurnAfterReading.vue'
import ScrollToBottomButton from './ChatComponent/ScrollToBottomButton.vue'

export default {
  name: 'Chat',
  components: {
    ChatHeader,
    MessageList,
    ChatInputArea,
    BurnAfterReading,
    ScrollToBottomButton
  },
  data() {
    return {
      chatInfo: {
        id: '',
        name: '',
        avatar: [],
        type: 'single'
      },
      list: [],
      scrollTop: 0,
      scrollIntoView: '',
      _selfAvatar: '',
      showAttachMenu: false,
      burnAfterReadingDuration: 5,
      currentBurnAfterReadingImage: '',
      currentBurnAfterReadingMessage: null,
      isScrolledToBottom: true,
      scrollViewHeight: 0,
      scrollViewScrollHeight: 0,
      showScrollToBottom: false,
      showNewMessageTip: false,
      hasNewMessages: false,
      messageStatuses: {},
    };
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('chatInfo', (data) => {
      this.chatInfo = data.chatInfo;
      this.initializeChat();
    });
  },
  mounted() {
    this.getScrollViewInfo();
    console.log('聊天组件已挂载');
  },
  methods: {
    initializeChat() {
      // 初始化聊天逻辑
    },
    goBack() {
      uni.navigateBack();
    },
    loadMoreMessages() {
      // 加载更多消息的逻辑
    },
    onScroll(e) {
      // 滚动处理逻辑
    },
    viewBurnAfterReadingImage(message) {
      // 查看阅后即焚图片的逻辑
    },
    sendMessage(message) {
      const tempId = Date.now().toString();
      this.list.push({
        id: tempId,
        content: message.content,
        userType: 'self',
        timestamp: new Date()
      });
      this.$set(this.messageStatuses, tempId, 'sending');
      this.scrollToBottom();
    },
    handleMessageSent(sentMessage) {
      const tempMessage = this.list.find(m => m.content === sentMessage.message);
      if (tempMessage) {
        tempMessage.id = sentMessage.id;
        this.$delete(this.messageStatuses, tempMessage.id);
      }
    },
    handleMessageFailed(failedMessage) {
      const tempMessage = this.list.find(m => m.content === failedMessage);
      if (tempMessage) {
        this.$set(this.messageStatuses, tempMessage.id, 'failed');
      }
    },
    handleAttachment(type, data) {
      // 处理附件的逻辑
    },
    toggleAttachMenu(show) {
      this.showAttachMenu = show;
    },
    handleOverlayClick() {
      this.showAttachMenu = false;
    },
    scrollToBottom() {
      // 滚动到底部的逻辑
    },
    getScrollViewInfo() {
      // 获取滚动视图信息的逻辑
    },
    closeBurnAfterReadingPreview() {
      // 关闭阅后即焚预览的逻辑
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
}

.new-message-tip {
  position: fixed;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  z-index: 1000;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 999;
}
</style>