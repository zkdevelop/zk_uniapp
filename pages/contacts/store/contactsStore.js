// contactsStore.js - 联系人存储
import { defineStore } from 'pinia'

export const useContactsStore = defineStore('contacts', {
  state: () => ({
    groupVOList: [], // 群组列表
    userInformationVOList: [], // 用户信息列表
    selectedContact: null, // 当前选中的联系人
    isInitialized: false, // 是否已初始化
    contactsUpdateCounter: 0 // 联系人更新计数器
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
    },
    // 设置初始化状态
    setInitialized(value) {
      this.isInitialized = value
    },
    // 增加联系人更新计数器
    incrementContactsUpdateCounter() {
      this.contactsUpdateCounter++
      console.log('联系人更新计数器已增加')
    }
  }
})

