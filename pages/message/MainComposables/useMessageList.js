import { ref, onMounted, onActivated } from "vue"
import { useUserStore } from "@/store/userStore"
import { useMainInterfaceStore } from "../store/mainInterfaceStore"
import {
  createDemoMessages,
  createCombinedMessages,
  createTotalMessageCount,
  createSystemMessage,
} from "./messageUtils"
import { calculateScrollViewHeight } from "./uiUtils"
import { fetchChatList } from "./chatApi" 

export function useMessageList() {
  const userStore = useUserStore()
  const mainInterfaceStore = useMainInterfaceStore()

  const missionId = ref("")
  const realMessages = ref([])
  const scrollViewHeight = ref(0)
  const isLoading = ref(false)

  const demoMessages = createDemoMessages()
  const combinedMessages = createCombinedMessages(demoMessages, realMessages)
  const totalMessageCount = createTotalMessageCount(combinedMessages)
  const systemMessage = createSystemMessage()

  // 打开聊天页面的函数
  const openChat = (message) => {
    const chatInfo = {
      id: message.group ? message.groupId : message.id || message.userId,
      name: message.group ? message.groupName : message.name || message.userName,
      avatar: message.avatarUrl || "/static/message/defaultimg.png",
      type: message.group ? "group" : "single",
      missionId: missionId.value,
    }

    uni.setStorageSync("chatQuery", JSON.stringify(chatInfo))

    uni.navigateTo({
      url: "/pages/message/chat",
      success: (res) => {
        if (res.eventChannel && res.eventChannel.emit) {
          res.eventChannel.emit("chatInfo", { chatInfo })
          console.log("通过 eventChannel 发送 chatInfo")
        } else {
          console.log("eventChannel 不可用，将使用本地存储的数据")
        }
      },
      fail: (err) => {
        console.log("导航到聊天页面失败:", JSON.stringify(err))
      },
    })
  }

  // 加载消息列表
  const loadMessages = async () => {
    missionId.value = userStore.state.missionId
    scrollViewHeight.value = calculateScrollViewHeight()

    // 直接加载缓存数据
    if (mainInterfaceStore.isInitialized) {
      realMessages.value = mainInterfaceStore.getCachedMessages()
    }

    // 发送获取初始化数据的路由
    await fetchAndUpdateMessages()
  }

  // 获取并更新消息
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
        } else {
          console.log("消息列表无变化")
        }
      }
    } catch (error) {
      console.log("获取聊天列表失败:", JSON.stringify(error))
    }
  }

  // 比较消息列表
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
    console.log("消息组件被激活")
    loadMessages()
  })

  return {
    combinedMessages,
    totalMessageCount,
    systemMessage,
    scrollViewHeight,
    isLoading,
    openChat,
    fetchAndUpdateMessages,
  }
}

