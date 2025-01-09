// useMessageList.js - 消息列表相关的组合式函数
import { ref, computed, onMounted, onActivated } from 'vue'
import { useUserStore } from '@/store/userStore'
import { createDemoMessages, createCombinedMessages, createTotalMessageCount, createSystemMessage } from './messageUtils'
import { calculateScrollViewHeight } from './uiUtils'
import { fetchChatList } from './chatApi'

export function useMessageList() {
  // 使用用户存储
  const userStore = useUserStore()
  // 定义响应式变量
  const missionId = ref('') // 任务ID
  const realMessages = ref([]) // 实际消息列表
  const scrollViewHeight = ref(0) // 滚动视图高度
  const isLoading = ref(true) // 加载ref(true) // 加载状态

  // 使用工具函数创建响应式数据
  const demoMessages = createDemoMessages()
  const combinedMessages = createCombinedMessages(demoMessages, realMessages)
  const totalMessageCount = createTotalMessageCount(combinedMessages)
  const systemMessage = createSystemMessage()

  // 打开聊天页面
  const openChat = (message) => {
    const chatInfo = {
      id: message.id || message.userId,
      name: message.name || message.userName,
      avatar: message.avatar || '/static/message/默认头像.png',
      type: message.group ? 'group' : 'single',
      missionId: missionId.value
    }
    console.log('[openChat] 准备导航到聊天页面，chatInfo:', chatInfo);
    
    // 将聊天信息存储到本地，以备 eventChannel 失败时使用
    uni.setStorageSync('chatQuery', JSON.stringify(chatInfo));
    
    uni.navigateTo({
      url: '/pages/message/chat',
      success: (res) => {
        // 尝试通过 eventChannel 传递数据
        if (res.eventChannel && res.eventChannel.emit) {
          res.eventChannel.emit('chatInfo', { chatInfo });
          console.log('[openChat] 通过 eventChannel 发送 chatInfo');
        } else {
          console.warn('[openChat] eventChannel 不可用，将使用本地存储的数据');
        }
      },
      fail: (err) => {
        console.error('[openChat] 导航到聊天页面失败:', err);
        // uni.showToast({
        //   title: '打开聊天失败，请重试',
        //   icon: 'none'
        // });
      }
    });
  }

  // 加载消息列表
  const loadMessages = () => {
    missionId.value = userStore.state.missionId
    console.log('从 store 获取的 missionId:', missionId.value)
    scrollViewHeight.value = calculateScrollViewHeight()
    fetchChatList(missionId.value, isLoading, realMessages)
  }

  // 组件挂载时加载消息
  onMounted(loadMessages)
  
  // 组件激活时重新加载消息
  onActivated(() => {
    console.log('Messages 组件被激活')
    loadMessages()
  })

  // 返回需要在模板中使用的数据和方法
  return {
    combinedMessages,
    totalMessageCount,
    systemMessage,
    scrollViewHeight,
    isLoading,
    openChat
  }
}

