import { ref, computed, onMounted, onActivated } from 'vue'
import { useUserStore } from '@/store/userStore'
import { useMainInterfaceStore } from '../store/mainInterfaceStore'
import { createDemoMessages, createCombinedMessages, createTotalMessageCount, createSystemMessage } from './messageUtils'
import { calculateScrollViewHeight } from './uiUtils'
import { fetchChatList } from './chatApi'

export function useMessageList() {
  const userStore = useUserStore()
  const mainInterfaceStore = useMainInterfaceStore()

  const missionId = ref('')
  const realMessages = ref([])
  const scrollViewHeight = ref(0)
  const isLoading = ref(false)

  const demoMessages = createDemoMessages()
  const combinedMessages = createCombinedMessages(demoMessages, realMessages)
  const totalMessageCount = createTotalMessageCount(combinedMessages)
  const systemMessage = createSystemMessage()

  const openChat = (message) => {
    const chatInfo = {
      id: message.id || message.userId,
      name: message.name || message.userName,
      avatar: message.avatar || '/static/message/默认头像.png',
      type: message.group ? 'group' : 'single',
      missionId: missionId.value
    }
    console.log('准备导航到聊天页面，chatInfo:', chatInfo);
    
    uni.setStorageSync('chatQuery', JSON.stringify(chatInfo));
    
    uni.navigateTo({
      url: '/pages/message/chat',
      success: (res) => {
        if (res.eventChannel && res.eventChannel.emit) {
          res.eventChannel.emit('chatInfo', { chatInfo });
          console.log('通过 eventChannel 发送 chatInfo');
        } else {
          console.log('eventChannel 不可用，将使用本地存储的数据');
        }
      },
      fail: (err) => {
        console.log('导航到聊天页面失败:', err);
      }
    });
  }

  const loadMessages = async () => {
    missionId.value = userStore.state.missionId
    console.log('从 store 获取的 missionId:', missionId.value)
    scrollViewHeight.value = calculateScrollViewHeight()

    // 直接加载缓存数据
    if (mainInterfaceStore.isInitialized) {
      realMessages.value = mainInterfaceStore.getCachedMessages()
    }

    // 发送获取初始化数据的路由
    fetchAndUpdateMessages()
  }

  const fetchAndUpdateMessages = async () => {
    try {
      const newMessages = await fetchChatList(missionId.value)
      if (newMessages) {
        // 比较新数据和缓存数据
        const hasChanges = compareMessages(newMessages, realMessages.value)
        if (hasChanges) {
          // 更新缓存和界面
          mainInterfaceStore.setCachedMessages(newMessages)
          realMessages.value = newMessages
          console.log('消息列表已更新');
        } else {
          console.log('消息列表无变化');
        }
      }
    } catch (error) {
      console.log('获取聊天列表失败:', error)
    }
  }

  const compareMessages = (newMessages, oldMessages) => {
    if (newMessages.length !== oldMessages.length) return true
    for (let i = 0; i < newMessages.length; i++) {
      if (JSON.stringify(newMessages[i]) !== JSON.stringify(oldMessages[i])) {
        return true
      }
    }
    return false
  }

  onMounted(loadMessages)
  
  onActivated(() => {
    console.log('消息组件被激活')
    loadMessages()
  })

  return {
    combinedMessages,
    totalMessageCount,
    systemMessage,
    scrollViewHeight,
    isLoading,
    openChat
  }
}

