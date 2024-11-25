<template>
  <view class="chat-page">
    <!-- 聊天头部 -->
    <ChatHeader :chat-info="chatInfo" @go-back="goBack" />

    <!-- 消息列表 -->
    <MessageList
      ref="messageList"
      :messages="list"
      @load-more="loadMoreMessages"
      @scroll="onScroll"
      @view-burn-after-reading="viewBurnAfterReadingImage"
    />

    <!-- 聊天输入区域 -->
    <ChatInputArea 
      @send-message="sendMessage"
      @message-sent="handleImageOrFileSent"
      @message-failed="handleMessageFailed"
      @attach="handleAttachment"
      @video-call="openVideoPage"
      @toggle-attach-menu="toggleAttachMenu"
      :show-attach-menu="showAttachMenu"
      :recipientId="chatInfo.id"
      :missionId="chatInfo.missionId.toString()"
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
import { getHistoryChatMessages, sendMessageToUser } from '@/utils/api/message.js'
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
        missionId: ''
      },
      list: [],
      showAttachMenu: false,
      burnAfterReadingDuration: 5,
      currentBurnAfterReadingImage: '',
      currentBurnAfterReadingMessage: null,
      isScrolledToBottom: true,
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
      if (!this.chatInfo.missionId) {
        const userStore = useUserStore();
        this.chatInfo.missionId = userStore.missionId.toString();
      } else if (Array.isArray(this.chatInfo.missionId)) {
        this.chatInfo.missionId = this.chatInfo.missionId.join(',');
      }
      console.log('使用的 missionId:', this.chatInfo.missionId);
      this.initializeChat();
    });
  },
  mounted() {
    console.log('聊天组件已挂载');
    console.log('peerStore 初始状态:', this.peerStore);
  },
  methods: {
    async initializeChat() {
      await this.loadHistoryMessages();
      this.$nextTick(this.scrollToBottom);
    },
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
    async sendMessage(message) {
      console.log('[sendMessage] 发送消息:', message);
      if (message.type === 'image' || message.type === 'file') {
        console.log('[sendMessage] 跳过图片和文件类型的发送');
        return;
      }
      if (message.content && this.chatInfo.id) {
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

        try {
          const response = await sendMessageToUser({
            message: typeof message.content === 'object' ? JSON.stringify(message.content) : message.content,
            recipientId: this.chatInfo.id,
            messageType: message.type || 'text',
            missionId: this.chatInfo.missionId,
            isPosition: message.type === 'location'
          });
          console.log('[sendMessage] 发送消息响应:', response);
          if (response.code === 200) {
            this.handleMessageSent(response.data);
          } else {
            throw new Error(response.msg || '发送消息失败');
          }
        } catch (error) {
          console.error('[sendMessage] 发送消息失败:', error);
          this.handleMessageFailed(newMessage);
        }
      } else {
        console.error('[sendMessage] 消息内容为空或 recipientId 未设置', {
          content: message.content,
          recipientId: this.chatInfo.id
        });
      }
    },
    handleImageOrFileSent(message) {
      console.log('[handleImageOrFileSent] 收到图片或文件数据:', message);
      this.addNewMessage({
        id: Date.now().toString(),
        content: message.content,
        userType: 'self',
        avatar: this._selfAvatar,
        timestamp: new Date(),
        status: 'sent',
        type: message.type
      });
    },
    handleMessageSent(sentMessage) {
      console.log('[handleMessageSent] 消息已发送:', sentMessage);
      const tempMessage = this.list.find(m => m.content === sentMessage.message || m.content === sentMessage.content);
      if (tempMessage) {
        tempMessage.id = sentMessage.id || tempMessage.id;
        tempMessage.status = 'sent';
      }
    },
    handleMessageFailed(failedMessage) {
      console.log('[handleMessageFailed] 消息发送失败:', failedMessage);
      const tempMessage = this.list.find(m => m.content === failedMessage.content && m.type === failedMessage.type);
      if (tempMessage) {
        tempMessage.status = 'failed';
      }
    },
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
    handleFileTransfer(fileData) {
      this.addNewMessage({
        content: fileData,
        userType: 'self',
        type: 'file',
        avatar: this._selfAvatar,
        timestamp: new Date()
      });
    },
    handleBurnAfterReading(imageData) {
      this.addNewMessage({
        content: imageData,
        userType: 'self',
        type: 'burn-after-reading',
        avatar: this._selfAvatar,
        timestamp: new Date()
      });
    },
    handleLocationMessage(locationData) {
      console.log('[handleLocationMessage] 处理位置消息:', locationData);
      this.sendMessage({
        type: 'location',
        content: locationData
      });
    },
    viewBurnAfterReadingImage(message) {
      this.currentBurnAfterReadingImage = message.content.originalPath;
      this.currentBurnAfterReadingMessage = message;
      this.$nextTick(() => {
        this.$refs.burnAfterReadingRef.open();
      });
    },
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
    toggleAttachMenu(show) {
      this.showAttachMenu = show;
      console.log('附件菜单切换:', show);
    },
    handleOverlayClick() {
      this.showAttachMenu = false;
      console.log('附件菜单已关闭');
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.messageList.scrollToBottom();
        this.showScrollToBottom = false;
        this.showNewMessageTip = false;
        this.hasNewMessages = false;
        this.isScrolledToBottom = true;
        console.log('滚动到底部');
      });
    },
    onScroll(event) {
      const { scrollTop, scrollHeight } = event.detail;
      const isAtBottom = scrollHeight - (scrollTop + this.$refs.messageList.scrollViewHeight) < 10;
      
      this.isScrolledToBottom = isAtBottom;
      this.showScrollToBottom = !isAtBottom && this.hasNewMessages;
      this.showNewMessageTip = !isAtBottom && this.hasNewMessages;
      if (isAtBottom) {
        this.hasNewMessages = false;
        this.showNewMessageTip = false;
      }
    },
    async loadMoreMessages() {
      console.log('[loadMoreMessages] 开始加载更多消息');
      if (this.hasMoreMessages && !this.isLoading) {
        this.isLoading = true;
        
        const oldContentHeight = await this.$refs.messageList.getContentHeight();
        console.log('[loadMoreMessages] 旧内容高度:', oldContentHeight);

        this.currentFrom = this.currentTo + 1;
        this.currentTo = this.currentTo + 10;
        await this.loadHistoryMessages(true);
        
        this.$nextTick(async () => {
          const newContentHeight = await this.$refs.messageList.getContentHeight();
          console.log('[loadMoreMessages] 新内容高度:', newContentHeight);

          const heightDifference = newContentHeight - oldContentHeight;
          console.log('[loadMoreMessages] 高度差:', heightDifference);
          
          this.$refs.messageList.setScrollTop(heightDifference);

          this.isLoading = false;
          console.log('[loadMoreMessages] 加载完成');
        });
      } else {
        console.log('[loadMoreMessages] 没有更多消息或正在加载中');
      }
    },
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
    openVideoPage(action) {
      uni.navigateTo({
        url: `/pages/message/video-call?calleePeerId=${this.chatInfo.id}`
      });
    },
    rejectVideoCall() {
      console.log('拒绝视频通话，peerStore 状态:', this.peerStore);
      this.peerStore.dataConnection.send({
        instruction: this.peerStore.instruction.reject
      });
      this.peerStore.dataConnection = undefined;
      this.peerStore.activateNotification = false;
    },
    acceptVideoCall() {
      console.log('接受视频通话，peerStore 状态:', this.peerStore);
      this.peerStore.activateNotification = false;
      
      uni.showLoading({
        title: "等待对方连接...",
        mask: true
      });
      
      let cancel = watch(() => this.peerStore.mediaConnection, newValue => {
        if (newValue) {
          uni.hideLoading();
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
    async loadHistoryMessages(isLoadingMore = false) {
      console.log('[loadHistoryMessages] 开始加载历史消息', { 
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
          const newMessages = response.data.reverse().map(msg => {
            let content = msg.message;
            let type = msg.messageType.toLowerCase();

            if (type === 'position') {
              try {
                content = JSON.parse(msg.message);
                type = 'location'; // 将 'position' 类型映射为 'location'
              } catch (e) {
                console.error('解析位置数据失败:', e);
              }
            } else if (type === 'image') {
              content = msg.previewUrl || msg.message; // 使用 previewUrl 作为图片消息的内容，如果不存在则使用 message
            }

            return {
              id: msg.id,
              content: content,
              userType: msg.senderId === this.chatInfo.id ? 'other' : 'self',
              avatar: msg.senderId === this.chatInfo.id ? this.chatInfo.avatar[0] : this._selfAvatar,
              timestamp: new Date(msg.sendTime),
              type: type,
              isRead: msg.isRead
            };
          });

          console.log('[loadHistoryMessages] 新消息数量:', newMessages.length);

          if (isLoadingMore) {
            this.list = [...newMessages, ...this.list];
            console.log('[loadHistoryMessages] 在列表前端添加新消息');
          } else {
            this.list = newMessages;
            console.log('[loadHistoryMessages] 替换整个消息列表');
          }
          
          this.hasMoreMessages = newMessages.length === (this.currentTo - this.currentFrom + 1);

          console.log('[loadHistoryMessages] 更新后的消息列表长度:', this.list.length);
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