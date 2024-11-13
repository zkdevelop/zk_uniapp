<template>
  <view class="chat-page">
    <ChatHeader :chat-info="chatInfo" @go-back="goBack" />

    <scroll-view
      id="scrollview"
      class="message-list"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
      @scrolltoupper="loadMoreMessages"
      @scroll="onScroll"
      :style="{ height: `${scrollViewHeight}px` }"
    >
      <view v-if="isLoading" class="loading-indicator">
        <text>加载中...</text>
      </view>
      <view class="messages-container">
        <MessageList
          :messages="list"
          @view-burn-after-reading="viewBurnAfterReadingImage"
        />
      </view>
    </scroll-view>

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
      @click="scrollToBottom"
    />

    <view v-if="showNewMessageTip" class="new-message-tip" @click="scrollToBottom">
      新消息
    </view>

    <view v-if="showAttachMenu" class="overlay" @click="handleOverlayClick"></view>
  </view>
</template>

<script>
import ChatHeader from './ChatComponent/ChatHeader.vue'
import MessageList from './ChatComponent/MessageList.vue'
import ChatInputArea from './ChatComponent/ChatInputArea.vue'
import BurnAfterReading from './ChatComponent/BurnAfterReading.vue'
import ScrollToBottomButton from './ChatComponent/ScrollToBottomButton.vue'
import { getHistoryChatMessages } from '@/utils/api/message.js'

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
      showAttachMenu: false,
      burnAfterReadingDuration: 5,
      currentBurnAfterReadingImage: '',
      currentBurnAfterReadingMessage: null,
      isScrolledToBottom: true,
      scrollViewHeight: 0,
      showScrollToBottom: false,
      showNewMessageTip: false,
      hasNewMessages: false,
      messageStatuses: {},
      currentPage: 1,
      pageSize: 10,
      hasMoreMessages: true,
      isLoading: false,
      initialLoadComplete: false,
      style: {
        pageHeight: 0,
        contentViewHeight: 0,
        footViewHeight: 90,
        mitemHeight: 0
      }
    };
  },
  onLoad() {
    console.log('[onLoad] Chat component loaded');
    this.calculateScrollViewHeight();
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('chatInfo', (data) => {
      console.log('[onLoad] Received chatInfo:', data);
      this.chatInfo = data.chatInfo;
      this.initializeChat();
    });
  },
  mounted() {
    console.log('[mounted] Chat component mounted');
    const res = uni.getSystemInfoSync();
    this.style.pageHeight = res.windowHeight;
    this.style.contentViewHeight = res.windowHeight - uni.getSystemInfoSync().screenWidth / 750 * 100 - 70;
    this.scrollToBottom();
  },
  methods: {
    calculateScrollViewHeight() {
      const systemInfo = uni.getSystemInfoSync();
      const headerHeight = 44; // 根据实际头部高度调整
      const inputAreaHeight = 50; // 根据实际输入区域高度调整
      this.scrollViewHeight = systemInfo.windowHeight - headerHeight - inputAreaHeight;
      console.log('[calculateScrollViewHeight] Calculated scroll view height:', this.scrollViewHeight);
    },
    async initializeChat() {
      console.log('[initializeChat] Initializing chat');
      await this.loadHistoryMessages();
      this.initialLoadComplete = true;
      this.$nextTick(() => {
        console.log('[initializeChat] Initial load complete, scrolling to bottom');
        this.scrollToBottom();
      });
    },
    goBack() {
      uni.navigateBack();
    },
    async loadMoreMessages() {
      console.log('[loadMoreMessages] Loading more messages');
      if (this.hasMoreMessages && !this.isLoading) {
        this.isLoading = true;
        this.currentPage++;
        await this.loadHistoryMessages(true);
        this.isLoading = false;
      }
    },
    onScroll(e) {
      const { scrollTop, scrollHeight } = e.detail;
      this.isScrolledToBottom = scrollHeight - scrollTop <= this.scrollViewHeight + 10;
      this.showScrollToBottom = !this.isScrolledToBottom;
      console.log('[onScroll] Scroll event:', { scrollTop, scrollHeight, isScrolledToBottom: this.isScrolledToBottom });
    },
    viewBurnAfterReadingImage(message) {
      this.currentBurnAfterReadingImage = message.content;
      this.currentBurnAfterReadingMessage = message;
    },
    sendMessage(message) {
      console.log('[sendMessage] Sending message:', message);
      const tempId = Date.now().toString();
      this.list.push({
        id: tempId,
        content: message.content,
        userType: 'self',
        timestamp: new Date()
      });
      this.$set(this.messageStatuses, tempId, 'sending');
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    handleMessageSent(sentMessage) {
      console.log('[handleMessageSent] Message sent:', sentMessage);
      const tempMessage = this.list.find(m => m.content === sentMessage.message);
      if (tempMessage) {
        tempMessage.id = sentMessage.id;
        this.$set(this.messageStatuses, tempMessage.id, null);
        this.messageStatuses = { ...this.messageStatuses };
      }
    },
    handleMessageFailed(failedMessage) {
      console.log('[handleMessageFailed] Message failed:', failedMessage);
      const tempMessage = this.list.find(m => m.content === failedMessage);
      if (tempMessage) {
        this.$set(this.messageStatuses, tempMessage.id, 'failed');
      }
    },
    handleAttachment(type, data) {
      console.log('[handleAttachment] Handling attachment:', type, data);
    },
    toggleAttachMenu(show) {
      this.showAttachMenu = show;
    },
    handleOverlayClick() {
      this.showAttachMenu = false;
    },
    scrollToBottom() {
      console.log('[scrollToBottom] Scrolling to bottom');
      let that = this;
      let query = uni.createSelectorQuery().in(this);
      query.selectAll('.m-item').boundingClientRect();
      query.select('#scrollview').boundingClientRect();
      query.exec((res) => {
        that.style.mitemHeight = 0;
        res[0].forEach((rect) => that.style.mitemHeight = that.style.mitemHeight + rect.height + 40);
        setTimeout(() => {
          if (that.style.mitemHeight > (that.style.contentViewHeight - 100)) {
            that.scrollTop = that.style.mitemHeight - that.style.contentViewHeight;
            console.log('[scrollToBottom] Setting scrollTop to:', that.scrollTop);
          }
        }, 100);
      });
    },
    closeBurnAfterReadingPreview() {
      this.currentBurnAfterReadingImage = '';
      this.currentBurnAfterReadingMessage = null;
    },
    async loadHistoryMessages(isLoadingMore = false) {
      console.log('[loadHistoryMessages] Loading history messages', { isLoadingMore, currentPage: this.currentPage });

      try {
        const response = await getHistoryChatMessages({
          opponentId: this.chatInfo.id,
          curPage: this.currentPage,
          pageSize: this.pageSize
        });

        console.log('[loadHistoryMessages] History messages response:', response);

        if (response.code === 200) {
          const newMessages = response.data.records.map(msg => ({
            id: msg.id,
            content: msg.message,
            userType: msg.senderId === this.chatInfo.id ? 'other' : 'self',
            timestamp: new Date(msg.sendTime),
            messageType: msg.messageType,
            isRead: msg.isRead
          }));

          if (isLoadingMore) {
            this.list = [...newMessages.reverse(), ...this.list];
          } else {
            this.list = [...this.list, ...newMessages];
          }
          
          this.hasMoreMessages = response.data.records.length === this.pageSize;

          console.log('[loadHistoryMessages] Updated message list:', this.list);
          console.log('[loadHistoryMessages] Has more messages:', this.hasMoreMessages);

          this.$nextTick(() => {
            if (!isLoadingMore) {
              console.log('[loadHistoryMessages] Scrolling to bottom after loading initial messages');
              this.scrollToBottom();
            }
          });
        } else {
          console.error('[loadHistoryMessages] Failed to load history messages:', response.msg);
          uni.showToast({
            title: '加载历史消息失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('[loadHistoryMessages] Error loading history messages:', error);
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        });
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.message-list {
  flex: 1;
  overflow-y: auto;
}

.messages-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
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

.loading-indicator {
  text-align: center;
  padding: 10px 0;
  color: #999;
  font-size: 14px;
}
</style>