<template>
  <view class="contacts-container">
    <view class="header">
      <text class="title">通讯录</text>
      <view class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </view>
    </view>

    <scroll-view class="contact-list" scroll-y @scrolltolower="loadMoreContacts">
      <view v-if="loading" class="loading">加载中...</view>
      <view v-else-if="groups.length === 0" class="no-contacts">暂无联系人</view>
      <view v-else v-for="group in groups" :key="group.id" class="group">
        <view class="group-header" @click="toggleGroup(group.id)">
          <text class="group-title">{{ group.name }} ({{ group.members.length }}人)</text>
          <text class="group-arrow" :class="{ 'expanded': group.expanded }">›</text>
        </view>
        <view 
          class="group-content" 
          :class="{ 'expanded': group.expanded }"
        >
          <view v-for="member in group.members" 
                :key="member.id" 
                class="contact-item"
                @click="showContactDetail(member)">
            <image class="avatar" 
                   :src="getAvatarSrc(member.avatar)" 
                   mode="aspectFill">
            </image>
            <view class="contact-info">
              <text class="contact-name">{{ member.name }}</text>
              <text class="contact-title">{{ member.title }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <contact-detail 
      v-if="selectedContact" 
      :contact="selectedContact"
      @close="closeContactDetail"
    ></contact-detail>
  </view>
</template>

<script>
import ContactDetail from './ContactDetail.vue'
import { searchUsers } from '/utils/api/contacts.js'

export default {
  name: 'Contacts',
  components: {
    ContactDetail
  },
  data() {
    return {
      selectedContact: null,
      defaultAvatarPath: '../../static/message/默认头像.png',
      groups: [],
      loading: false,
      curPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.loadContacts()
  },
  methods: {
    async loadContacts() {
      this.loading = true
      try {
        const response = await searchUsers({
          keyword: "",
          param: {
            curPage: this.curPage,
            pageSize: this.pageSize
          }
        })
        if (response.code === 200) {
          this.total = response.data.total
          const users = response.data.records
          if (this.curPage === 1) {
            this.groups = [{
              id: 'allUsers',
              name: '所有用户',
              expanded: true,
              members: users.map(user => ({
                id: user.id,
                name: user.name,
                title: user.department,
                avatar: user.avatarUrl,
                username: user.account,
                phone: user.phone,
                role: user.role
              }))
            }]
          } else {
            this.groups[0].members.push(...users.map(user => ({
              id: user.id,
              name: user.name,
              title: user.department,
              avatar: user.avatarUrl,
              username: user.account,
              phone: user.phone,
              role: user.role
            })))
          }
        } else {
          uni.showToast({
            title: '加载联系人失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.error('加载联系人时出错:', error)
        uni.showToast({
          title: '加载联系人失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    async loadMoreContacts() {
      if (this.loading || this.groups[0].members.length >= this.total) return
      this.curPage++
      await this.loadContacts()
    },
    toggleGroup(groupId) {
      const group = this.groups.find(g => g.id === groupId);
      if (group) {
        group.expanded = !group.expanded;
      }
    },
    showContactDetail(member) {
      this.selectedContact = member;
    },
    closeContactDetail() {
      this.selectedContact = null;
    },
    getAvatarSrc(avatar) {
      return avatar || this.defaultAvatarPath;
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
  position: relative;
}

.header {
  height: 44px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-bottom: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.title {
  font-size: 18px;
  font-weight: 500;
}

.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #333;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-list {
  flex: 1;
  overflow-y: auto;
  margin-top: 8px;
}

.group {
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 4px;
  overflow: hidden;
}

.group-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  background-color: #fafafa;
}

.group-title {
  font-size: 16px;
  color: #333;
}

.group-arrow {
  font-size: 20px;
  color: #999;
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}

.group-arrow.expanded {
  transform: rotate(-90deg);
}

.group-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.group-content.expanded {
  max-height: 1000px;
}

.contact-item {
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #f5f5f5;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-right: 12px;
}

.contact-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.contact-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.2;
}

.contact-title {
  font-size: 14px;
  color: #999;
  line-height: 1.2;
}

.loading, .no-contacts {
  padding: 20px;
  text-align: center;
  color: #999;
}
</style>