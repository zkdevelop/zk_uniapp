// useContacts.js - 联系人列表相关的组合式函数
import { ref, computed } from 'vue'
import { useContactsStore } from '../store/contactsStore'
import { useUserStore } from '@/store/userStore'
import { getMissionAddressBook } from '@/utils/api/message.js'

export function useContacts() {
  console.log('useContacts 组合式函数被调用')
  const contactsStore = useContactsStore()
  const userStore = useUserStore()
  const loading = ref(false)
  const isUpdating = ref(false)
  const showDropdown = ref(false)

  // 使用计算属性获取 missionId
  const missionId = computed(() => userStore.state.missionId[0])

  // 使用计算属性获取响应式数据
  const groupVOList = computed(() => contactsStore.groupVOList)
  const userInformationVOList = computed(() => contactsStore.userInformationVOList)

  // 计算 missionId
  const computedMissionId = computed(() => {
    return Array.isArray(userStore.state.missionId) 
      ? userStore.state.missionId.join(',') 
      : (userStore.state.missionId || '')
  })

  // 初始化联系人数据
  async function initContacts() {
    console.log('initContacts 函数被调用')
    if (loading.value) return
    
    loading.value = true
    try {
      // 从缓存加载历史数据
      loadCachedData()
      
      // 同时发送获取最新数据的请求
      fetchLatestData()
    } catch (error) {
      console.log('初始化联系人数据出错:', error)
    } finally {
      loading.value = false
    }
  }

  // 从缓存加载历史数据
  function loadCachedData() {
    const cachedData = uni.getStorageSync('contactsData')
    if (cachedData) {
      const parsedData = JSON.parse(cachedData)
      contactsStore.setGroupVOList(parsedData.groupVOList)
      contactsStore.setUserInformationVOList(parsedData.userInformationVOList)
      console.log('已加载缓存的联系人数据')
    }
  }

  // 获取最新数据并更新
  async function fetchLatestData() {
    if (!missionId.value) {
      console.log('等待 missionId 被设置')
      return
    }

    try {
      isUpdating.value = true
      const response = await getMissionAddressBook(missionId.value)
      if (response.code === 200) {
        const newData = response.data
        const hasChanges = compareData(newData)
        if (hasChanges) {
          updateData(newData)
          console.log('联系人���据已更新')
        } else {
          console.log('联系人数据无变化')
        }
      } else {
        throw new Error(response.msg || '获取通讯录失败')
      }
    } catch (error) {
      console.log('获取最新联系人数据出错:', error)
    } finally {
      isUpdating.value = false
    }
  }

  // 比较新旧数据
  function compareData(newData) {
    const oldGroupVOList = contactsStore.groupVOList
    const oldUserInformationVOList = contactsStore.userInformationVOList
    return JSON.stringify(newData.groupVOList) !== JSON.stringify(oldGroupVOList) ||
           JSON.stringify(newData.userInformationVOList) !== JSON.stringify(oldUserInformationVOList)
  }

  // 更新数据
  function updateData(newData) {
    contactsStore.setGroupVOList(newData.groupVOList)
    contactsStore.setUserInformationVOList(newData.userInformationVOList)
    // 更新缓存
    uni.setStorageSync('contactsData', JSON.stringify(newData))
  }

  // 切换下拉菜单
  const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
  }

  // 处理容器点击
  const handleContainerClick = () => {
    if (showDropdown.value) {
      showDropdown.value = false
    }
  }

  return {
    loading,
    isUpdating,
    missionId,
    groupVOList,
    userInformationVOList,
    computedMissionId,
    showDropdown,
    initContacts,
    toggleDropdown,
    handleContainerClick
  }
}

