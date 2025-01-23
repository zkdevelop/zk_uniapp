// @/pages/message/store/groupStore.js
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useGroupStore = defineStore('group', () => {
  const state = reactive({
    groupInfo: null
  })

  function setGroupInfo(groupData) { 
    state.groupInfo = groupData 
  }

  function clearGroupInfo() {
    state.groupInfo = null
  }

  function getGroupInfo() {
    return { ...state.groupInfo }
  }

  return { state, setGroupInfo, clearGroupInfo, getGroupInfo }
})

