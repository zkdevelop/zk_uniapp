import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/userStore'

export function useContactNavigation() {
const router = useRouter()
const userStore = useUserStore()

const handleSearch = () => {
  console.log('搜索按钮被点击')
}

const handleGroupChat = () => {
  console.log('发起群聊被点击')
  router.push('/pages/contacts/pages/contacts/create-group-chat/index')
}

const handleAddFriend = () => {
  console.log('添加朋友被点击')
}

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

  uni.navigateTo({
    url: '/pages/message/chat',
    success: (res) => {
      if (res.eventChannel && res.eventChannel.emit) {
        res.eventChannel.emit('chatInfo', { chatInfo })
        console.log('通过 eventChannel 发送 chatInfo')
      } else {
        console.log('eventChannel 不可用，将使用本地存储的数据')
        uni.setStorageSync('chatQuery', JSON.stringify(chatInfo))
      }
    },
    fail: (err) => {
      console.error('导航到聊天页面失败:', err)
    }
  })
}

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

