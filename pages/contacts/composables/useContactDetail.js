// useContactDetail.js - 联系人详情相关的组合式函数
import { ref } from 'vue'
import { useUserStore } from '@/store/userStore'
import { useContactsStore } from '../store/contactsStore'

export function useContactDetail(contact, emit) {
  const userStore = useUserStore()
  const contactsStore = useContactsStore()
  const showModal = ref(false)
  const modalContent = ref('')
  let modalCallback = null

  const handleClose = () => {
    emit('close')
  }

  const handleMoreOptions = () => {
    console.log('更多选项被点击')
  }

  const handleRemark = () => {
    console.log('处理备注')
  }

  const handleMessage = () => {
    const chatInfo = {
      id: contact.id,
      name: contact.name,
      avatar: contact.avatar ? [contact.avatar] : [],
      type: 'single',
      recipientId: contact.id,
      missionId: userStore.missionId ? userStore.missionId.toString() : ''
    }

    uni.navigateTo({
      url: '/pages/message/chat',
      success: (res) => {
        res.eventChannel.emit('chatInfo', { chatInfo: chatInfo })
      },
      fail: (err) => {
        console.error('导航到聊天页面失败:', err)
      }
    })
  }

  const handleClearHistory = () => {
    showConfirmDialog('您确认要删除所有聊天记录吗？', () => {
      console.log('清空聊天记录')
    })
  }

  const handleDelete = () => {
    showConfirmDialog('您确认要删除此联系人吗？', () => {
      contactsStore.deleteContact(contact.id)
      emit('close')
    })
  }

  const showConfirmDialog = (content, callback) => {
    modalContent.value = content
    modalCallback = callback
    showModal.value = true
  }

  const handleModalCancel = () => {
    showModal.value = false
  }

  const handleModalConfirm = () => {
    showModal.value = false
    if (modalCallback) {
      modalCallback()
    }
  }

  return {
    showModal,
    modalContent,
    handleClose,
    handleMoreOptions,
    handleRemark,
    handleMessage,
    handleClearHistory,
    handleDelete,
    handleModalConfirm,
    handleModalCancel
  }
}

