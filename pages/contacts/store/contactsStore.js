// contactsStore.js - 联系人存储
import { defineStore } from 'pinia'

export const useContactsStore = defineStore('contacts', {
  state: () => ({
    groupVOList: [],
    userInformationVOList: [],
    selectedContact: null
  }),
  actions: {
    // 设置群组列表
    setGroupVOList(groupVOList) {
      this.groupVOList = groupVOList
    },
    // 设置用户信息列表
    setUserInformationVOList(userInformationVOList) {
      this.userInformationVOList = userInformationVOList
    },
    // 设置选中的联系人
    setSelectedContact(contact) {
      this.selectedContact = contact
    }
  }
})

