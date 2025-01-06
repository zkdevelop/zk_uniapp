// useContacts.js - 联系人列表相关的组合式函数
import { ref, watch } from 'vue'
import { useContactsStore } from '../store/contactsStore'
import { useUserStore } from '@/store/userStore'
import { getMissionAddressBook } from '@/utils/api/message.js'

export function useContacts() {
  console.log('使用联系人组合函数被调用')
  const contactsStore = useContactsStore()
  const userStore = useUserStore()
  const loading = ref(false)
  const missionId = ref(userStore.state.missionId[0])

  // 监听用户存储中的任务ID变化
  watch(() => userStore.state.missionId[0], (newMissionId) => {
    console.log('使用联系人：任务ID变更为', newMissionId)
    if (newMissionId) {
      // 如果newMissionId是数组，取第一个元素；否则直接使用newMissionId
      missionId.value = Array.isArray(newMissionId) ? newMissionId[0] : newMissionId
      if (!loading.value) {
        initContacts()
      }
    }
  }, { immediate: true })

  // 初始化联系人数据
  async function initContacts() {
    console.log('初始化联系人函数被调用')
    if (loading.value) {
      console.log('正在加载中，跳过初始化')
      return
    }
    if (!missionId.value) {
      console.log('等待任务ID设置')
      return
    }

    loading.value = true
    try {
      console.log('正在获取联系人，任务ID:', missionId.value)
      const response = await getMissionAddressBook(missionId.value)
      if (response.code === 200) {
        // 使用空数组作为默认值，以防返回的数据为undefined
        contactsStore.setGroupVOList(response.data.groupVOList || [])
        contactsStore.setUserInformationVOList(response.data.userInformationVOList || [])
        console.log('联系人初始化成功')
      } else {
        throw new Error(response.msg || '获取通讯录失败')
      }
    } catch (error) {
      console.error('初始化联系人出错:', error)
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

