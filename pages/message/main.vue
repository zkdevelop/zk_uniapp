<!-- main.vue - 消息列表主页面组件 -->
<template>
  <view class="messages-container">
    <view>
      <uni-nav-bar :fixed="true" status-bar rightIcon="search" @clickRight="" title="消息" />
    </view>
    <view class="messages-view">
      <view class="messages-header">
        <text class="header-title">消息({{ totalMessageCount }})</text>
      </view>
      
      <scroll-view class="messages-list" scroll-y enable-flex :style="{ height: scrollViewHeight + 'px' }">
        <!-- 系统消息 -->
        <SystemMessage :message="systemMessage" />
        
        <!-- 加载中的骨架屏 -->
        <template v-if="isLoading">
          <SkeletonLoader v-for="n in 3" :key="n" />
        </template>

        <!-- 消息列表 -->
        <transition-group name="fade" tag="view">
          <MessageItem
            v-for="(message, index) in combinedMessages"
            :key="message.id || index"
            :message="message"
            @click="openChat(message)"
          />
        </transition-group>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import SystemMessage from './MainComponents/SystemMessage.vue'
import MessageItem from './MainComponents/MessageItem.vue'
import SkeletonLoader from './MainComponents/SkeletonLoader.vue'
import { useMessageList } from './MainComposables/useMessageList'
import { useUserStore } from '@/store/userStore'

export default defineComponent({
  name: 'Messages',
  components: {
    SystemMessage,
    MessageItem,
    SkeletonLoader
  },
  setup() {
    const userStore = useUserStore()
    
    // 使用消息列表组合式函数
    const {
      combinedMessages,
      totalMessageCount,
      systemMessage,
      scrollViewHeight,
      isLoading,
    } = useMessageList()

    // 计算 missionId
    const missionId = computed(() => {
      return Array.isArray(userStore.state.missionId) 
        ? userStore.state.missionId.join(',') 
        : (userStore.state.missionId || '')
    })

    // 打开聊天页面的函数
    const openChat = (message) => {
      const chatInfo = {
        id: message.id || message.userId,
        name: message.name || message.userName,
        avatar: message.avatar || '/static/message/默认头像.png',
        type: message.group ? 'group' : 'single',
        missionId: missionId.value
      };

      console.log('[openChat] 准备导航到聊天页面，chatInfo:', chatInfo);

      // 导航到聊天页面
      uni.navigateTo({
        url: '/pages/message/chat',
        success: (res) => {
          if (res.eventChannel && res.eventChannel.emit) {
            res.eventChannel.emit('chatInfo', { chatInfo });
            console.log('[openChat] 通过 eventChannel 发送 chatInfo');
          } else {
            console.warn('[openChat] eventChannel 不可用，将使用本地存储的数据');
            uni.setStorageSync('chatQuery', JSON.stringify(chatInfo));
          }
        },
        fail: (err) => {
          console.error('[openChat] 导航到聊天页面失败:', err);
          // uni.showToast({
          //   title: '打开聊天失败，请重试',
          //   icon: 'none'
          // });
        }
      });
    };

    watch(() => userStore.state.missionId, (newMissionId) => {
      if (newMissionId) {
        const missionIdString = Array.isArray(newMissionId) ? newMissionId.join(',') : newMissionId;
        uni.setStorageSync('currentMissionId', missionIdString);
        console.log('[main] 更新了本地存储中的 missionId:', missionIdString);
      }
    });

    // 返回模板中使用的数据和方法
    return {
      combinedMessages,
      totalMessageCount,
      systemMessage,
      scrollViewHeight,
      isLoading,
      openChat
    }
  }
})
</script>

<style>
.messages-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  overflow: hidden;
}

.messages-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}

.messages-list {
  flex: 1;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

