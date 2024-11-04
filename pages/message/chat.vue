<template>
  <view class="page">
    <ChatHeader :chat-info="chatInfo" @go-back="goBack" />

    <button @click.stop="simulateNewMessage" class="simulate-button">模拟新消息</button>

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
      @attach="handleAttachment"
      @toggle-attach-menu="toggleAttachMenu"
      :show-attach-menu="showAttachMenu"
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

    <div v-if="showAttachMenu" class="overlay" @click="handleOverlayClick"></div>
  </view>
</template>

<script>
import ChatHeader from './ChatComponent/ChatHeader.vue'
import MessageList from './ChatComponent/MessageList.vue'
import ChatInputArea from './ChatComponent/ChatInputArea.vue'
import BurnAfterReading from './ChatComponent/BurnAfterReading.vue'
import ScrollToBottomButton from './ChatComponent/ScrollToBottomButton.vue'

const groupChatHistory = [
  { id: 1, name: '张三', avatar: '../../static/c1.png', content: '大家好，我是张三', userType: 'friend', messageType: 'text', timestamp: new Date('2023-07-21T10:00:00') },
  { id: 2, name: '李四', avatar: '../../static/c2.png', content: '你好张三，我是李四', userType: 'friend', messageType: 'text', timestamp: new Date('2023-07-21T10:01:00') },
  { id: 3, name: '王五', avatar: '../../static/c3.png', content: '大家好，我是王五', userType: 'friend', messageType: 'text', timestamp: new Date('2023-07-21T10:02:00') },
  { id: 4, name: '赵六', avatar: '../../static/c4.png', content: '../../static/image1.jpg', userType: 'friend', messageType: 'image', timestamp: new Date('2023-07-21T10:03:00') },
  { id: 5, name: '张三', avatar: '../../static/c1.png', content: '这是一个很有意思的话题', userType: 'friend', messageType: 'text', timestamp: new Date('2023-07-21T10:04:00') },
  { id: 6, name: '李四', avatar: '../../static/c2.png', content: { name: '会议纪要.docx', size: '2.5MB' }, userType: 'friend', messageType: 'file', timestamp: new Date('2023-07-21T10:05:00') },
  { id: 7, name: '王五', avatar: '../../static/c3.png', content: '我同意张三的观点', userType: 'friend', messageType: 'text', timestamp: new Date('2023-07-21T10:06:00') },
  { id: 8, name: '赵六', avatar: '../../static/c4.png', content: '我们下周一开会讨论这个问题吧', userType: 'friend', messageType: 'text', timestamp: new Date('2023-07-21T10:07:00') },
];

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
    };
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
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
    initializeChat() {
      this.list = this.chatInfo.type === 'group' ? groupChatHistory : [
        {
          content: '对方历史回复消息',
          userType: 'friend',
          avatar: this.chatInfo.avatar[0],
          name: this.chatInfo.name,
          timestamp: new Date('2023-07-21T09:58:00')
        },
        {
          content: '历史消息',
          userType: 'self',
          avatar: this._selfAvatar,
          timestamp: new Date('2023-07-21T09:59:00')
        }
      ];
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
          // 返回成功后，触发更新tabBar激活状态的事件
          uni.$emit('updateTabBarActiveTab', 1);
        },
        fail: (err) => {
          console.error('返回失败:', err);
          // 如果navigateBack失败，尝试使用reLaunch
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
      if (message.trim()) {
        this.addNewMessage({
          content: message,
          userType: 'self',
          avatar: this._selfAvatar,
          timestamp: new Date()
        });
        this.chatInfo.type === 'group' ? this.simulateGroupResponse() : this.simulateSingleResponse();
      }
    },
    simulateGroupResponse() {
      setTimeout(() => {
        const randomMember = groupChatHistory[Math.floor(Math.random() * groupChatHistory.length)];
        this.addNewMessage({
          content:  `这是来自${randomMember.name}的回复`,
          userType: 'friend',
          avatar: randomMember.avatar,
          name: randomMember.name,
          timestamp: new Date()
        });
      }, 1500);
    },
    simulateSingleResponse() {
      setTimeout(() => {
        this.addNewMessage({
          content: '这是对方的回复',
          userType: 'friend',
          avatar: this.chatInfo.avatar[0],
          name: this.chatInfo.name,
          timestamp: new Date()
        });
      }, 1500);
    },
    handleAttachment(type, data) {
      const handlers = {
        album: this.chooseImage,
        file: () => this.handleFileTransfer(data),
        'burn-after-reading': () => this.handleBurnAfterReading(data)
      };
      handlers[type] && handlers[type]();
    },
    chooseImage() {
      uni.chooseImage({
        success: (res) => {
          this.addNewMessage({
            content: res.tempFilePaths[0],
            userType: 'self',
            messageType: 'image',
            avatar: this._selfAvatar,
            timestamp: new Date()
          });
          setTimeout(() => {
            this.addNewMessage({
              content: '你好呀，朋友~',
              userType: 'friend',
              avatar: this.chatInfo.avatar[0],
              name: this.chatInfo.name,
              timestamp: new Date()
            });
          }, 1500);
        }
      });
    },
    handleFileTransfer(fileData) {
      this.addNewMessage({
        content: fileData,
        userType: 'self',
        messageType: 'file',
        avatar: this._selfAvatar,
        timestamp: new Date()
      });
      setTimeout(() => {
        this.addNewMessage({
          content: '收到文件了，谢谢！',
          userType: 'friend',
          avatar: this.chatInfo.avatar[0],
          name: this.chatInfo.name,
          timestamp: new Date()
        });
      }, 1500);
    },
    handleBurnAfterReading(imageData) {
      this.addNewMessage({
        content: imageData,
        userType: 'self',
        messageType: 'burn-after-reading',
        avatar: this._selfAvatar,
        timestamp: new Date()
      });
      setTimeout(() => {
        this.addNewMessage({
          content: '收到了一张阅后即焚的图片',
          userType: 'friend',
          avatar: this.chatInfo.avatar[0],
          name: this.chatInfo.name,
          timestamp: new Date()
        });
      }, 1500);
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
      console.log('滚动事件:', { scrollTop, scrollHeight, isAtBottom });
    },
    loadMoreMessages() {
      console.log('加载更多消息');
    },
    addNewMessage(message) {
      this.list.push(message);
      if (!this.isScrolledToBottom) {
        this.hasNewMessages = true;
        this.showScrollToBottom = true;
        this.showNewMessageTip = true;
      } else {
        this.scrollToBottom();
      }
      console.log('新消息已添加:', message);
    },
    simulateNewMessage() {
      const randomMember = groupChatHistory[Math.floor(Math.random() * groupChatHistory.length)];
      this.addNewMessage({
        content: `这是一条新消息，来自${randomMember.name}`,
        userType: 'friend',
        avatar: randomMember.avatar,
        name: randomMember.name,
        timestamp: new Date()
      });
    }
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

.simulate-button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.new-message-tip {
  position: fixed;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px  10px;
  border-radius: 15px;
  font-size: 14px;
  z-index: 1000;
}

.overlay {
  position: fixed;
  top:  0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 999;
}
</style>