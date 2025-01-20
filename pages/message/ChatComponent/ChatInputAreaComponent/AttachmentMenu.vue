<template>
  <view class="attach-menu">
    <view class="attach-row">
      <view 
        v-for="option in attachOptions.slice(0, 4)" 
        :key="option.action" 
        class="attach-option"
        @click="handleAttachItem(option.action)"
      >
        <view class="icon-wrapper">
          <image :src="option.icon" class="attach-icon" mode="aspectFit" />
        </view>
        <text class="attach-label">{{ option.label }}</text>
      </view>
    </view>
    <view class="attach-row second-row">
      <view 
        v-for="option in attachOptions.slice(4, 6)" 
        :key="option.action" 
        class="attach-option"
        @click="handleAttachItem(option.action)"
      >
        <view class="icon-wrapper">
          <image :src="option.icon" class="attach-icon" mode="aspectFit" />
        </view>
        <text class="attach-label">{{ option.label }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AttachmentMenu',
  data() {
    return {
      // 附件选项配置
      attachOptions: [
        { icon: '/static/message/相册.png', label: '相册', action: 'album' },
        { icon: '/static/message/拍摄.png', label: '拍摄', action: 'camera' },
        { icon: '/static/message/视频通话.png', label: '视频通话', action: 'video-call' },
        { icon: '/static/message/文件传输.png', label: '文件传输', action: 'file' },
        { icon: '/static/message/阅后即焚.png', label: '阅后即焚', action: 'burn-after-reading' },
        { icon: '/static/message/位置.png', label: '位置', action: 'location' },
      ]
    }
  },
  methods: {
    // 处理附件项点击
    handleAttachItem(action) { 
      this.$emit('attach', action)
      // 发送关闭事件
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.attach-menu {
  padding: 20px 15px;
}

.attach-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
}

.attach-row.second-row {
  justify-content: flex-start;
  margin-bottom: 20px;
}

.attach-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(25% - 22px);
}

.attach-row.second-row .attach-option {
  margin-right: 29.33px;
}

.attach-row.second-row .attach-option:last-child {
  margin-right: 0;
}

.icon-wrapper {
  width: 58px;
  height: 58px;
  background-color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  position: relative;
  border-radius: 10px;
}

.attach-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
}

.attach-label {
  font-size: 12px;
  line-height: 12px;
  text-align: center;
}
</style>

