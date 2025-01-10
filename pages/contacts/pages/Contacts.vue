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

    <view class="content-wrapper">
      <!-- 加载动画 -->
      <loading-animation v-if="loading" />

      <template v-else>
        <!-- 群聊列表组件 -->
        <group-chat-list
          v-if="groupVOList.length > 0"
          :groupVOList="groupVOList"
          @enter-group-chat="(group) => enterGroupChat(group, computedMissionId)"
        />
        <view v-else class="empty-state">暂无群聊</view>

        <!-- 用户列表组件 -->
        <user-list
          v-if="userInformationVOList.length > 0"
          :userInformationVOList="userInformationVOList"
          @select-user="(user) => selectUser(user, missionId)"
        />
        <view v-else class="empty-state">暂无联系人</view>
      </template>
    </view>

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
import GroupChatList from '../components/Contacts/GroupChatList.vue'
import UserList from '../components/Contacts/UserList.vue'
import ContactDetailView from '../components/ContactDetail/ContactDetailView.vue'
import DropdownMenu from '../components/shared/DropdownMenu.vue'
import LoadingAnimation from '../components/shared/LoadingAnimation.vue'
import { useContacts } from '../composables/useContacts'
import { useContactNavigation } from '../composables/useContactNavigation'

export default {
  name: 'Contacts',
  components: {
    GroupChatList,
    UserList,
    ContactDetailView,
    DropdownMenu,
    LoadingAnimation
  },
  setup() {
    console.log('联系人组件设置函数被调用')
    const contactsStore = useContactsStore()
    const { 
      initContacts, 
      loading, 
      isUpdating, 
      missionId, 
      groupVOList, 
      userInformationVOList, 
      computedMissionId,
      showDropdown,
      toggleDropdown,
      handleContainerClick
    } = useContacts()
    const { 
      handleSearch, 
      handleGroupChat, 
      handleAddFriend, 
      enterGroupChat, 
      selectUser 
    } = useContactNavigation()

    // 选中的联系人
    const selectedContact = ref(null)

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

    return {
      groupVOList,
      userInformationVOList,
      selectedContact,
      showDropdown,
      loading,
      isUpdating,
      missionId,
      computedMissionId,
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

.content-wrapper {
  flex: 1;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
</style>

