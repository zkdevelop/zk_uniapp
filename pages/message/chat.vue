<template>
  <view class="chat-page">
    <!-- 聊天头部 -->
    <ChatHeader :chat-info="chatInfo" @go-back="goBack" />

    <!-- 消息列表 -->
    <MessageList
      :messages="list"
      :scroll-top="scrollTop"
      :scroll-into-view="scrollIntoView"
      @load-more="loadMoreMessages"
      @scroll="onScroll"
      @view-burn-after-reading="viewBurnAfterReadingImage"
    />

    <!-- 聊天输入区域 -->
    <ChatInputArea 
      @send-message="sendMessage" 
      @message-sent="handleMessageSent"
      @message-failed="handleMessageFailed"
      @attach="handleAttachment"
      @video-call="openVideoPage"
      @toggle-attach-menu="toggleAttachMenu"
      :show-attach-menu="showAttachMenu"
      :recipientId="chatInfo.id"
      ref="chatInputAreaRef"
    />

    <!-- 阅后即焚组件 -->
    <BurnAfterReading
      v-if="currentBurnAfterReadingImage"
      :imageSrc="currentBurnAfterReadingImage"
      :duration="burnAfterReadingDuration"
      @close="closeBurnAfterReadingPreview"
      ref="burnAfterReadingRef"
    />

    <!-- 滚动到底部按钮 -->
    <ScrollToBottomButton
      :show="showScrollToBottom"
      @click.stop="scrollToBottom"
    />

    <!-- 新消息提示 -->
    <view v-if="showNewMessageTip" class="new-message-tip" @click.stop="scrollToBottom">
      新消息
    </view>

    <!-- 来电提醒 -->
    <view v-if="peerStore.activateNotification" class="modal">
      <view>
        <text>{{peerStore.dataConnection?.peer}} 邀请你视频通话</text>
      </view>
      <view class="modal-content">
        <button @click="acceptVideoCall" type="default">接听</button>
        <button @click="rejectVideoCall" type="warn">拒绝</button>
      </view>
    </view>

    <!-- 附件菜单遮罩层 -->
    <div v-if="showAttachMenu" class="overlay" @click="handleOverlayClick"></div>
  </view>
</template>

<script>
import ChatHeader from './ChatComponent/ChatHeader.vue'
import MessageList from './ChatComponent/MessageList.vue'
import ChatInputArea from './ChatComponent/ChatInputArea.vue'
import BurnAfterReading from './ChatComponent/ChatInputAreaComponent/BurnAfterReading.vue'
import ScrollToBottomButton from './ChatComponent/ScrollToBottomButton.vue'
import { getHistoryChatMessages } from '@/utils/api/message.js'
import usePeerStore from '../../store/peer'
import useFriendStore from '../../store/friend'
import { useUserStore } from '@/store/userStore'

export default {
  name: 'Chat',
  components: {
    ChatHeader,
    MessageList,
    ChatInputArea,
    BurnAfterReading,
    ScrollToBottomButton
  },
  data() {
    return {
      chatInfo: {
        id: '',
        name: '',
        avatar: [],
        type: 'single',
        missionId: '' // 任务ID
      },
      list: [], // 消息列表
      scrollTop: 0,
      scrollIntoView: '',
      _selfAvatar: '/static/avatar/avatar5.jpeg',
      showAttachMenu: false,
      burnAfterReadingDuration: 5,
      currentBurnAfterReadingImage: '',
      currentBurnAfterReadingMessage: null,
      isScrolledToBottom: true,
      scrollViewHeight: 0,
      scrollViewScrollHeight: 0,
      showScrollToBottom: false,
      showNewMessageTip: false,
      hasNewMessages: false,
      currentFrom: 0,
      currentTo: 10,
      hasMoreMessages: true,
      isLoading: false,
      peerStore: null,
      friendStore: null,
    };
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    this.peerStore = usePeerStore();
    this.friendStore = useFriendStore();
    eventChannel.on('chatInfo', (data) => {
      this.chatInfo = data.chatInfo;
      console.log('接收到的聊天信息:', this.chatInfo);
      // 确保 missionId 被正确设置
      if (!this.chatInfo.missionId) {
        const userStore = useUserStore();
        this.chatInfo.missionId = userStore.missionId;
      }
      console.log('使用的 missionId:', this.chatInfo.missionId);
      this.initializeChat();
    });
  },
  mounted() {
    this.getScrollViewInfo();
    console.log('聊天组件已挂载');
  },
  methods: {
    // 初始化聊天
    async initializeChat() {
      await this.loadHistoryMessages();
      this.$nextTick(this.scrollToBottom);
    },
    // 获取滚动视图信息
    getScrollViewInfo() {
      const query = uni.createSelectorQuery().in(this);
      query.select('.scroll-view').boundingClientRect(data => {
        if (data) {
          this.scrollViewHeight = data.height;
          console.log('滚动视图高度:', this.scrollViewHeight);
        } else {
          console.log('获取滚动视图高度失败');
        }
      }).exec();
    },
    // 返回上一页
    goBack() {
      uni.navigateBack({
        success: () => {
          uni.$emit('updateTabBarActiveTab', 1);
        },
        fail: (err) => {
          console.error('返回失败:', err);
          uni.reLaunch({
            url: '/pages/tabBar/tabBar',
            success: () => {
              uni.$emit('updateTabBarActiveTab', 1);
            }
          });
        }
      });
    },
    // 发送消息
    sendMessage(message) {
      console.log('[sendMessage] 发送消息:', message);
      if (message.content) {
        const newMessage = {
          id: Date.now().toString(),
          content: message.content,
          userType: 'self',
          avatar: this._selfAvatar,
          timestamp: new Date(),
          status: 'sending',
          type: message.type || 'text'
        };
        this.addNewMessage(newMessage);
      }
    },
    // 处理消息发送成功
    handleMessageSent(sentMessage) {
      console.log('[handleMessageSent] 消息已发送:', sentMessage);
      const tempMessage = this.list.find(m => m.content === sentMessage.message);
      if (tempMessage) {
        tempMessage.id = sentMessage.id;
        tempMessage.status = 'sent';
      }
    },
    // 处理消息发送失败
    handleMessageFailed(failedMessage) {
      console.log('[handleMessageFailed] 消息发送失败:', failedMessage);
      const tempMessage = this.list.find(m => m.content === failedMessage);
      if (tempMessage) {
        tempMessage.status = 'failed';
      }
    },
    // 处理附件
    handleAttachment(type, data) {
      console.log('[handleAttachment] 处理附件:', type, data);
      if (type === 'location') {
        this.handleLocationMessage(data);
      } else {
        const handlers = {
          album: this.chooseImage,
          file: () => this.handleFileTransfer(data),
          'burn-after-reading': () => this.handleBurnAfterReading(data)
        };
        if (handlers[type]) {
          handlers[type]();
        }
      }
    },
    // 选择图片
    chooseImage() {
      uni.chooseImage({
        success: (res) => {
          this.addNewMessage({
            content: res.tempFilePaths[0],
            userType: 'self',
            type: 'image',
            avatar: this._selfAvatar,
            timestamp: new Date()
          });
        }
      });
    },
    // 处理文件传输
    handleFileTransfer(fileData) {
      this.addNewMessage({
        content: fileData,
        userType: 'self',
        type: 'file',
        avatar: this._selfAvatar,
        timestamp: new Date()
      });
    },
    // 处理阅后即焚
    handleBurnAfterReading(imageData) {
      this.addNewMessage({
        content: imageData,
        userType: 'self',
        type: 'burn-after-reading',
        avatar: this._selfAvatar,
        timestamp: new Date()
      });
    },
    // 处理位置消息
    handleLocationMessage(locationData) {
      console.log('[handleLocationMessage] 处理位置消息:', locationData);
      const newMessage = {
        id: Date.now().toString(),
        type: 'location',
        content: locationData,
        userType: 'self',
        avatar: this._selfAvatar,
        timestamp: new Date(),
        status: 'sending'
      };
      this.addNewMessage(newMessage);
    },
    // 查看阅后即焚图片
    viewBurnAfterReadingImage(message) {
      this.currentBurnAfterReadingImage = message.content.originalPath;
      this.currentBurnAfterReadingMessage = message;
      this.$nextTick(() => {
        this.$refs.burnAfterReadingRef.open();
      });
    },
    // 关闭阅后即焚预览
    closeBurnAfterReadingPreview() {
      this.currentBurnAfterReadingImage = '';
      if (this.currentBurnAfterReadingMessage) {
        const index = this.list.indexOf(this.currentBurnAfterReadingMessage);
        if (index > -1) {
          this.list.splice(index, 1);
        }
        this.currentBurnAfterReadingMessage = null;
      }
    },
    // 切换附件菜单
    toggleAttachMenu(show) {
      this.showAttachMenu = show;
      console.log('附件菜单切换:', show);
    },
    // 处理遮罩层点击
    handleOverlayClick() {
      this.showAttachMenu = false;
      console.log('附件菜单已关闭');
    },
    // 滚动到底部
    scrollToBottom() {
      this.$nextTick(() => {
        const lastMessageIndex = this.list.length - 1;
        this.scrollIntoView = `message-${lastMessageIndex}`;
        this.showScrollToBottom = false;
        this.showNewMessageTip = false;
        this.hasNewMessages = false;
        this.isScrolledToBottom = true;
        console.log('滚动到底部');
      });
    },
    // 处理滚动事件
    onScroll(event) {
      const { scrollTop, scrollHeight } = event.detail;
      this.scrollViewScrollHeight = scrollHeight;
      const isAtBottom = scrollHeight - (scrollTop + this.scrollViewHeight) < 10;
      
      this.isScrolledToBottom = isAtBottom;
      this.showScrollToBottom = !isAtBottom && this.hasNewMessages;
      this.showNewMessageTip = !isAtBottom && this.hasNewMessages;
      if (isAtBottom) {
        this.hasNewMessages = false;
        this.showNewMessageTip = false;
      }
    },
    // 加载更多消息
    async loadMoreMessages() {
      if (this.hasMoreMessages && !this.isLoading) {
        this.isLoading = true;
        this.currentFrom = this.currentTo + 1;
        this.currentTo = this.currentTo + 10;
        await this.loadHistoryMessages(true);
        this.isLoading = false;
      }
    },
    // 添加新消息
    addNewMessage(message) {
      console.log('添加新消息:', message);
      this.list.push(message);
      if (!this.isScrolledToBottom) {
        this.hasNewMessages = true;
        this.showScrollToBottom = true;
        this.showNewMessageTip = true;
      } else {
        this.scrollToBottom();
      }
    },
    // 打开视频通话页面
    openVideoPage(action) {
      uni.navigateTo({
        url: `/pages/message/video-call?calleePeerId=${this.chatInfo.id}`
      });
    },
    // 拒绝视频通话
    rejectVideoCall() {
      this.peerStore.dataConnection.send({
        instruction: this.peerStore.instruction.reject
      });
      this.peerStore.dataConnection = undefined;
      this.peerStore.activateNotification = false;
    },
    // 接受视频通话
    acceptVideoCall() {
      this.peerStore.activateNotification = false;
      
      uni.showLoading({
        title: "等待对方连接...",
        mask: true
      });
      
      // 监听媒体连接是否存在
      let cancel = watch(() => this.peerStore.mediaConnection, newValue => {
        if (newValue) {
          // 关闭加载框
          uni.hideLoading();
          
          // 取消监听
          cancel();
          
          uni.navigateTo({
            url: "/pages/message/video-answer"
          });
        }
      }, {immediate: true});
      
      this.peerStore.dataConnection.send({
        instruction: this.peerStore.instruction.accept
      });
    },
    // 加载历史消息
    async loadHistoryMessages(isLoadingMore = false) {
      console.log('[loadHistoryMessages] 加载历史消息', { 
        isLoadingMore, 
        from: this.currentFrom, 
        to: this.currentTo,
        missionId: this.chatInfo.missionId 
      });

      try {
        const response = await getHistoryChatMessages({
          opponentId: this.chatInfo.id,
          from: this.currentFrom,
          to: this.currentTo,
          missionId: this.chatInfo.missionId
        });

        console.log('[loadHistoryMessages] 历史消息响应:', response);

        if (response.code === 200 && Array.isArray(response.data)) {
          const newMessages = response.data.reverse().map(msg => ({
            id: msg.id,
            content: msg.message,
            userType: msg.senderId === this.chatInfo.id ? 'other' : 'self',
            avatar: msg.senderId === this.chatInfo.id ? this.chatInfo.avatar[0] : this._selfAvatar,
            timestamp: new Date(msg.sendTime),
            type: msg.messageType,
            isRead: msg.isRead
          }));

          if (isLoadingMore) {
            this.list = [...newMessages, ...this.list];
          } else {
            this.list = newMessages;
          }
          
          this.hasMoreMessages = newMessages.length === (this.currentTo - this.currentFrom + 1);

          console.log('[loadHistoryMessages] 更新后的消息列表:', this.list);
          console.log('[loadHistoryMessages] 是否有更多消息:', this.hasMoreMessages);

          this.$nextTick(() => {
            if (!isLoadingMore) {
              console.log('[loadHistoryMessages] 加载初始消息后滚动到底部');
              this.scrollToBottom();
            }
          });
        } else {
          console.error('[loadHistoryMessages] 加载历史消息失败:', response.msg);
          uni.showToast({
            title: '加载历史消息失败',
            icon: 'none'
          });
        }
      } catch (error) {
        console.error('[loadHistoryMessages] 加载历史消息出错:', error);
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none'
        });
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
}

.new-message-tip {
  position: fixed;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  z-index: 1000;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 999;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.modal-content {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.modal button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  color: white;
  font-weight: bold;
}

.modal button[type="default"] {
  background-color: #4CAF50;
}

.modal button[type="warn"] {
  background-color: #f44336;
}
</style>