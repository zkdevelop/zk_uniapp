<template>
  <view class="chat-page">
    <!-- 聊天头部 -->
    <ChatHeader :chat-info="chatInfo" @go-back="goBack" />

    <!-- 消息列表 -->
    <MessageList
      v-if="!isInitialLoading || hasCachedMessages"
      ref="messageListRef"
      :messages="list"
      :is-group="chatInfo && chatInfo.type === 'group'"
      @load-more="loadMoreMessages"
      @scroll="onScroll"
      @message-deleted="handleMessageDeleted"
    />

    <!-- 加载动画 -->
    <LoadingAnimation v-if="isInitialLoading && !hasCachedMessages" />

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
import LoadingAnimation from './ChatComponent/LoadingAnimation.vue'
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
    ScrollToBottomButton,
    LoadingAnimation
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
    // UI 状态
    const showAttachMenu = ref(false)
    const showScrollToBottom = ref(false)
    const showNewMessageTip = ref(false)
    const hasNewMessages = ref(false)
    const isScrolledToBottom = ref(true)
    // 分页加载相关
    const currentFrom = ref(0)
    const currentTo = ref(10)
    const hasMoreMessages = ref(true) 
    const isLoading = ref(false)
    
    // 存储
    const peerStore = usePeerStore()
    const friendStore = useFriendStore()
    const userStore = useUserStore()
    
    // 阅后即焚模式
    const isBurnAfterReadingMode = ref(false)
    // 消息列表引用
    const messageListRef = ref(null)

    // 聊天初始化
    const {
      goBack,
      setupChatInfo
    } = useChatInitialization()

    // 消息处理
    const {
      sendMessage,
      handleMessageFailed,
      loadHistoryMessages,
      updateMessageList,
      handleFileSelected,
      handleMessageDeleted
    } = useMessageHandling(chatInfo, list, currentFrom, currentTo, hasMoreMessages, () => scrollToBottom())

    // UI 交互
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

    // 视频通话处理
    const {
      openVideoPage,
      acceptVideoCall,
      rejectVideoCall
    } = useVideoCallHandling()

    // 自毁消息处理
    const {
      handleSelfDestructMessage
    } = useSelfDestructMessageHandling()

    // 聊天数据管理
    const {
      loadCachedData,
      saveCachedData,
      fetchAndUpdateData
    } = useChatDataManagement(chatInfo, list)

    // 初始加载状态
    const isInitialLoading = ref(true)
    const hasCachedMessages = ref(false)

    // 初始化聊天
    const initializeChat = async () => {
      console.log('开始初始化聊天')
      if (chatInfo.value && chatInfo.value.id) {
        isInitialLoading.value = true
        console.log('尝试加载缓存数据')
        const cachedData = await loadCachedData()
        
        if (chatInfo.value.type === 'group') {
          await fetchAndUpdateData()
        }
        
        if (cachedData) {
          console.log('找到缓存数据，长度:', cachedData.length)
          hasCachedMessages.value = true
          list.value = cachedData
          nextTick(() => {
            scrollToBottom()
            console.log('使用缓存数据后滚动到底部')
          })
        } else {
          console.log('没有找到缓存数据')
          hasCachedMessages.value = false
        }

        console.log('开始加载历史消息')
        try {
          await loadHistoryMessages()
        } catch (error) {
          console.log('加载历史消息失败:', error)
          uni.showToast({
            title: '加载消息失败，请重试',
            icon: 'none'
          })
        }
        console.log('历史消息加载完成')
        
        isInitialLoading.value = false
        console.log('初始加载完成，isInitialLoading 设置为 false')

        nextTick(() => {
          scrollToBottom()
          console.log('加载历史消息后滚动到底部')
        })

        console.log('开始异步更新数据')
        fetchAndUpdateData()

        console.log('聊天初始化完成:', {
          缓存数据: !!cachedData,
          缓存数据长度: cachedData ? cachedData.length : 0,
          历史消息长度: list.value.length
        })
      } else {
        console.log('聊天信息无效，无法初始化')
      }
    }

    // 处理阅后即焚模式切换
    const handleBurnAfterReadingToggle = (isActive) => {
      chatInfo.value.isBurnAfterReadingMode = isActive
      console.log('阅后即焚模式切换:', isActive)
    }

    // 监听聊天信息变化
    watch(chatInfo, async (newChatInfo) => {
      console.log('聊天信息变化:', newChatInfo)
      if (newChatInfo && newChatInfo.id) {
        await initializeChat()
      }
    }, { deep: true, immediate: true })

    // 组件挂载
    onMounted(() => {
      console.log('聊天组件挂载')
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

      if (eventChannel) {
        console.log('找到事件通道，设置聊天信息')
        setupChatInfo(eventChannel, {
          chatInfo,
          loadHistoryMessages: async () => {
            console.log('通过事件通道加载历史消息')
            await loadHistoryMessages()
          },
          $nextTick: nextTick,
          scrollToBottom: () => {
            console.log('通过事件通道滚动到底部')
            scrollToBottom()
          }
        })
      } else {
        console.log('未找到事件通道，尝试从存储加载聊天信息')
        if (query) {
          console.log('从存储中找到聊天信息')
          const parsedQuery = JSON.parse(query)
          chatInfo.value = {
            ...chatInfo.value,
            ...parsedQuery
          }
          console.log('使用存储的聊天信息初始化聊天')
          initializeChat()
        } else {
          console.log('无法加载聊天信息')
          uni.showToast({
            title: '无法加载聊天信息',
            icon: 'none'
          })
          setTimeout(() => {
            console.log('无法加载聊天信息，返回上一页')
            uni.navigateBack()
          }, 2000)
        }
      }
      console.log('聊天组件挂载完成:', {
        有事件通道: !!eventChannel,
        存储中有聊天信息: !!query
      })
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
      isInitialLoading,
      hasCachedMessages,
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

