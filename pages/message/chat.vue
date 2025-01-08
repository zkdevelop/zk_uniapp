<!-- chat.vue - 聊天页面组件 -->
<template>
  <view class="chat-page">
    <!-- 聊天头部 -->
    <ChatHeader :chat-info="chatInfo" @go-back="goBack" />

    <!-- 消息列表 -->
    <MessageList
      ref="messageListRef"
      :messages="list"
      :is-group="chatInfo.type === 'group'"
      @load-more="loadMoreMessages"
      @scroll="onScroll"
      @view-burn-after-reading="viewBurnAfterReadingImage"
      @message-deleted="handleMessageDeleted"
    />

    <!-- 聊天输入区域 -->
    <ChatInputArea 
      @send-message="sendMessage"
      @message-failed="handleMessageFailed"
      @attach="handleAttachment"
      @video-call="openVideoPage"
      @toggle-attach-menu="toggleAttachMenu"
      @file-selected="handleFileSelected"
      @toggle-burn-after-reading="handleBurnAfterReadingToggle"
      :show-attach-menu="showAttachMenu"
      :recipientId="chatInfo.id"
      :missionId="chatInfo.missionId"
      :initial-burn-after-reading-mode="chatInfo.isBurnAfterReadingMode"
      ref="chatInputAreaRef"
    />

    <!-- 阅后即焚组件 -->
    <BurnAfterReading
      v-if="currentBurnAfterReadingImage"
      :imageSrc="currentBurnAfterReadingImage"
      :duration="burnAfterReadingDuration"
      @close="closeBurnAfterReadingPreview"
      ref="burnAfterReadingRef"
    />

    <!-- 滚动到底部按钮 -->
    <ScrollToBottomButton
      :show="showScrollToBottom"
      @click.stop="scrollToBottom"
    />

    <!-- 新消息提示 -->
    <view v-if="showNewMessageTip" class="new-message-tip" @click.stop="scrollToBottom">
      新消息
    </view>

    <!-- 来电提醒 -->
    <view v-if="peerStore.activateNotification" class="modal">
      <view>
        <text>{{peerStore.dataConnection?.peer}} 邀请你视频通话</text>
      </view>
      <view class="modal-content">
        <button @click="acceptVideoCall" type="default">接听</button>
        <button @click="rejectVideoCall" type="warn">拒绝</button>
      </view>
    </view>

    <!-- 附件菜单遮罩层 -->
    <div v-if="showAttachMenu" class="overlay" @click="handleOverlayClick"></div>
  </view>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import ChatHeader from './ChatComponent/ChatHeader.vue'
import MessageList from './ChatComponent/MessageList.vue'
import ChatInputArea from './ChatComponent/ChatInputArea.vue' 
import ScrollToBottomButton from './ChatComponent/ScrollToBottomButton.vue'
import { getHistoryChatMessages, sendMessageToUser, sendFilesToUser, readSelfDestructMessage } from '@/utils/api/message.js'
import usePeerStore from '../../store/peer'
import useFriendStore from '../../store/friend'
import { useUserStore } from '@/store/userStore'
import { useChatInitialization } from './ChatComposables/useChatInitialization'
import { useMessageHandling } from './ChatComposables/useMessageHandling'
import { useUiInteractions } from './ChatComposables/useUiInteractions'
import { useVideoCallHandling } from './ChatComposables/useVideoCallHandling'
import { useSelfDestructMessageHandling } from './ChatComposables/useSelfDestructMessageHandling'

export default {
  name: 'Chat',
  components: {
    ChatHeader,
    MessageList,
    ChatInputArea, 
    ScrollToBottomButton
  },
  setup() {
    // 聊天信息
    const chatInfo = ref({
      id: '',
      name: '',
      avatar: [],
      type: 'single',
      missionId: '',
      isBurnAfterReadingMode: false
    })
    
    // 消息列表
    const list = ref([])
    
    // UI 状态
    const showAttachMenu = ref(false)
    const burnAfterReadingDuration = ref(5)
    const currentBurnAfterReadingImage = ref('')
    const currentBurnAfterReadingMessage = ref(null)
    const isScrolledToBottom = ref(true)
    const showScrollToBottom = ref(false)
    const showNewMessageTip = ref(false)
    const hasNewMessages = ref(false)
    
    // 分页加载相关
    const currentFrom = ref(0)
    const currentTo = ref(10)
    const hasMoreMessages = ref(true) 
    const isLoading = ref(false)
    
    // 存储
    const peerStore = usePeerStore()
    const friendStore = useFriendStore()
    
    // 阅后即焚模式
    const isBurnAfterReadingMode = ref(false)
    
    // 消息列表引用
    const messageListRef = ref(null)

    // 使用聊天初始化钩子
    const {
      goBack,
      setupChatInfo
    } = useChatInitialization()

    // 使用消息处理钩子
    const {
      sendMessage,
      handleMessageFailed,
      loadHistoryMessages: loadHistoryMessagesFromComposable,
      updateMessageList,
      handleFileSelected,
      handleMessageDeleted
    } = useMessageHandling(chatInfo, list, currentFrom, currentTo, hasMoreMessages)

    // 使用 UI 交互钩子
    const {
      handleAttachment,
      viewBurnAfterReadingImage,
      closeBurnAfterReadingPreview,
      toggleAttachMenu,
      handleOverlayClick,
      scrollToBottom,
      onScroll,
      loadMoreMessages,
      toggleBurnAfterReadingMode
    } = useUiInteractions({
      messageListRef,
      isScrolledToBottom,
      showScrollToBottom,
      showNewMessageTip,
      hasNewMessages,
      isLoading,
      currentFrom,
      currentTo,
      loadHistoryMessages: loadHistoryMessagesFromComposable,
      showAttachMenu,
      hasMoreMessages
    })

    // 使用视频通话处理钩子
    const {
      openVideoPage,
      acceptVideoCall,
      rejectVideoCall
    } = useVideoCallHandling()

    // 使用自毁消息处理钩子
    const {
      handleSelfDestructMessage
    } = useSelfDestructMessageHandling()

    // 加载历史消息
    const loadHistoryMessages = async (isLoadingMore = false) => {
      try {
        await loadHistoryMessagesFromComposable(isLoadingMore);
        if (!isLoadingMore) {
          nextTick(() => {
            console.log('[loadHistoryMessages] 加载初始消息后滚动到底部');
            scrollToBottom();
          });
        }
      } catch (error) {
        console.error('[loadHistoryMessages] 加载历史消息出错:', error);
      }
    };

    // 初始化聊天
    const initializeChat = async () => {
      console.log('[initializeChat] 开始初始化聊天');
      if (chatInfo.value && chatInfo.value.id) {
        await loadHistoryMessages();
        nextTick(() => {
          console.log('[initializeChat] 初始化完成，滚动到底部');
          scrollToBottom();
        });
      } else {
        console.log('[initializeChat] 聊天信息尚未准备好，等待设置');
      }
    };

    // 处理阅后即焚模式切换
    const handleBurnAfterReadingToggle = (isActive) => {
      console.log('[handleBurnAfterReadingToggle] 阅后即焚模式切换:', isActive)
      chatInfo.value.isBurnAfterReadingMode = isActive
    }

    // 组件挂载时的处理
    onMounted(() => {
      console.log('[Chat] mounted 生命周期钩子被调用');
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      if (currentPage && currentPage.$page && currentPage.$page.fullPath) {
        console.log('[Chat] 当前页面路径:', currentPage.$page.fullPath);
      }
      
      // 尝试多种方式获取 eventChannel
      let eventChannel;
      if (currentPage && currentPage.$getAppWebview) {
        eventChannel = currentPage.$getAppWebview().eventChannel;
      } else if (currentPage && currentPage.getOpenerEventChannel) {
        eventChannel = currentPage.getOpenerEventChannel();
      } else if (uni && uni.getEnterOptionsSync) {
        const enterOptions = uni.getEnterOptionsSync();
        eventChannel = enterOptions.eventChannel;
      }

      if (eventChannel) {
        console.log('[Chat] 成功获取 eventChannel');
        setupChatInfo(eventChannel, {
          chatInfo,
          loadHistoryMessages: () => loadHistoryMessages(),
          $nextTick: nextTick,
          scrollToBottom
        });
      } else {
        console.error('[Chat] 无法获取 eventChannel，尝试其他初始化方法');
        // 这里可以添加备用的初始化逻辑，例如从 URL 参数或全局状态获取聊天信息
        const query = uni.getStorageSync('chatQuery');
        if (query) {
          console.log('[Chat] 从存储中获取聊天信息:', query);
          chatInfo.value = JSON.parse(query);
          initializeChat();  // 调用 initializeChat
        } else {
          console.error('[Chat] 无法初始化聊天，缺少必要信息');
          // 可以在这里添加错误处理逻辑，例如显示错误消息或重定向到其他页面
        }
      }
    })

    return {
      chatInfo,
      list,
      showAttachMenu,
      burnAfterReadingDuration,
      currentBurnAfterReadingImage,
      currentBurnAfterReadingMessage,
      isScrolledToBottom,
      showScrollToBottom,
      showNewMessageTip,
      hasNewMessages,
      currentFrom,
      currentTo,
      hasMoreMessages, 
      isLoading,
      peerStore,
      friendStore,
      isBurnAfterReadingMode,
      messageListRef,
      goBack,
      sendMessage,
      handleMessageFailed,
      loadHistoryMessages,
      updateMessageList,
      handleFileSelected,
      handleAttachment,
      viewBurnAfterReadingImage,
      closeBurnAfterReadingPreview,
      toggleAttachMenu,
      handleOverlayClick,
      scrollToBottom,
      onScroll,
      loadMoreMessages,
      toggleBurnAfterReadingMode,
      openVideoPage,
      acceptVideoCall,
      rejectVideoCall,
      handleSelfDestructMessage,
      initializeChat,
      handleBurnAfterReadingToggle,
      handleMessageDeleted,
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-page {
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

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.modal-content {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.modal button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  color: white;
  font-weight: bold;
}

.modal button[type="default"] {
  background-color: #4CAF50;
}

.modal button[type="warn"] {
  background-color: #f44336;
}
</style>

