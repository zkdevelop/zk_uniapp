<template>
  <!-- 这是一个空模板，因为这是一个服务文件 -->
</template>

<script>
import { ref } from 'vue'
import { backendHost } from '@/config.js'

export const useWebSocket = () => {
  const ws = ref(null)
  const isConnected = ref(false)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const reconnectInterval = 5000 // 5 seconds

  const connect = (userId) => {
    if (!userId) {
      console.error('WebSocket 连接失败: userId 未提供', { userId })
      return
    }

    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      console.log('WebSocket 已经连接')
      return
    }

    const wsProtocol = backendHost.startsWith('https') ? 'wss' : 'ws'
    const wsUrl = `${wsProtocol}://${backendHost.split('://')[1]}/communicate/chat/${userId}`
    
    console.log('尝试连接 WebSocket:', wsUrl)

    try {
      ws.value = new WebSocket(wsUrl)

      ws.value.onopen = (event) => {
        console.log('WebSocket 已连接', event)
        isConnected.value = true
        reconnectAttempts.value = 0
        startPingInterval()
      }

      ws.value.onmessage = (event) => {
        console.log('收到消息:', event.data)
        try {
          const message = JSON.parse(event.data)
          // 根据消息类型进行不同的处理
          switch (message.type) {
            case 'chat':
              // 处理聊天消息
              break
            case 'notification':
              // 处理通知消息
              break
            case 'pong':
              console.log('收到服务器的 pong 响应')
              break
            default:
              console.log('未知消息类型:', message.type)
          }
        } catch (error) {
          console.error('解析消息失败:', error)
        }
      }

      ws.value.onerror = (error) => {
        console.error('WebSocket 错误:', error)
        console.log('WebSocket URL:', wsUrl)
        console.log('ReadyState:', ws.value.readyState)
        console.log('UserId:', userId)
        if (error instanceof Event && error.target instanceof WebSocket) {
          console.log('错误时的 ReadyState:', error.target.readyState)
        }
      }

      ws.value.onclose = (event) => {
        console.log('WebSocket 已断开', event)
        console.log('关闭代码:', event.code)
        console.log('关闭原因:', event.reason)
        isConnected.value = false
        stopPingInterval()
        
        if (reconnectAttempts.value < maxReconnectAttempts) {
          setTimeout(() => {
            console.log(`尝试重新连接... (${reconnectAttempts.value + 1}/${maxReconnectAttempts})`)
            reconnectAttempts.value++
            connect(userId)
          }, reconnectInterval)
        } else {
          console.error('WebSocket 重连失败，请检查网络连接或联系管理员')
        }
      }
    } catch (error) {
      console.error('创建 WebSocket 实例时发生错误:', error)
    }
  }

  const disconnect = () => {
    if (ws.value) {
      ws.value.close()
      ws.value = null
      isConnected.value = false
      reconnectAttempts.value = 0
      stopPingInterval()
    }
  }

  const sendMessage = (message) => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      ws.value.send(JSON.stringify(message))
    } else {
      console.error('WebSocket 未连接，无法发送消息')
    }
  }

  const ping = () => {
    sendMessage({ type: 'ping' })
  }

  let pingInterval
  const startPingInterval = () => {
    pingInterval = setInterval(() => {
      ping()
    }, 30000) // 每30秒发送一次 ping
  }

  const stopPingInterval = () => {
    if (pingInterval) {
      clearInterval(pingInterval)
    }
  }

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage
  }
}
</script>

<style scoped>
/* 这个文件不需要样式 */
</style>