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

    <scroll-view class="contact-list" scroll-y>
      <view v-for="group in groups" :key="group.id" class="group">
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

export default {
  name: 'Contacts',
  components: {
    ContactDetail
  },
  data() {
    return {
      selectedContact: null,
      defaultAvatarPath: '../../static/message/默认头像.png',
      groups: [
        {
          id: 'group1',
          name: '分组A',
          expanded: true,
          members: [
            {
              id: 1,
              name: 'admin',
              title: '称号1',
              avatar: '',
              username: 'admin123',
              ip: '192.168.1.100'
            },
            {
              id: 2,
              name: '张宁鹏',
              title: '称号2',
              avatar: '',
              username: 'zhangningp',
              ip: '192.168.1.101'
            },
            {
              id: 3,
              name: '杨尚基',
              title: '称号3',
              avatar: '',
              username: 'yangshangji',
              ip: '192.168.1.102'
            },
            {
              id: 4,
              name: '王彦',
              title: '称号4',
              avatar: '',
              username: 'wangyan',
              ip: '192.168.1.103'
            }
          ]
        },
        {
          id: 'group2',
          name: '分组B',
          expanded: false,
          members: [
            {
              id: 5,
              name: '李明',
              title: '称号5',
              avatar: '',
              username: 'liming',
              ip: '192.168.1.104'
            },
            {
              id: 6,
              name: '赵静',
              title: '称号6',
              avatar: '',
              username: 'zhaojing',
              ip: '192.168.1.105'
            },
            {
              id: 7,
              name: '周伟',
              title: '称号7',
              avatar: '',
              username: 'zhouwei',
              ip: '192.168.1.106'
            }
          ]
        },
        {
          id: 'group3',
          name: '分组C',
          expanded: false,
          members: [
            {
              id: 8,
              name: '刘芳',
              title: '称号8',
              avatar: '',
              username: 'liufang',
              ip: '192.168.1.107'
            },
            {
              id: 9,
              name: '陈强',
              title: '称号9',
              avatar: '',
              username: 'chenqiang',
              ip: '192.168.1.108'
            }
          ]
        }
      ]
    }
  },
  methods: {
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
</style>