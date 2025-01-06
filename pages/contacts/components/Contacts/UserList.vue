<!-- UserList.vue - 用户列表组件 -->
<template>
<view class="user-list">
  <view v-for="department in departmentList" :key="department.name" class="group">
    <view class="group-header" @click="toggleGroup(department)">
      <text class="group-title">{{ department.name }} ({{ department.users.length }}人)</text>
      <text class="group-arrow" :class="{ 'expanded': department.expanded }">›</text>
    </view>
    <view 
      class="group-content" 
      :class="{ 'expanded': department.expanded }"
    >
      <view 
        v-for="user in department.users" 
        :key="user.id" 
        class="contact-item"
        @click="selectUser(user)"
      >
        <image :src="user.avatarUrl || '/static/default-avatar.png'" class="avatar" mode="aspectFill" />
        <view class="contact-info">
          <text class="contact-name">{{ user.name }}</text>
          <text class="contact-title">{{ user.departmentName || '成员' }}</text>
        </view>
        <!-- 在线状态指示器 -->
        <view :class="['status-indicator', user.online ? 'online' : 'offline']"></view>
      </view>
    </view>
  </view>
</view>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'UserList',
  props: {
    // 用户列表数据
    userInformationVOList: {
      type: Array,
      required: true
    }
  },
  setup(props, { emit }) {
    // 按部门分组的用户列表
    const departmentList = ref([])

    // 初始化部门列表
    const initDepartmentList = () => {
      const departments = {}
      // 遍历用户列表，按部门分组
      props.userInformationVOList.forEach(user => {
        if (!departments[user.departmentName]) {
          departments[user.departmentName] = {
            name: user.departmentName,
            users: [],
            expanded: true // 默认展开
          }
        }
        departments[user.departmentName].users.push(user)
      })
      // 转换为数组形式
      departmentList.value = Object.values(departments)
    }

    // 初始化部门列表
    initDepartmentList()

    // 切换部门展开/收起状态
    const toggleGroup = (department) => {
      department.expanded = !department.expanded
    }

    // 选择用户进入私聊
    const selectUser = (user) => {
      emit('select-user', user)
    }

    return {
      departmentList,
      toggleGroup,
      selectUser
    }
  }
}
</script>

<style scoped>
.user-list {
  background-color: #f5f5f5;
  padding: 10px;
}

.group {
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 4px;
  overflow: hidden;
}

.group:last-child {
  margin-bottom: 20px; /* Add extra margin to last group */
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
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}

.contact-info {
  flex: 1;
  margin-left: 12px;
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

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 8px;
}

.online {
  background-color: #4CAF50;
}

.offline {
  background-color: #9E9E9E;
}
</style>

