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
    missionId: ''
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

  function clearUserData() {
    Object.keys(state).forEach(key => {
      state[key] = state[key] instanceof Object ? null : ''
    })
  }

  function getUserData() {
    return { ...state }
  }

  return { state, setUserData, clearUserData, getUserData }
})

