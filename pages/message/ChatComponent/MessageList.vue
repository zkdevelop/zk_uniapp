<template>
  <scroll-view 
    class="scroll-view" 
    scroll-y 
    scroll-with-animation 
    :scroll-top="scrollTop"
    :scroll-into-view="scrollIntoView"
    @scroll="onScroll"
  >
    <!-- 加载更多按钮 -->
    <view v-if="showLoadMore" class="load-more-button" @click="handleLoadMore">
      <text class="load-more-text">点击加载更多</text>
    </view>

    <view style="padding: 30rpx 30rpx 240rpx;">
      <!-- 遍历消息列表，渲染每条消息 -->
      <message
        v-for="(item, index) in messages"
        :key="index"
        :id="`message-${index}`"
        :message="item"
        @view-burn-after-reading="$emit('view-burn-after-reading', $event)"
      />
    </view>
  </scroll-view>
</template>

<script>
import Message from './Message.vue'

export default {
  name: 'MessageList',
  components: {
    Message
  },
  data() {
    return {
      showLoadMore: false // 控制是否显示加载更多按钮
    }
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
    scrollIntoView: {
      type: String,
      default: ''
    }
  },
  methods: { 
    // 处理滚动事件
    onScroll(event) {
      const { scrollTop } = event.detail
      // 当滚动到顶部附近时显示加载更多按钮
      this.showLoadMore = scrollTop < 50
      // 将滚动事件传递给父组件
      this.$emit('scroll', event)
    },
    // 处理加载更多按钮点击事件
    handleLoadMore() {
      // 触发加载更多事件，由父组件处理
      this.$emit('load-more')
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-view { 
  height: calc(100vh - 44px - 120rpx);  
  height: calc(100vh - 120rpx); 
  background: #eee;
  box-sizing: border-box;
}

.load-more-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
  background: transparent;
}

.load-more-text {
  color: #007AFF;
  font-size: 28rpx;
  line-height: 40rpx;
  /* 移除 writing-mode 属性，使文本横向显示 */
}
</style>