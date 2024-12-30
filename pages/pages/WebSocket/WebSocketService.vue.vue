<template> 
</template>

<script>
import { ref } from 'vue'
import { backendHost } from '@/config.js'

export const useWebSocket = () => {
  const isConnected = ref(false)
  const reconnectAttempts = ref(0)
  const maxReconnectAttempts = 5
  const reconnectInterval = 5000 // 5 seconds

  const connect = (userId, token) => {
    console.log(token,'tokentokentokentoken')
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

    uni.connectSocket({
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

    uni.onSocketOpen((res) => {
      console.log('WebSocket 已连接', res)
      isConnected.value = true
      reconnectAttempts.value = 0
      startPingInterval()
    })

    uni.onSocketMessage((res) => {
      console.log('收到消息:', res.data)
      try {
        const message = JSON.parse(res.data)
        // 根据消息类型进行不同的处理
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
    })

    uni.onSocketError((res) => {
      console.error('WebSocket 错误:', res)
    })

    uni.onSocketClose((res) => {
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
    if (isConnected.value) {
      uni.closeSocket({
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
    if (isConnected.value) {
      uni.sendSocketMessage({
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
 