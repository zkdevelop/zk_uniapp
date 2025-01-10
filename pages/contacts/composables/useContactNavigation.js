// useContactNavigation.js - 处理联系人页面的导航相关功能
import { useRouter } from 'vue-router'

export function useContactNavigation() {
  const router = useRouter()

  // 处理搜索
  const handleSearch = () => {
    console.log('搜索按钮被点击')
    // 实现搜索功能
  }

  // 处理发起群聊
  const handleGroupChat = () => {
    console.log('发起群聊被点击')
    router.push('/pages/contacts/pages/contacts/create-group-chat/index')
  }

  // 处理添加朋友
  const handleAddFriend = () => {
    console.log('添加朋友被点击')
    // 实现添加朋友功能
  }

  // 进入群聊
  const enterGroupChat = (group, missionId) => {
    console.log('正在跳转到群聊界面:', group)
    const chatInfo = {
      id: group.id,
      name: group.groupName,
      avatar: group.avatar || '/static/default-group-avatar.png',
      type: 'group',
      missionId: missionId,
      isBurnAfterReadingMode: false
    }

    router.push({
      path: '/pages/message/chat',
      query: { chatInfo: JSON.stringify(chatInfo) }
    })
  }

  // 选择用户
  const selectUser = (user, missionId) => {
    console.log('选择用户:', user)
    const userString = encodeURIComponent(JSON.stringify(user))
    router.push(`/pages/contacts/components/ContactDetail/ContactDetailView?user=${userString}&missionId=${missionId}`)
  }

  return {
    handleSearch,
    handleGroupChat,
    handleAddFriend,
    enterGroupChat,
    selectUser
  }
}

