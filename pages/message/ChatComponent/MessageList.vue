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
    onScroll(event) {
      this.$emit('scroll', event)
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
</style>