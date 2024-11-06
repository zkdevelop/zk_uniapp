// @/store/userStore.js
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useUserStore = defineStore('user', () => {
  const state = reactive({
    id: '',
    account: '',
    username: '',
    password: '',
    name: '',
    department: '',
    role: '',
    phone: '',
    created: '',
    avatar: null,
    avatarUrl: '',
    token: '',
    status: ''
  })

  function setUserData(data) {
    if (Object.isExtensible(state)) {
      Object.keys(data).forEach(key => {
        if (key in state) {
          state[key] = data[key]
        }
      })
    } else {
      const newState = { ...state }
      Object.keys(data).forEach(key => {
        if (key in newState) {
          newState[key] = data[key]
        }
      })
      Object.keys(state).forEach(key => {
        state[key] = newState[key]
      })
    }
  }

  function clearUserData() {
    Object.keys(state).forEach(key => {
      state[key] = state[key] instanceof Object ? null : ''
    })
  }

  return { state, setUserData, clearUserData }
})