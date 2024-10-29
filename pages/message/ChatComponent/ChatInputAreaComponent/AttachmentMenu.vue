<template>
  <view class="attach-menu" :class="{ 'active': true }">
    <view 
      v-for="option in attachOptions" 
      :key="option.action" 
      class="attach-option" 
      @click="attachItem(option.action)"
    >
      <image :src="option.icon" class="attach-icon" />
      <text>{{ option.label }}</text>
    </view>
    <!-- 使用插槽为未实现的功能预留位置 -->
    <slot name="album"></slot>
    <slot name="camera"></slot>
    <slot name="video-call"></slot>
    <slot name="location"></slot>
  </view>
</template>

<script>
export default {
  name: 'AttachmentMenu',
  data() {
    return {
      attachOptions: [
        { icon: '../icon//c1.png', label: '相册', action: 'album' },
        { icon: '../../../static/c1.png', label: '拍摄', action: 'camera' },
        { icon: '../../../static/c1.png', label: '视频通话', action: 'video-call' },
        { icon: '../../../static/c1.png', label: '文件传输', action: 'file' },
        { icon: '../../../static/c1.png', label: '阅后即焚', action: 'burn-after-reading' },
        { icon: '../../../static/c1.png', label: '位置', action: 'location' },
      ],
    }
  },
  methods: {
    attachItem(action) {
      this.$emit('attach', action);
    }
  }
}
</script>

<style scoped>
.attach-menu {
  background-color: #fff;
  padding: 20px 20px 0 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 230px;
  overflow: hidden;
  transition: height 0.3s ease-in-out;
}

.attach-option {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.attach-icon {
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
}
</style>