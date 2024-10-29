<template>
  <!-- 文件传输组件 -->
  <view>
    <view class="file-message" v-if="fileData">
      <view class="file-icon">📄</view>
      <view class="file-info">
        <text class="file-name">{{ fileData.name }}</text>
        <text class="file-size">{{ fileData.size }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'FileTransfer',
  // 组件属性定义
  props: {
    fileData: {
      type: Object,
      default: null
    }
  },
  // 组件方法
  methods: {
    chooseFile() {
      // 调用uni-app的文件选择API
      uni.chooseFile({
        count: 1,
        extension: ['.doc', '.docx', '.pdf', '.txt'],
        success: (res) => {
          const file = res.tempFiles[0];
          this.$emit('file-selected', {
            name: file.name,
            size: this.formatFileSize(file.size),
            path: file.path
          });
        },
        fail: (err) => {
          console.error('选择文件失败', err);
        }
      });
    },
    formatFileSize(bytes) {
      // 格式化文件大小，转换为合适的单位
      if (bytes < 1024) return bytes + ' B';
      else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
      else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
      else return (bytes / 1073741824).toFixed(2) + ' GB';
    }
  }
}
</script>

<style scoped>
.file-message {
  display: flex;
  align-items: center;
}

.file-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.file-info {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: bold;
  margin-bottom: 5rpx;
}

.file-size {
  font-size: 24rpx;
  color: #888;
}
</style>