// 导入所需的函数和模块
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义并导出主界面存储
export const useMainInterfaceStore = defineStore('mainInterface', () => {
  // 用于存储缓存的消息
  const cachedMessages = ref([])
  // 记录最后更新时间
  const lastUpdateTime = ref(null)
  // 标记存储是否已初始化
  const isInitialized = ref(false)

  // 设置缓存的消息
  function setCachedMessages(messages) {
    cachedMessages.value = messages
    lastUpdateTime.value = Date.now()
    isInitialized.value = true
  }

  // 获取缓存的消息
  function getCachedMessages() {
    return cachedMessages.value
  }

  // 更新缓存的消息
  function updateCachedMessages(newMessages) {
    // 比较并只更新变化的消息
    newMessages.forEach((newMsg) => {
      const index = cachedMessages.value.findIndex((msg) => msg.id === newMsg.id)
      if (index !== -1) {
        // 更新现有消息
        cachedMessages.value[index] = { ...cachedMessages.value[index], ...newMsg }
      } else {
        // 添加新消息
        cachedMessages.value.push(newMsg)
      }
    })
    lastUpdateTime.value = Date.now()
  }

  // 清除缓存
  function clearCache() {
    cachedMessages.value = []
    lastUpdateTime.value = null
    isInitialized.value = false
  }

  // 返回存储的状态和方法
  return {
    cachedMessages,
    lastUpdateTime,
    isInitialized,
    setCachedMessages,
    getCachedMessages,
    updateCachedMessages,
    clearCache
  }
})

