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

        <!-- 消息列表 -->
        <MessageItem
          v-for="(message, index) in combinedMessages"
          :key="message.id || index"
          :message="message"
          @click="openChat(message)"
        />
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { defineComponent } from 'vue'
import SystemMessage from './MainComponents/SystemMessage.vue'
import MessageItem from './MainComponents/MessageItem.vue'
import { useMessageList } from './MainComposables/useMessageList'

export default defineComponent({
  name: 'Messages',
  components: {
    SystemMessage,
    MessageItem
  },
  setup() {
    const {
      combinedMessages,
      totalMessageCount,
      systemMessage,
      scrollViewHeight,
      openChat
    } = useMessageList()

    return {
      combinedMessages,
      totalMessageCount,
      systemMessage,
      scrollViewHeight,
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
</style>

