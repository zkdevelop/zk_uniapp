// useContacts.js - 联系人列表相关的组合式函数
import { ref, computed } from 'vue'
import { useContactsStore } from '../store/contactsStore'
import { useUserStore } from '@/store/userStore'
import { getMissionAddressBook } from '@/utils/api/message.js'
import { useRouter } from 'vue-router'  // 导入路由功能

export function useContacts() {
  console.log('useContacts 组合式函数被调用')
  const contactsStore = useContactsStore()
  const userStore = useUserStore()
  const loading = ref(false)
  const router = useRouter()  // 获取路由实例

  // 使用计算属性获取 missionId
  const missionId = computed(() => userStore.state.missionId[0])

  // 初始化联系人数据
  async function initContacts() {
    console.log('initContacts 函数被调用')
    // 如果正在加载或已经初始化，则直接返回
    if (loading.value || contactsStore.isInitialized) return
    // 检查是否有有效的 missionId
    if (!missionId.value) {
      console.log('等待 missionId 被设置')
      return
    }
    loading.value = true
    try {
      // 调用 API 获取通讯录数据
      const response = await getMissionAddressBook(missionId.value)
      if (response.code === 200) {
        // 更新 store 中的数据
        contactsStore.setGroupVOList(response.data.groupVOList)
        contactsStore.setUserInformationVOList(response.data.userInformationVOList)
        contactsStore.setInitialized(true)
      } else {
        throw new Error(response.msg || '获取通讯录失败')
      }
    } catch (error) {
      console.error('initContacts 出错:', error)
    } finally {
      loading.value = false
    }
  }

  // 新增：跳转到聊天界面的方法
  function navigateToChat(chatInfo) {
    // 使用路由导航到聊天页面，并传递必要的参数
    router.push({
      path: '/pages/message/chat',  // 聊天页面的路径，请根据实际路由配置调整
      query: {
        id: chatInfo.id,  // 聊天对象的ID
        name: chatInfo.name,  // 聊天对象的名称
        avatar: JSON.stringify(chatInfo.avatar),  // 头像数组，需要序列化
        type: chatInfo.type,  // 聊天类型（如单聊、群聊）
        missionId: chatInfo.missionId,  // 任务ID
        isBurnAfterReadingMode: chatInfo.isBurnAfterReadingMode  // 是否为阅后即焚模式
      }
    })
  }

  // 返回组合式函数的公开方法和属性
  return {
    loading,  // 加载状态
    missionId,  // 计算属性：当前的 missionId
    initContacts,  // 初始化联系人的方法
    navigateToChat  // 导航到聊天页面的方法
  }
}