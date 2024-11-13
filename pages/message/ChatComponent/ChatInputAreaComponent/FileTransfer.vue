<template>
  <view class="file-transfer">
    <view v-if="selectedFile" class="file-info">
      <text class="file-name">文件名: {{ selectedFile.name }}</text>
      <text class="file-size">大小: {{ selectedFile.size }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'FileTransfer',
  props: {
    selectedFile: {
      type: Object,
      default: null
    }
  },
  methods: {
    uploadFile() {
      if (!this.selectedFile) {
        uni.showToast({ title: '请先选择文件', icon: 'none' });
        return;
      }

      uni.uploadFile({
        url: 'https://your-upload-api-url.com', // 替换为实际的上传 API 地址
        filePath: this.selectedFile.path,
        name: 'file',
        formData: {
          'user': 'test'
        },
        success: (uploadRes) => {
          console.log('上传成功', uploadRes);
          uni.showToast({ title: '上传成功', icon: 'success' });
          this.$emit('file-uploaded', uploadRes);
        },
        fail: (err) => {
          console.error('上传失败', err);
          uni.showToast({ title: '上传失败，请重试', icon: 'none' });
        }
      });
    }
  }
}
</script>

<style scoped>
.file-transfer {
  padding: 10px;
}

.file-info {
  background-color: #F0F0F0;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.file-name, .file-size {
  display: block;
  margin-bottom: 5px;
}
</style>