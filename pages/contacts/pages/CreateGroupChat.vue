<!-- CreateGroupChat.vue - 发起群聊页面 -->
<template>
  <view class="group-chat-container">
    <!-- 顶部导航栏 -->
    <uni-nav-bar
      :fixed="true"
      status-bar
      left-icon="left"
      @clickLeft="handleBack"
      title="发起群聊"
    >
      <template #right>
        <view class="nav-right">
          <button 
            class="complete-btn" 
            :disabled="selectedContacts.length === 0"
            @click="handleComplete"
          >
            完成
          </button>
        </view>
      </template>
    </uni-nav-bar>

    <!-- 搜索框 -->
    <view class="search-container">
      <view class="search-box">
        <image class="search-icon" src="/static/message/搜索.png" mode="aspectFit"></image>
        <input
          class="search-input"
          type="text"
          v-model="searchKeyword"
          placeholder="搜索"
          @input="handleSearch"
        />
      </view>
    </view>

    <!-- 联系人列表 -->
    <scroll-view class="contacts-list" scroll-y>
      <template v-if="filteredContacts.length > 0">
        <view v-for="(group, letter) in groupedContacts" :key="letter">
          <view class="letter-index">{{ letter }}</view>
          <view 
            v-for="contact in group" 
            :key="contact.id"
            class="contact-item"
            @click="toggleSelect(contact)"
          >
            <checkbox 
              :checked="isSelected(contact.id)"
              :value="contact.id"
              class="checkbox"
            />
            <image 
              class="avatar" 
              :src="contact.avatar || '/static/message/默认头像.png'" 
              mode="aspectFill"
            ></image>
            <text class="contact-name">{{ contact.name }}</text>
          </view>
        </view>
      </template>
      <view v-else class="no-results">
        <text>无搜索结果</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { ref, computed } from 'vue'
import { useContactsStore } from '../store/contactsStore'

export default {
  name: 'CreateGroupChat',
  setup() {
    const contactsStore = useContactsStore()
    const searchKeyword = ref('')
    const selectedContacts = ref([])

    // 过滤并按字母分组联系人
    const filteredContacts = computed(() => {
      if (!contactsStore.groups[0]) return []
      const contacts = contactsStore.groups[0].members
      if (!searchKeyword.value) return contacts
      return contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    })

    const groupedContacts = computed(() => {
      const groups = {}
      filteredContacts.value.forEach(contact => {
        const firstLetter = contact.name.charAt(0).toUpperCase()
        if (!groups[firstLetter]) {
          groups[firstLetter] = []
        }
        groups[firstLetter].push(contact)
      })
      return groups
    })

    const handleBack = () => {
      uni.navigateBack()
    }

    const handleSearch = () => {
      // 搜索功能已通过计算属性实现
    }

    const toggleSelect = (contact) => {
      const index = selectedContacts.value.findIndex(c => c.id === contact.id)
      if (index === -1) {
        selectedContacts.value.push(contact)
      } else {
        selectedContacts.value.splice(index, 1)
      }
    }

    const isSelected = (contactId) => {
      return selectedContacts.value.some(contact => contact.id === contactId)
    }

    const handleComplete = () => {
      if (selectedContacts.value.length === 0) return
      
      // 创建群聊的逻辑
      console.log('Selected contacts:', selectedContacts.value)
      uni.navigateBack()
    }

    return {
      searchKeyword,
      selectedContacts,
      filteredContacts,
      groupedContacts,
      handleBack,
      handleSearch,
      toggleSelect,
      isSelected,
      handleComplete
    }
  }
}
</script>

<style scoped>
.group-chat-container {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.search-container {
  padding: 10px 16px;
  background-color: #f5f5f5;
}

.search-box {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
}

.search-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.search-input {
  flex: 1;
  font-size: 16px;
  color: #333;
}

.contacts-list {
  flex: 1;
  background-color: #ffffff;
}

.letter-index {
  padding: 8px 16px;
  background-color: #f5f5f5;
  color: #666;
  font-size: 14px;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
}

.checkbox {
  margin-right: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
}

.contact-name {
  font-size: 16px;
  color: #333;
}

.no-results {
  padding: 20px;
  text-align: center;
  color: #999;
}

.complete-btn {
  font-size: 16px;
  color: #007AFF;
  background: none;
  border: none;
  padding: 0 16px;
}

.complete-btn:disabled {
  color: #999;
}

:deep(.uni-navbar__header) {
  border-bottom: 1px solid #eee;
}
</style>

