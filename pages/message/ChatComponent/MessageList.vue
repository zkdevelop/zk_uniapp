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
    }
  },
  data() {
    return {
      showLoadMore: false, // 控制是否显示"加载更多"按钮
      internalScrollTop: 0, // 内部管理的滚动位置
      scrollViewHeight: 0, // 滚动视图的高度
      lastContentHeight: 0 // 上一次内容的高度
    }
  },
  watch: {
    messages: {
      handler(newMessages, oldMessages) {
        this.$nextTick(() => {
          const newContentHeight = this.getContentHeight();
          if (newMessages.length > oldMessages.length) {
            // 新消息被添加
            if (newMessages.length - oldMessages.length === 1 && newMessages[newMessages.length - 1].userType === 'self') {
              // 如果是用户发送的新消息，滚动到底部
              this.scrollToBottom();
            } else {
              // 如果是加载更多消息，保持滚动位置
              const heightDifference = newContentHeight - this.lastContentHeight;
              this.internalScrollTop += heightDifference;
            }
          }
          this.lastContentHeight = newContentHeight;
        });
      },
      immediate: true
    }
  },
  mounted() {
    // 组件挂载后初始化滚动视图高度和内容高度
    this.initScrollViewHeight();
    this.lastContentHeight = this.getContentHeight();
  },
  methods: {
    // 初始化滚动视图高度
    initScrollViewHeight() {
      const query = uni.createSelectorQuery().in(this);
      query.select('.message-list-container').boundingClientRect(data => {
        if (data) {
          this.scrollViewHeight = data.height;
          console.log('滚动视图高度:', this.scrollViewHeight);
        }
      }).exec();
    },
    // 获取内容高度
    getContentHeight() {
      const query = uni.createSelectorQuery().in(this);
      return new Promise((resolve) => {
        query.select('.message-list-content').boundingClientRect(data => {
          if (data) {
            console.log('内容高度:', data.height);
            resolve(data.height);
          } else {
            resolve(0);
          }
        }).exec();
      });
    },
    // 处理滚动事件
    onScroll(event) {
      const { scrollTop, scrollHeight } = event.detail;
      this.showLoadMore = scrollTop < 50; // 当滚动到顶部附近时显示加载更多按钮
      this.$emit('scroll', event); // 将滚动事件传递给父组件
    },
    // 处理加载更多按钮点击事件
    handleLoadMore() {
      this.$emit('load-more'); // 触发加载更多事件，由父组件处理
    },
    // 滚动到底部
    scrollToBottom() {
      this.$nextTick(async () => {
        const contentHeight = await this.getContentHeight();
        this.internalScrollTop = contentHeight - this.scrollViewHeight;
      });
    },
    // 设置滚动位置
    setScrollTop(value) {
      console.log('设置滚动位置:', value);
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

