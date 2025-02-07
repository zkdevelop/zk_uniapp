<template>
  <view class="message-list-container">
    <scroll-view 
      class="scroll-view" 
      scroll-y 
      :scroll-top="internalScrollTop"
      @scroll="onScroll"
      :style="{ height: scrollViewHeight + 'px' }"
    >
      <!-- 加载更多按钮 -->
      <view v-if="showLoadMore" class="load-more-button" @click="handleLoadMore">
        <text class="load-more-text">点击加载更多</text>
      </view>

      <view class="message-list-content">
        <!-- 遍历消息列表，渲染每条消息 -->
        <message
          v-for="(item, index) in messages"
          :key="item.id || index"
          :id="`message-${index}`"
          :message="item"
          :is-group="isGroup"
          @view-burn-after-reading="$emit('view-burn-after-reading', $event)"
          @message-deleted="onMessageDeleted"
        />
      </view>
    </scroll-view>
  </view>
</template>

<script>
import Message from './Message.vue'

export default {
  name: 'MessageList',
  components: {
    Message
  },
  props: { 
    messages: {
      type: Array,
      required: true
    },
    scrollTop: {
      type: Number,
      default: 0
    },
    isGroup: {
      type: Boolean,
      default: false
    },
    onMessageDeleted: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      showLoadMore: false,
      internalScrollTop: 0,
      scrollViewHeight: 0,
      lastContentHeight: 0,
      isScrolling: false // 标记是否正在滚动
    }
  },
  watch: {
    messages: {
      handler(newMessages, oldMessages) { 
        this.$nextTick(async () => {
          const newContentHeight = await this.getContentHeight(); 

          if (!oldMessages || newMessages.length > oldMessages.length) {
            // 新消息被添加
            if (!oldMessages || (newMessages.length - oldMessages.length === 1 && 
                newMessages[newMessages.length - 1].userType === 'self')) { 
              this.scrollToBottom(true); // 强制滚动
            } else {
              // 如果是加载更多消息，保持滚动位置
              const heightDifference = newContentHeight - this.lastContentHeight;
              console.log('加载更多消息，保持位置。高度差:', heightDifference);
              if (heightDifference > 0) {
                this.setScrollTop(this.internalScrollTop + heightDifference);
              }
            }
          }
          this.lastContentHeight = newContentHeight;
        });
      },
      immediate: true
    }
  },
  mounted() {
    console.log('MessageList组件挂载');
    this.initScrollViewHeight();
    this.getContentHeight().then(height => {
      this.lastContentHeight = height; 
      this.$nextTick(() => {
        this.scrollToBottom(true);
      });
    });
  },
  methods: {
    initScrollViewHeight() {
      const query = uni.createSelectorQuery().in(this);
      query.select('.message-list-container').boundingClientRect(data => {
        if (data) {
          this.scrollViewHeight = data.height;
          console.log('滚动视图高度初始化:', this.scrollViewHeight);
        }
      }).exec();
    },
    async getContentHeight() {
      return new Promise((resolve) => {
        const query = uni.createSelectorQuery().in(this);
        query.select('.message-list-content').boundingClientRect(data => {
          if (data) { 
            resolve(data.height);
          } else {
            console.log('无法获取内容高度');
            resolve(0);
          }
        }).exec();
      });
    },
    onScroll(event) {
      if (this.isScrolling) return;
      
      const { scrollTop, scrollHeight } = event.detail;
      console.log('滚动事件:', { scrollTop, scrollHeight });
      
      this.showLoadMore = scrollTop < 50;
      this.$emit('scroll', event);
    },
    handleLoadMore() {
      console.log('触发加载更多');
      this.$emit('load-more');
    },
    async scrollToBottom(force = false) { 
      if (this.isScrolling && !force) {
        console.log('已在滚动中，跳过');
        return;
      }

      this.isScrolling = true;
      try {
        const contentHeight = await this.getContentHeight(); 
        const scrollTop = Math.max(0, contentHeight - this.scrollViewHeight);
        this.setScrollTop(scrollTop);
        
        // 确保滚动完成
        await new Promise(resolve => setTimeout(resolve, 100));
        this.setScrollTop(scrollTop); // 再次设置以确保滚动到位
      } finally {
        setTimeout(() => {
          this.isScrolling = false;
        }, 200);
      }
    },
    setScrollTop(value) { 
      this.internalScrollTop = value;
    }
  }
}
</script>

<style lang="scss" scoped>
.message-list-container {
  flex: 1;
  overflow: hidden;
}

.scroll-view { 
  background: #eee;
}

.message-list-content {
  padding: 30rpx 30rpx 240rpx;
}

.load-more-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
  background: transparent;
}
</style>

