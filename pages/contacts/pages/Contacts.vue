<!-- Contacts.vue - 联系人主页面组件 -->
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

    <!-- 群聊列表组件 -->
    <group-chat-list
      v-if="groupVOList.length > 0"
      :groupVOList="groupVOList"
      @enter-group-chat="enterGroupChat"
    />
    <view v-else-if="!loading" class="empty-state">暂无群聊</view>

    <!-- 用户列表组件 -->
    <user-list
      v-if="userInformationVOList.length > 0"
      :userInformationVOList="userInformationVOList"
      @select-user="selectUser"
    />
    <view v-else-if="!loading" class="empty-state">暂无联系人</view>

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
import { ref, onMounted, watch, computed } from 'vue'
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
    console.log('联系人组件设置函数被调用')
    const contactsStore = useContactsStore()
    const userStore = useUserStore()
    const { initContacts, loading, missionId } = useContacts()
    const showDropdown = ref(false)

    // 使用计算属性获取响应式数据
    const groupVOList = computed(() => contactsStore.groupVOList)
    const userInformationVOList = computed(() => contactsStore.userInformationVOList)

    // 选中的联系人
    const selectedContact = ref(null)

    // 计算 missionId
    const computedMissionId = computed(() => {
      return Array.isArray(userStore.state.missionId) 
        ? userStore.state.missionId.join(',') 
        : (userStore.state.missionId || '')
    })

    onMounted(() => {
      console.log('联系人组件挂载钩子被调用')
      initContacts()
    })

    // 监听任务ID的变化
    watch(() => missionId.value, (newMissionId) => {
      if (newMissionId) {
        console.log('任务ID已更改，重新初始化联系人')
        initContacts()
      }
    })

    // 监听联系人更新计数器的变化
    watch(() => contactsStore.contactsUpdateCounter, () => {
      console.log('联系人数据已更新，重新初始化联系人')
      initContacts()
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
          console.log('导航失败:', err)
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
      console.log('正在跳转到群聊界面:', group)
      const chatInfo = {
        id: group.id,
        name: group.groupName,
        avatar: group.avatar || '/static/default-group-avatar.png',
        type: 'group',
        missionId: computedMissionId.value,
        isBurnAfterReadingMode: false
      }

      uni.navigateTo({
        url: '/pages/message/chat',
        success: (res) => {
          if (res.eventChannel && res.eventChannel.emit) {
            res.eventChannel.emit('chatInfo', { chatInfo })
            console.log('通过 eventChannel 发送群聊 chatInfo')
          } else {
            console.log('eventChannel 不可用，将使用本地存储的数据')
            uni.setStorageSync('chatQuery', JSON.stringify(chatInfo))
          }
        },
        fail: (error) => {
          console.log('跳转到群聊界面失败:', error)
        }
      })
    }

    // 选择用户
    const selectUser = (user) => {
      console.log('选择用户:', user)
      const currentMissionId = missionId.value
      const userString = encodeURIComponent(JSON.stringify(user))
      uni.navigateTo({
        url: `/pages/contacts/components/ContactDetail/ContactDetailView?user=${userString}&missionId=${currentMissionId}`,
        success: (res) => {
          console.log('成功导航到联系人详情页')
        },
        fail: (err) => {
          console.log('导航到联系人详情页失败:', err)
        }
      })
    }

    return {
      groupVOList,
      userInformationVOList,
      selectedContact,
      showDropdown,
      loading,
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

