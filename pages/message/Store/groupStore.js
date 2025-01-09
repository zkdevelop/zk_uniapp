// @/pages/message/store/groupStore.js
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useGroupStore = defineStore('group', () => {
  const state = reactive({
    groupInfo: null
  })

  function setGroupInfo(groupData) {
    console.log('设置群组信息:', groupData)
    state.groupInfo = groupData
    console.log('更新后的群组信息:', state.groupInfo)
  }

  function clearGroupInfo() {
    state.groupInfo = null
  }

  function getGroupInfo() {
    return { ...state.groupInfo }
  }

  return { state, setGroupInfo, clearGroupInfo, getGroupInfo }
})

