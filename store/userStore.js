// @/store/userStore.js
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useUserStore = defineStore('user', () => {
  const state = reactive({
    id: '',
    account: '',
    name: '',
    department: '',
    role: '',
    phone: '',
    created: '',
    avatar: null,
    avatarUrl: '',
    token: '',
    status: '',
    missionId: '',
    groupInfo: null  // 新增：用于存储群组信息
  })

  function setUserData(data) {
    console.log('设置用户数据:', data)
    Object.keys(data).forEach(key => {
      if (key in state) {
        state[key] = data[key]
      }
    })
    console.log('更新后的状态:', state)
  }

  function setGroupInfo(groupData) {
    console.log('设置群组信息:', groupData)
    state.groupInfo = groupData
    console.log('更新后的群组信息:', state.groupInfo)
  }

  function clearUserData() {
    Object.keys(state).forEach(key => {
      state[key] = state[key] instanceof Object ? null : ''
    })
  }

  function getUserData() {
    return { ...state }
  }

  return { state, setUserData, clearUserData, getUserData, setGroupInfo }
})

