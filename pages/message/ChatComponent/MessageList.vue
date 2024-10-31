<template>
  <scroll-view 
    class="scroll-view" 
    scroll-y 
    scroll-with-animation 
    :scroll-top="scrollTop"
    :scroll-into-view="scrollIntoView"
    @scrolltoupper="$emit('load-more')"
    @scroll="onScroll"
  >
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
  props: {
    // messages: 消息列表数组
    messages: {
      type: Array,
      required: true
    },
    // scrollTop: 滚动条位置
    scrollTop: {
      type: Number,
      default: 0
    },
    // scrollIntoView: 需要滚动到的消息ID
    scrollIntoView: {
      type: String,
      default: ''
    }
  },
  methods: {
    // onScroll: 处理滚动事件
    onScroll(event) {
      this.$emit('scroll', event)
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-view {
  /* #ifdef H5 */
  height: calc(100vh - 44px - 120rpx);
  /* #endif */
  /* #ifndef H5 */
  height: calc(100vh - 120rpx);
  /* #endif */
  background: #eee;
  box-sizing: border-box;
}
</style>