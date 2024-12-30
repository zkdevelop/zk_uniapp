<!-- Contacts.vue - 通讯录主页面组件 -->
<template>
  <view class="contacts-container" @click="handleContainerClick">
    <!-- 顶部导航栏 -->
    <uni-nav-bar 
      :fixed="true" 
      status-bar 
      right-icon="search" 
      @clickRight="handleSearch" 
      title="通讯录"
    >
      <template #right>
        <view class="nav-right">
          <image 
            class="nav-icon" 
            src="/static/message/搜索.png" 
            mode="aspectFit"
            @click.stop="handleSearch"
          ></image>
          <image 
            class="nav-icon" 
            src="/static/message/展开对话工具.png" 
            mode="aspectFit"
            @click.stop="toggleDropdown"
          ></image>
        </view>
      </template>
    </uni-nav-bar>

    <!-- 下拉菜单 -->
    <dropdown-menu 
      :visible="showDropdown"
      @group-chat="handleGroupChat"
      @add-friend="handleAddFriend"
    />

    <!-- 联系人列表组件 -->
    <contacts-list />
    
    <!-- 联系人详情组件 -->
    <contact-detail-view
      v-if="selectedContact"
      :contact="selectedContact"
      @close="closeContactDetail"
    />
  </view>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useContactsStore } from '../store/contactsStore'
import ContactsList from '../components/Contacts/ContactsList.vue'
import ContactDetailView from '../components/ContactDetail/ContactDetailView.vue'
import DropdownMenu from '../components/shared/DropdownMenu.vue'
import { useContacts } from '../composables/useContacts'

export default {
  name: 'Contacts',
  components: {
    ContactsList,
    ContactDetailView,
    DropdownMenu
  },
  setup() {
    console.log('Contacts setup 函数被调用')
    const contactsStore = useContactsStore()
    const { loadContacts } = useContacts()
    const showDropdown = ref(false)

    onMounted(() => {
      console.log('Contacts onMounted 钩子被调用')
      loadContacts().then(() => {
        console.log('loadContacts 完成')
      }).catch((error) => {
        console.error('loadContacts 出错:', error)
      })
    })

    const selectedContact = computed(() => contactsStore.selectedContact)

    const closeContactDetail = () => {
      contactsStore.setSelectedContact(null)
    }

    const handleSearch = () => {
      console.log('搜索按钮被点击')
    }

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }

    const handleContainerClick = () => {
      if (showDropdown.value) {
        showDropdown.value = false
      }
    }

    const handleGroupChat = () => {
      console.log('发起群聊被点击')
      showDropdown.value = false
      uni.navigateTo({
        url: '/pages/contacts/pages/contacts/create-group-chat/index',
        fail: (err) => {
          console.error('导航失败:', err)
        }
      })
    }

    const handleAddFriend = () => {
      console.log('添加朋友被点击')
      showDropdown.value = false
    }

    return {
      selectedContact,
      closeContactDetail,
      handleSearch,
      showDropdown,
      toggleDropdown,
      handleContainerClick,
      handleGroupChat,
      handleAddFriend
    }
  }
}
</script>

<style scoped>
.contacts-container {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.nav-right {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10000;
}

.nav-icon {
  width: 20px;
  height: 24px;
  margin-left: 16px;
}

:deep(.uni-navbar__header-btns.uni-navbar__header-btns-right) {
  width: 70px;
}
</style>

