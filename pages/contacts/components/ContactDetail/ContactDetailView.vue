<template>
  <view class="contact-detail-view">
    <!-- 显示联系人信息 -->
    <contact-info :contact="contact" />
    
    <!-- 显示部门和在线状态 -->
    <view class="additional-info">
      <text>部门：{{ contact.departmentName }}</text>
      <text>状态：{{ contact.online ? '在线' : '离线' }}</text>
    </view>
    
    <!-- 操作按钮 -->
    <view class="action-buttons">
      <button @click="handleMessage">发送消息</button>
      <button @click="handleClearHistory">清除历史</button>
      <button @click="handleDelete" class="delete-button">删除联系人</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ContactInfo from './ContactInfo.vue';
import { useUserStore } from '@/store/userStore';

const userStore = useUserStore();

// 定义联系人数据结构
const contact = ref({
  id: '',
  name: '',
  avatarUrl: '',
  departmentName: '',
  online: false,
  missionId: '',
});

// 计算 missionId
const missionId = computed(() => {
  return Array.isArray(userStore.state.missionId) 
    ? userStore.state.missionId.join(',') 
    : (userStore.state.missionId || '');
});

// 组件挂载时的处理函数
onMounted(() => {
  // 获取页面参数
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const { user } = currentPage.$page.options;

  // 解析传递的用户数据
  if (user) {
    const decodedUser = JSON.parse(decodeURIComponent(user));
    contact.value = {
      ...decodedUser,
      missionId: missionId.value
    };
  }

  console.log('联系人详情页面已加载');
});

// 处理发送消息
const handleMessage = () => {
  console.log('正在跳转到聊天界面');
  const chatInfo = {
    id: contact.value.id,
    name: contact.value.name,
    avatar: contact.value.avatarUrl,
    type: 'single',
    missionId: contact.value.missionId || missionId.value,
    isBurnAfterReadingMode: false
  };

  uni.navigateTo({
    url: '/pages/message/chat',
    success: (res) => {
      if (res.eventChannel && res.eventChannel.emit) {
        res.eventChannel.emit('chatInfo', { chatInfo });
        console.log('通过 eventChannel 发送 chatInfo');
      } else {
        console.log('eventChannel 不可用，将使用本地存储的数据');
        uni.setStorageSync('chatQuery', JSON.stringify(chatInfo));
      }
    },
    fail: (error) => {
      console.log('跳转到聊天界面失败:', error);
    }
  });
};

// 处理清除历史
const handleClearHistory = () => {
  console.log('正在处理清除历史');
  // 这里添加处理清除历史的逻辑
};

// 处理删除联系人
const handleDelete = () => {
  console.log('正在处理删除联系人');
  // 这里添加处理删除联系人的逻辑
};
</script>

<style scoped>
.contact-detail-view {
  padding: 20px;
}

.action-buttons {
  margin-top: 20px;
}

.action-buttons button {
  margin-bottom: 10px;
}

.delete-button {
  background-color: #ff4d4f;
  color: white;
}

.additional-info {
  margin-top: 10px;
}
</style>

