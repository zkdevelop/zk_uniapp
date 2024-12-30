import { defineStore } from 'pinia'
import { getMissionAddressBook } from '@/utils/api/message'

export const useContactsStore = defineStore('contacts', {
  state: () => ({
    groups: [],
    selectedContact: null,
    total: 0
  }),
  getters: {
    hasMoreContacts: (state) => state.groups[0]?.members.length < state.total
  },
  actions: {
    async loadContacts() {
      console.log('contactsStore loadContacts action called')
      try {
        const response = await getMissionAddressBook()
        if (response.code === 200) {
          console.log('getMissionAddressBook API response:', response)
          this.total = response.data.userInformationVOList.length
          const users = response.data.userInformationVOList
          
          this.groups = [{
            id: 'allUsers',
            name: '所有用户',
            expanded: true,
            members: this.mapUsers(users)
          }]
          console.log('Updated groups:', JSON.stringify(this.groups))
        } else {
          throw new Error(response.msg || '加载联系人失败')
        }
      } catch (error) {
        console.error('加载联系人时出错:', error)
        uni.showToast({
          title: '加载联系人失败',
          icon: 'none'
        })
      }
    },
    mapUsers(users) {
      return users.map(user => ({
        id: user.id,
        name: user.name,
        title: user.department,
        avatar: user.avatarUrl,
        username: user.account,
        phone: user.phone,
        role: user.role,
        ip: user.ip || '未知'
      }))
    },
    setSelectedContact(contact) {
      this.selectedContact = contact
    },
    deleteContact(contactId) {
      const index = this.groups[0].members.findIndex(member => member.id === contactId)
      if (index !== -1) {
        this.groups[0].members.splice(index, 1)
        this.total--
      }
    }
  }
})

