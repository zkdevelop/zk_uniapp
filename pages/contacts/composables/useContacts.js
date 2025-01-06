// useContacts.js - 联系人列表相关的组合式函数
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useContactsStore } from '../store/contactsStore'

export function useContacts() {
  console.log('useContacts composable called')
  const contactsStore = useContactsStore()
  const loading = ref(false)

  const { groups } = storeToRefs(contactsStore)

  const displayGroups = computed(() => {
    console.log('Computing displayGroups, current groups:', JSON.stringify(groups.value))
    return groups.value
  })

  async function loadContacts() {
    console.log('loadContacts function called')
    if (loading.value || groups.value.length > 0) return
    loading.value = true
    try {
      await contactsStore.loadContacts()
      console.log('contactsStore.loadContacts completed')
    } catch (error) {
      console.error('loadContacts 出错:', error)
    } finally {
      loading.value = false
    }
  }

  async function loadMoreContacts() {
    console.log('loadMoreContacts function called')
    if (loading.value || !contactsStore.hasMoreContacts) return
    loading.value = true
    try {
      await contactsStore.loadMoreContacts()
      console.log('contactsStore.loadMoreContacts completed')
    } catch (error) {
      console.error('loadMoreContacts 出错:', error)
    } finally {
      loading.value = false
    }
  }

  const selectContact = (contact) => {
    contactsStore.setSelectedContact(contact)
  }

  return {
    displayGroups,
    loading,
    loadContacts,
    loadMoreContacts,
    selectContact
  }
}

