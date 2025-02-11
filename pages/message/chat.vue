<template>
<view class="chat-page" @click="handlePageClick">
  <!-- 聊天头部 -->
  <ChatHeader :chat-info="chatInfo" @go-back="goBack" />

  <!-- 消息列表 -->
  <MessageList
    v-if="!isInitialLoading || hasCachedMessages"
    ref="messageListRef"
    :messages="list"
    :is-group="chatInfo.type === 'group'"
    @load-more="loadMoreMessages"
    @scroll="onScroll"
    :onMessageDeleted="handleMessageDeleted"
    @click="handleMessageListClick"
    class="message-list"
  />

  <!-- 加载动画 -->
  <LoadingAnimation v-if="isInitialLoading && !hasCachedMessages" />

  <!-- 聊天输入区域 -->
  <ChatInputArea 
    v-model:modelValue="showAttachMenu"
    @send-message="sendMessage"
    @message-failed="handleMessageFailed"
    @attach="handleAttachment"
    @video-call="openVideoPage"
    @file-selected="handleFileSelected"
    @toggle-burn-after-reading="handleBurnAfterReadingToggle"
    @message-sent="handleMessageSent"
    :recipientId="chatInfo.id"
    :missionId="chatInfo.missionId"
    :initial-burn-after-reading-mode="chatInfo.isBurnAfterReadingMode"
    ref="chatInputAreaRef"
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
		<VideoCallDialog/>
  </view>
</template>

<script>
import { ref, onMounted, nextTick, watch, onUnmounted, watchEffect } from 'vue'
import ChatHeader from './ChatComponent/ChatHeader.vue'
import MessageList from './ChatComponent/MessageList.vue'
import ChatInputArea from './ChatComponent/ChatInputArea.vue' 
import ScrollToBottomButton from './ChatComponent/ScrollToBottomButton.vue'
import LoadingAnimation from './ChatComponent/LoadingAnimation.vue'
import VideoCallDialog from './ChatComponent/VideoCallComponent/VideoCallDialog.vue';
import { getHistoryChatMessages, sendMessageToUser, sendFilesToUser, readSelfDestructMessage } from '@/utils/api/message.js'
import usePeerStore from '../../store/peer'
import useFriendStore from '../../store/friend'
import { useUserStore } from '@/store/userStore'
import { useChatInitialization } from './ChatComposables/useChatInitialization'
import { useMessageHandling } from './ChatComposables/useMessageHandling'
import { useUiInteractions } from './ChatComposables/useUiInteractions'
import { useSelfDestructMessageHandling } from './ChatComposables/useSelfDestructMessageHandling'
import { useChatDataManagement } from './ChatComposables/useChatDataManagement'

export default {
  name: 'Chat',
  components: {
    ChatHeader,
    MessageList,
    ChatInputArea, 
    ScrollToBottomButton,
    LoadingAnimation,
		VideoCallDialog
  },
  setup() {
    // 聊天信息
    const chatInfo = ref({
      id: '',
      name: '',
      avatar: '',
      type: 'single',
      missionId: '',
      isBurnAfterReadingMode: false
    })
    
    // 消息列表
    const list = ref([])
    // 是否显示附件菜单
    const showAttachMenu = ref(false)
    // 是否显示滚动到底部按钮
    const showScrollToBottom = ref(false)
    // 是否显示新消息提示
    const showNewMessageTip = ref(false)
    // 是否有新消息
    const hasNewMessages = ref(false)
    // 是否已滚动到底部
    const isScrolledToBottom = ref(true)
    // 当前消息加载范围
    const currentFrom = ref(0)
    const currentTo = ref(10)
    // 是否还有更多消息
    const hasMoreMessages = ref(true) 
    // 是否正在加载
    const isLoading = ref(false)
    
    // 存储
    const peerStore = usePeerStore()
    const friendStore = useFriendStore()
    const userStore = useUserStore()
		
    // 是否为阅后即焚模式
    const isBurnAfterReadingMode = ref(false)
    // 消息列表引用
    const messageListRef = ref(null)

  // 使用聊天初始化相关功能
  const {
    goBack,
    setupChatInfo
  } = useChatInitialization()

  // 使用消息处理相关功能
  const {
    sendMessage,
    handleMessageFailed,
    loadHistoryMessages,
    updateMessageList,
    handleFileSelected,
    handleMessageDeleted
  } = useMessageHandling(chatInfo, list, currentFrom, currentTo, hasMoreMessages, () => scrollToBottom())

  // 使用UI交互相关功能
  const {
    handleAttachment,
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
    loadHistoryMessages,
    showAttachMenu,
    hasMoreMessages
  })

  // 使用自毁消息处理相关功能
  const {
    handleSelfDestructMessage
  } = useSelfDestructMessageHandling()

  // 使用聊天数据管理相关功能
  const {
    loadCachedData,
    saveCachedData,
    fetchAndUpdateData,
    loadAndCacheGroupMembers,
    loadAndCacheUserInfo,
    initWebSocketListener,
    cleanupWebSocketListener
  } = useChatDataManagement(chatInfo, list)

  // 是否正在初始加载
  const isInitialLoading = ref(true)
  // 是否有缓存的消息
  const hasCachedMessages = ref(false)

  // 初始化聊天
  const initializeChat = async () => { 
    if (chatInfo.value && chatInfo.value.id) {
      isInitialLoading.value = true 
      const cachedData = await loadCachedData()
  
      if (cachedData) { 
        hasCachedMessages.value = true
        list.value = cachedData
        nextTick(() => {
          scrollToBottom() 
        })
      } else {
        hasCachedMessages.value = false
      }

      if (chatInfo.value.type === 'group') { 
        await loadAndCacheGroupMembers(chatInfo.value.id)
      } else { 
        await loadAndCacheUserInfo(chatInfo.value.id)
      }

      try {
        const newMessages = await fetchAndUpdateData()
        if (newMessages) {
          list.value = newMessages
          nextTick(() => {
            scrollToBottom() 
          })
        }
      } catch (error) {
        uni.showToast({
          title: '加载消息失败，请重试',
          icon: 'none'
        })
      }
      
      isInitialLoading.value = false
   
    } else {
      isInitialLoading.value = false
    }
  }

  // 处理阅后即焚模式切换
  const handleBurnAfterReadingToggle = (isActive) => {
    chatInfo.value.isBurnAfterReadingMode = isActive
  }

  // 监听聊天信息变化
  watch(chatInfo, async (newChatInfo) => { 
    if (newChatInfo && newChatInfo.id) {
      await initializeChat()
    }
  }, { deep: true, immediate: true })

  onMounted(() => { 
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1] 
    let eventChannel
    const query = uni.getStorageSync('chatQuery')

    if (currentPage && currentPage.$getAppWebview) {
      eventChannel = currentPage.$getAppWebview().eventChannel
    } else if (currentPage && currentPage.getOpenerEventChannel) {
      eventChannel = currentPage.getOpenerEventChannel()
    } else if (uni && uni.getEnterOptionsSync) {
      const enterOptions = uni.getEnterOptionsSync()
      eventChannel = enterOptions.eventChannel
    }

    const initializeChatFromData = (data) => {
      if (data && data.chatInfo) {
        chatInfo.value = {
          ...chatInfo.value,
          ...data.chatInfo
        }
        initializeChat()
      } else {
        isInitialLoading.value = false
        uni.showToast({
          title: '无法加载聊天信息',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 2000)
      }
    }

    if (eventChannel) {
      eventChannel.on('chatInfo', initializeChatFromData)
    } else if (query) {
      const parsedQuery = JSON.parse(query)
      initializeChatFromData({ chatInfo: parsedQuery })
    } else {
      isInitialLoading.value = false
      uni.showToast({
        title: '无法加载聊天信息',
        icon: 'none'
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 2000)
    }

    initWebSocketListener()
  })

  onUnmounted(() => {
    cleanupWebSocketListener()
  })

  // 处理消息列表点击
  const handleMessageListClick = (event) => {
    event.stopPropagation()
    showAttachMenu.value = false
  }

  // 处理页面点击
  const handlePageClick = (event) => {
    // 页面点击逻辑
  }

  // 处理消息发送完成
  const handleMessageSent = () => { 
    nextTick(() => {
      if (messageListRef.value) {
        messageListRef.value.scrollToBottom(true)
      }
    })
  }

  const toggleAttachMenu = (value) => {
    showAttachMenu.value = value
  }

  // 视频通话相关功能
  const openVideoPage = () => {
    // 打开视频页面的逻辑
  }

  const acceptVideoCall = () => {
    // 接受视频通话的逻辑
  }

  const rejectVideoCall = () => {
    // 拒绝视频通话的逻辑
  }

  return {
    chatInfo,
    list,
    showAttachMenu,
    showScrollToBottom,
    showNewMessageTip,
    hasNewMessages,
    isScrolledToBottom,
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
    loadCachedData,
    saveCachedData,
    fetchAndUpdateData,
    loadAndCacheGroupMembers,
    loadAndCacheUserInfo,
    isInitialLoading,
    hasCachedMessages,
    handleMessageListClick,
    handleMessageSent,
    handlePageClick,
    toggleAttachMenu
  }
},
watch: {
  showAttachMenu: (newValue) => {
    // showAttachMenu 变化时的处理逻辑
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

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1002;
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

.message-list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #F6F6F6;
}
</style>

