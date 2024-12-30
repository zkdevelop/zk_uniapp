<!-- CreateGroupChat.vue - 发起群聊页面组件 -->
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
            :class="{ 'active': selectedContacts.length > 0 }"
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
        <view v-for="letter in sortedLetters" :key="letter">
          <view class="letter-index">{{ letter }}</view>
          <view 
            v-for="contact in groupedContacts[letter]" 
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

    <!-- 群聊名称输入弹窗 -->
    <uni-popup ref="popup" type="dialog">
      <uni-popup-dialog
        title="设置群聊名称"
        mode="input"
        placeholder="请输入群聊名称"
        :before-close="true"
        @confirm="confirmGroupName"
        @close="closePopup"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContactsStore } from '../../../store/contactsStore'
import { useUserStore } from '@/store/userStore'
import { pinyin } from 'pinyin-pro'
import { createGroup } from '@/utils/api/contacts'

// 初始化store
const contactsStore = useContactsStore()
const userStore = useUserStore()

// 响应式状态
const searchKeyword = ref('') // 搜索关键词
const selectedContacts = ref([]) // 已选择的联系人
const popup = ref(null)

// 在组件挂载时加载联系人数据
onMounted(() => {
  console.log('CreateGroupChat mounted')
  if (contactsStore.groups.length === 0) {
    contactsStore.loadContacts()
  }
})

// 过滤并计算联系人列表
const filteredContacts = computed(() => {
  if (!contactsStore.groups[0]) return []
  const contacts = contactsStore.groups[0].members
  if (!searchKeyword.value) return contacts
  return contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 获取拼音首字母
const getFirstLetter = (name) => {
  const pinyinResult = pinyin(name, { pattern: 'first', toneType: 'none' })
  return pinyinResult.charAt(0).toUpperCase()
}

// 按字母分组联系人
const groupedContacts = computed(() => {
  const groups = {}
  filteredContacts.value.forEach(contact => {
    const firstLetter = getFirstLetter(contact.name)
    if (!groups[firstLetter]) {
      groups[firstLetter] = []
    }
    groups[firstLetter].push(contact)
  })
  return groups
})

// 排序后的字母数组
const sortedLetters = computed(() => {
  return Object.keys(groupedContacts.value).sort()
})

// 处理返回按钮点击
const handleBack = () => {
  uni.navigateBack()
}

// 处理搜索输入
const handleSearch = () => {
  // 搜索功能已通过计算属性实现
}

// 切换联系人选中状态
const toggleSelect = (contact) => {
  const index = selectedContacts.value.findIndex(c => c.id === contact.id)
  if (index === -1) {
    selectedContacts.value.push(contact)
  } else {
    selectedContacts.value.splice(index, 1)
  }
  console.log('Selected contacts:', selectedContacts.value)
}

// 检查联系人是否被选中
const isSelected = (contactId) => {
  return selectedContacts.value.some(contact => contact.id === contactId)
}

// 处理完成按钮点击
const handleComplete = () => {
  if (selectedContacts.value.length === 0) return
  
  // 显示群聊名称输入弹窗
  popup.value.open()
}

// 确认群聊名称
const confirmGroupName = (name) => {
  if (!name) {
    uni.showToast({
      title: '群聊名称不能为空',
      icon: 'none'
    })
    return
  }

  // 准备创建群聊的参数
  const groupData = {
    groupMemberIds: [userStore.state.id, ...selectedContacts.value.map(contact => contact.id)],
    groupName: name,
    missionId: userStore.state.missionId[0]
  }

  // 调用创建群聊的API
  createGroup(groupData)
    .then(response => {
      console.log('群聊创建成功:', response)
      uni.showToast({
        title: '群聊创建成功',
        icon: 'success'
      })
      // 创建成功后返回上一页
      uni.navigateBack()
    })
    .catch(error => {
      console.error('创建群聊失败:', error)
      uni.showToast({
        title: '创建群聊失败',
        icon: 'none'
      })
    })
}

// 关闭弹窗
const closePopup = () => {
  popup.value.close()
}
</script>

<style scoped>
.group-chat-container {
  height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.nav-right {
  padding-right: 12px;
}

.complete-btn {
  font-size: 14px;
  color: #999;
  background: none;
  border: none;
  padding: 4px 8px;
  margin: 0;
  line-height: 1.4;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.complete-btn.active {
  color: #007AFF;
  opacity: 1;
}

.complete-btn:disabled {
  opacity: 0.6;
}

.complete-btn:after {
  border: none;
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
  transform: scale(0.8);
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

:deep(.uni-navbar__header) {
  border-bottom: 1px solid #eee;
}
</style>

