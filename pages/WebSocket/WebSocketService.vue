<template>
</template>

<script>
import { ref, onUnmounted } from 'vue'
import { backendHost } from '@/config.js'

export const useWebSocket = () => {
  const isConnected = ref(false)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const reconnectInterval = 5000 // 5 seconds
  let socket = null

  const connect = (userId, token) => {
    console.log(token, 'tokentokentokentoken')
    if (!userId || !token) {
      console.error('WebSocket 连接失败: userId 或 token 未提供', { userId, token })
      return
    }

    if (isConnected.value) {
      console.log('WebSocket 已经连接')
      return
    }

    const wsProtocol = backendHost.startsWith('https') ? 'wss' : 'ws'
    const wsUrl = `${wsProtocol}://${backendHost.split('://')[1]}/chat/${userId}`
    
    console.log('尝试连接 WebSocket:', wsUrl)

    socket = uni.connectSocket({
      url: wsUrl,
      header: {
        'content-type': 'application/json'
      },
      protocols: [token],
      success: () => {
        console.log('WebSocket 连接成功')
      },
      fail: (error) => {
        console.error('WebSocket 连接失败:', error)
      }
    })

    socket.onOpen(() => {
      console.log('WebSocket 已连接')
      isConnected.value = true
      reconnectAttempts.value = 0
      startPingInterval()
    })

    socket.onMessage((res) => {
      console.log('收到消息:', res.data)
      try {
        const message = JSON.parse(res.data)
        handleMessage(message)
      } catch (error) {
        console.error('解析消息失败:', error)
      }
    })

    socket.onError((res) => {
      console.error('WebSocket 错误:', res)
    })

    socket.onClose((res) => {
      console.log('WebSocket 已断开', res)
      isConnected.value = false
      stopPingInterval()
      
      if (reconnectAttempts.value < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.value), 30000)
        console.log(`将在 ${delay}ms 后尝试重新连接...`)
        setTimeout(() => {
          console.log(`尝试重新连接... (${reconnectAttempts.value + 1}/${maxReconnectAttempts})`)
          reconnectAttempts.value++
          connect(userId, token)
        }, delay)
      } else {
        console.error('WebSocket 重连失败，请检查网络连接或联系管理员')
      }
    })
  }

  const disconnect = () => {
    if (isConnected.value && socket) {
      socket.close({
        success: () => {
          console.log('WebSocket 已关闭')
          isConnected.value = false
          reconnectAttempts.value = 0
          stopPingInterval()
        }
      })
    }
  }

  const sendMessage = (message) => {
    if (isConnected.value && socket) {
      socket.send({
        data: JSON.stringify(message),
        success: () => {
          console.log('消息发送成功')
        },
        fail: (error) => {
          console.error('消息发送失败:', error)
        }
      })
    } else {
      console.error('WebSocket 未连接，无法发送消息')
    }
  }

  const handleMessage = (message) => {
    switch (message.type) {
      case 'auth':
        if (message.status === 'success') {
          console.log('认证成功')
        } else {
          console.error('认证失败:', message.error)
          disconnect()
        }
        break
      case 'chat':
        // 处理聊天消息
        uni.$emit('newChatMessage', message)
        break
      case 'notification':
        // 处理通知消息
        uni.$emit('newNotification', message)
        break
      case 'pong':
        console.log('收到服务器的 pong 响应')
        break
      default:
        console.log('未知消息类型:', message)
		uni.$emit('newChatMessage', message)
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

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage
  }
}
</script>