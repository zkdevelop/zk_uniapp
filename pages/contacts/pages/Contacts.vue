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

    <scroll-view scroll-y class="contacts-scroll-view">
      <!-- 群聊列表组件 -->
      <group-chat-list
        v-if="groupVOList && groupVOList.length > 0"
        :groupVOList="groupVOList"
        @enter-group-chat="enterGroupChat"
      />
      <view v-else-if="!loading" class="empty-state">暂无群聊</view>

      <!-- 用户列表组件 -->
      <user-list
        v-if="userInformationVOList && userInformationVOList.length > 0"
        :userInformationVOList="userInformationVOList"
        @select-user="selectUser"
      />
      <view v-else-if="!loading" class="empty-state">暂无联系人</view>
    </scroll-view>

    <!-- 加载中提示 -->
    <view v-if="loading" class="loading-state">加载中...</view>

    <!-- 联系人详情组件 -->
    <contact-detail-view
      v-if="selectedContact"
      :contact="selectedContact"
      @close="closeContactDetail"
    />
  </view>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useContactsStore } from '../store/contactsStore'
import { useUserStore } from '@/store/userStore'
import GroupChatList from '../components/Contacts/GroupChatList.vue'
import UserList from '../components/Contacts/UserList.vue'
import ContactDetailView from '../components/ContactDetail/ContactDetailView.vue'
import DropdownMenu from '../components/shared/DropdownMenu.vue'
import { useContacts } from '../composables/useContacts'

export default {
  name: 'Contacts',
  components: {
    GroupChatList,
    UserList,
    ContactDetailView,
    DropdownMenu
  },
  setup() {
    // 控制台输出
    console.log('联系人组件设置函数被调用')
    
    const contactsStore = useContactsStore()
    const userStore = useUserStore()
    const { initContacts, loading, missionId } = useContacts()
    
    const showDropdown = ref(false)
    const groupVOList = ref([])
    const userInformationVOList = ref([])
    const selectedContact = ref(null)

    // 监听 store 中的数据变化
    watch(() => contactsStore.groupVOList, (newValue) => {
      console.log('存储中的群组列表已更新:', newValue)
      groupVOList.value = newValue
    }, { immediate: true })

    watch(() => contactsStore.userInformationVOList, (newValue) => {
      console.log('存储中的用户信息列表已更新:', newValue)
      userInformationVOList.value = newValue
    }, { immediate: true })

    // 加载联系人数据
    const loadContacts = async () => {
      console.log('加载联系人被调用，任务ID:', missionId.value)
      if (missionId.value) {
        console.log('正在调用初始化联系人')
        await initContacts()
        console.log('初始化联系人完成，更新本地引用')
        // 直接从 store 更新本地数据
        groupVOList.value = contactsStore.groupVOList
        userInformationVOList.value = contactsStore.userInformationVOList
      } else {
        console.log('任务ID不可用，跳过初始化联系人')
      }
    }

    // 组件挂载时的处理
    onMounted(() => {
      console.log('联系人组件挂载钩子被调用')
      loadContacts()
    })

    // 关闭联系人详情
    const closeContactDetail = () => {
      selectedContact.value = null
    }

    // 处理搜索
    const handleSearch = () => {
      console.log('搜索按钮被点击')
      // 实现搜索功能
    }

    // 切换下拉菜单
    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }

    // 处理容器点击
    const handleContainerClick = () => {
      if (showDropdown.value) {
        showDropdown.value = false
      }
    }

    // 处理发起群聊
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

    // 处理添加朋友
    const handleAddFriend = () => {
      console.log('添加朋友被点击')
      showDropdown.value = false
      // 实现添加朋友功能
    }

    // 进入群聊
    const enterGroupChat = (group) => {
      console.log('进入群聊:', group)
      // 实现进入群聊功能
    }

    // 选择用户
    const selectUser = (user) => {
      console.log('选择用户:', user)
      selectedContact.value = user
    }

    return {
      groupVOList,
      userInformationVOList,
      selectedContact,
      showDropdown,
      loading,
      missionId,
      closeContactDetail,
      handleSearch,
      toggleDropdown,
      handleContainerClick,
      handleGroupChat,
      handleAddFriend,
      enterGroupChat,
      selectUser
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

.contacts-scroll-view {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 60px; /* 添加底部填充以适应tabBar高度 */
}

:deep(.uni-navbar__header-btns.uni-navbar__header-btns-right) {
  width: 70px;
}

:deep(.uni-navbar) {
  background-color: #ffffff;
}

:deep(.uni-navbar__header) {
  padding: 0 15px;
}

:deep(.uni-navbar__header-container) {
  height: 44px;
}

:deep(.uni-navbar__placeholder) {
  height: 44px;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

.loading-state {
  font-weight: bold;
}
</style>

