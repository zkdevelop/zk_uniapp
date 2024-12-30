// messageUtils.js - 消息处理相关的工具函数

import { ref, computed } from 'vue'
import { getCurrentDate, formatDate, formatTime } from './dateUtils'

// 创建演示消息数据
export const createDemoMessages = () => ref([
  {
    id: '1',
    name: '张三',
    avatar: ['/static/avatar/avatar1.png'],
    preview: '你好，最近怎么样？',
    date: '2024-11-25T10:00:00',
    type: 'single',
    unreadCount: 2
  },
  {
    id: '2',
    name: '项目讨论群',
    avatar: ['/static/avatar/group1.png', '/static/avatar/group2.png', '/static/avatar/group3.png'],
    preview: '下周一开会，请大家准时参加',
    date: '2024-11-24T15:30:00',
    type: 'group',
    unreadCount: 5
  }
])

// 合并演示消息和实际消息
export const createCombinedMessages = (demoMessages, realMessages) => 
  computed(() => [...demoMessages.value, ...realMessages.value])

// 计算总消息数（包括未读消息）
export const createTotalMessageCount = (combinedMessages) => 
  computed(() => {
    const totalUnread = combinedMessages.value.reduce((sum, message) => sum + (message.unreadCount || 0), 0)
    return combinedMessages.value.length + totalUnread
  })

// 创建系统消息
export const createSystemMessage = () => 
  computed(() => ({
    title: '推送消息',
    preview: '系统版本更新',
    date: getCurrentDate(),
    notificationCount: Math.floor(Math.random() * 20) + 1 // 随机生成1-20的未读数
  }))

// 获取头像源
export const getAvatarSrc = (avatar, defaultAvatarPath) => {
  return Array.isArray(avatar) ? avatar[0] : (avatar || defaultAvatarPath)
}

