<template>
  <view class="page">
    <ChatHeader :chat-info="chatInfo" @go-back="goBack" />

    <MessageList
      :messages="list"
      :scroll-top="scrollTop"
      :scroll-into-view="scrollIntoView"
      @load-more="loadMoreMessages"
      @scroll="onScroll"
      @view-burn-after-reading="viewBurnAfterReadingImage"
    />

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

    <BurnAfterReading
      v-if="currentBurnAfterReadingImage"
      :imageSrc="currentBurnAfterReadingImage"
      :duration="burnAfterReadingDuration"
      @close="closeBurnAfterReadingPreview"
      ref="burnAfterReadingRef"
    />

    <ScrollToBottomButton
      :show="showScrollToBottom"
      @click.stop="scrollToBottom"
    />

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

    <div v-if="showAttachMenu" class="overlay" @click="handleOverlayClick"></div>
  </view>
</template>

<script>
import ChatHeader from './ChatComponent/ChatHeader.vue'
import MessageList from './ChatComponent/MessageList.vue'
import ChatInputArea from './ChatComponent/ChatInputArea.vue'
import BurnAfterReading from './ChatComponent/BurnAfterReading.vue'
import ScrollToBottomButton from './ChatComponent/ScrollToBottomButton.vue'
import { getHistoryChatMessages } from '@/utils/api/message.js'
import usePeerStore from '../../store/peer'
import useFriendStore from '../../store/friend'

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
        type: 'single'
      },
      list: [],
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
      this.initializeChat();
    });
  },
  mounted() {
    this.getScrollViewInfo();
    console.log('聊天组件已挂载');
  },
  methods: {
    async initializeChat() {
      await this.loadHistoryMessages();
      this.$nextTick(this.scrollToBottom);
    },
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
    handleMessageSent(sentMessage) {
      console.log('[handleMessageSent] 消息已发送:', sentMessage);
      const tempMessage = this.list.find(m => m.content === sentMessage.message);
      if (tempMessage) {
        tempMessage.id = sentMessage.id;
        tempMessage.status = 'sent';
      }
    },
    handleMessageFailed(failedMessage) {
      console.log('[handleMessageFailed] 消息发送失败:', failedMessage);
      const tempMessage = this.list.find(m => m.content === failedMessage);
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
        const lastMessageIndex = this.list.length - 1;
        this.scrollIntoView = `message-${lastMessageIndex}`;
        this.showScrollToBottom = false;
        this.showNewMessageTip = false;
        this.hasNewMessages = false;
        this.isScrolledToBottom = true;
        console.log('滚动到底部');
      });
    },
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
    async loadMoreMessages() {
      if (this.hasMoreMessages && !this.isLoading) {
        this.isLoading = true;
        this.currentFrom = this.currentTo + 1;
        this.currentTo = this.currentTo + 10;
        await this.loadHistoryMessages(true);
        this.isLoading = false;
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
		// 处理音视频通话
		// if (this.peerStore.localPeer && this.peerStore.localPeer.open) {
		// 	if (this.peerStore.dataConnection) {
		// 		uni.showToast({
		// 			title: 'currently busy',
		// 			icon: 'none'
		// 		})
		// 	} else {
		// 		uni.navigateTo({
		// 			url: `/pages/message/video-call?calleePeerId=${friendStore.onlineList[0]}`
		// 		})
		// 	}
		// } else {
		// 	uni.showToast({
		// 		title: 'local peer not opened',
		// 		icon: 'none'
		// 	})
		// }
				uni.navigateTo({
					url: `/pages/message/video-call?calleePeerId=${this.callerPeerId}`
				})
	},
	rejectVideoCall() {
		peerStore.dataConnection.send({
			instruction: peerStore.instruction.reject
		});
		peerStore.dataConnection = undefined;
		peerStore.activateNotification = false;
	},
	acceptVideoCall() {
		peerStore.activateNotification = false;
		
		uni.showLoading({
			title: "waiting for the other party to connect...",
			mask: true
		})
		
		//监听媒体连接是否存在，有可能速度比较快，所以立即执行以下
		let cancel = watch(() => peerStore.mediaConnection, newValue => {
		    if (newValue) {
				//关闭加载框
				uni.hideLoading();
		
				//取消监听；如果不取消会出现重复执行
				cancel();
		
				uni.navigateTo({
					url: "/pages/message/video-answer"
				})
		    }
		}, {immediate: true});
		
		peerStore.dataConnection.send({
		    instruction: peerStore.instruction.accept
		});
	},
    async loadHistoryMessages(isLoadingMore = false) {
      console.log('[loadHistoryMessages] 加载历史消息', { isLoadingMore, from: this.currentFrom, to: this.currentTo });

      try {
        const response = await getHistoryChatMessages({
          opponentId: this.chatInfo.id,
          from: this.currentFrom,
          to: this.currentTo
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
.page {
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
</style>