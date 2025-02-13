// useContacts.js - 联系人列表相关的组合式函数
import { ref, watch } from 'vue'
import { useContactsStore } from '../store/contactsStore'
import { useUserStore } from '@/store/userStore'
import { getMissionAddressBook } from '@/utils/api/message.js'

export function useContacts() {
  console.log('useContacts composable called')
  const contactsStore = useContactsStore()
  const userStore = useUserStore()
  const loading = ref(false)
  const missionId = ref(userStore.state.missionId[0])

  // 监听 userStore 中的 missionId 变化
  watch(() => userStore.state.missionId[0], (newMissionId) => {
    console.log('useContacts: missionId changed to', newMissionId)
    missionId.value = newMissionId
  }, { immediate: true })

  // 初始化联系人数据
  async function initContacts() {
    console.log('initContacts function called')
    if (loading.value || contactsStore.isInitialized) return
    if (!missionId.value) {
      console.log('Waiting for missionId to be set')
      return
    }
    loading.value = true
    try {
      console.log('获取任务id:', missionId.value)
      const response = await getMissionAddressBook(missionId.value)
      if (response.code === 200) {
        contactsStore.setGroupVOList(response.data.groupVOList)
        contactsStore.setUserInformationVOList(response.data.userInformationVOList)
        contactsStore.setInitialized(true)
        console.log('Contacts initialized successfully')
      } else {
        throw new Error(response.msg || '获取通讯录失败')
      }
    } catch (error) {
      console.error('initContacts 出错:', error)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    missionId,
    initContacts
  }
}

