<template>
  <view class="chat-page">
    <!-- 聊天头部 -->
    <ChatHeader :chat-info="chatInfo" @go-back="goBack" />

    <!-- 消息列表 -->
    <MessageList
      ref="messageListRef"
      :messages="list"
      :is-group="chatInfo && chatInfo.type === 'group'"
      @load-more="loadMoreMessages"
      @scroll="onScroll"
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
      :recipientId="chatInfo && chatInfo.id || ''"
      :missionId="chatInfo && chatInfo.missionId"
      :initial-burn-after-reading-mode="chatInfo && chatInfo.isBurnAfterReadingMode"
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
import { ref, onMounted, nextTick, watch } from 'vue'
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
import { useChatDataManagement } from './ChatComposables/useChatDataManagement'

export default {
  name: 'Chat',
  components: {
    ChatHeader,
    MessageList,
    ChatInputArea, 
    ScrollToBottomButton
  },
  setup() {
    const chatInfo = ref({
      id: '',
      name: '',
      avatar: '',
      type: 'single',
      missionId: '',
      isBurnAfterReadingMode: false
    })
    
    const list = ref([])
    const showAttachMenu = ref(false)
    const showScrollToBottom = ref(false)
    const showNewMessageTip = ref(false)
    const hasNewMessages = ref(false)
    const isScrolledToBottom = ref(true)
    const currentFrom = ref(0)
    const currentTo = ref(10)
    const hasMoreMessages = ref(true) 
    const isLoading = ref(false)
    
    const peerStore = usePeerStore()
    const friendStore = useFriendStore()
    const userStore = useUserStore()
    
    const isBurnAfterReadingMode = ref(false)
    const messageListRef = ref(null)

    const {
      goBack,
      setupChatInfo
    } = useChatInitialization()

    const {
      sendMessage,
      handleMessageFailed,
      loadHistoryMessages,
      updateMessageList,
      handleFileSelected,
      handleMessageDeleted
    } = useMessageHandling(chatInfo, list, currentFrom, currentTo, hasMoreMessages, () => scrollToBottom())

    const {
      handleAttachment,
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
      loadHistoryMessages,
      showAttachMenu,
      hasMoreMessages
    })

    const {
      openVideoPage,
      acceptVideoCall,
      rejectVideoCall
    } = useVideoCallHandling()

    const {
      handleSelfDestructMessage
    } = useSelfDestructMessageHandling()

    const {
      loadCachedData,
      saveCachedData,
      fetchAndUpdateData
    } = useChatDataManagement(chatInfo, list)

    const initializeChat = async () => {
      console.log('开始初始化聊天')
      if (chatInfo.value && chatInfo.value.id) {
        console.log('尝试从缓存加载数据')
        const cachedData = await loadCachedData()
        if (cachedData) {
          console.log('成功从缓存加载数据，数据长度:', cachedData.length)
          list.value = cachedData
          nextTick(() => {
            console.log('缓存数据加载完成，滚动到底部')
            scrollToBottom()
          })
        } else {
          console.log('缓存中没有数据')
        }

        console.log('开始从服务器加载历史消息')
        await loadHistoryMessages()
        console.log('历史消息加载完成，消息数量:', list.value.length)
        nextTick(() => {
          console.log('历史消息渲染完成，滚动到底部')
          scrollToBottom()
        })

        console.log('异步获取最新数据')
        fetchAndUpdateData()
      } else {
        console.log('聊天信息尚未准备好，等待设置')
      }
    }

    const handleBurnAfterReadingToggle = (isActive) => {
      console.log('阅后即焚模式切换:', isActive)
      chatInfo.value.isBurnAfterReadingMode = isActive
    }

    watch(chatInfo, async (newChatInfo) => {
      console.log('聊天信息已更新:', newChatInfo)
      if (newChatInfo && newChatInfo.id) {
        console.log('检测到有效的聊天信息，开始初始化聊天')
        await initializeChat()
      }
    }, { deep: true, immediate: true })

    onMounted(() => {
      console.log('聊天组件已挂载')
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      if (currentPage && currentPage.$page && currentPage.$page.fullPath) {
        console.log('当前页面路径:', currentPage.$page.fullPath)
      }
      
      let eventChannel
      if (currentPage && currentPage.$getAppWebview) {
        eventChannel = currentPage.$getAppWebview().eventChannel
      } else if (currentPage && currentPage.getOpenerEventChannel) {
        eventChannel = currentPage.getOpenerEventChannel()
      } else if (uni && uni.getEnterOptionsSync) {
        const enterOptions = uni.getEnterOptionsSync()
        eventChannel = enterOptions.eventChannel
      }

      if (eventChannel) {
        console.log('成功获取 eventChannel，开始设置聊天信息')
        setupChatInfo(eventChannel, {
          chatInfo,
          loadHistoryMessages: async () => {
            console.log('开始加载历史消息')
            await loadHistoryMessages()
            console.log('历史消息加载完成')
          },
          $nextTick: nextTick,
          scrollToBottom: () => {
            console.log('滚动到底部')
            scrollToBottom()
          }
        })
      } else {
        console.log('无法获取 eventChannel，尝试其他初始化方法')
        const query = uni.getStorageSync('chatQuery')
        if (query) {
          console.log('从存储中获取聊天信息:', query)
          const parsedQuery = JSON.parse(query)
          chatInfo.value = {
            ...chatInfo.value,
            ...parsedQuery
          }
          console.log('更新后的聊天信息:', JSON.stringify(chatInfo.value))
          initializeChat()
        } else {
          console.log('无法初始化聊天，缺少必要信息')
          uni.showToast({
            title: '无法加载聊天信息',
            icon: 'none'
          })
          setTimeout(() => {
            console.log('无法加载聊天信息，准备返回上一页')
            uni.navigateBack()
          }, 2000)
        }
      }
    })

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
      loadCachedData,
      saveCachedData,
      fetchAndUpdateData,
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

