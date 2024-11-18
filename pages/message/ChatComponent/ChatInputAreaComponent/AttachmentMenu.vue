<template>
  <view class="attach-menu" :class="{ 'active': true }">
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
      attachOptions: [
        { icon: '/static/message/相册.png', label: '相册', action: 'album' },
        { icon: '/static/message/拍摄.png', label: '拍摄', action: 'camera' },
        { icon: '/static/message/视频通话.png', label: '视频通话', action: 'video-call' },
        { icon: '/static/message/文件传输.png', label: '文件传输', action: 'file' },
        { icon: '/static/message/阅后即焚.png', label: '阅后即焚', action: 'burn-after-reading' },
        { icon: '/static/message/位置.png', label: '位置', action: 'location' },
      ],
      selectedFile: null
    }
  },
  methods: {
    handleAttachItem(action) { 
      if (action === 'file') {
        this.chooseFile();
      } else if (action === 'location') { 
        this.$emit('attach', action);
      } else if (action === 'video-call') {
		  this.$emit('attach', action);
	  } else {
        this.$emit('attach', action);
      }
    },
    chooseFile() {
      // #ifdef H5 || MP-WEIXIN
      this.chooseFileH5();
      // #endif

      // #ifdef APP-PLUS
      if (uni.getSystemInfoSync().platform === 'android') {
        this.chooseFileAndroid();
      } else {
        this.chooseFileIOS();
      }
      // #endif
    },
    chooseFileH5() {
      uni.chooseFile({
        count: 1,
        success: (res) => {
          this.handleFileSelected(res.tempFiles[0]);
        },
        fail: (err) => {
          // console.error('选择文件失败', err);
          uni.showToast({ title: '选择文件失败', icon: 'none' });
        }
      });
    },
    chooseFileAndroid() {
      const main = plus.android.runtimeMainActivity();
      const Intent = plus.android.importClass('android.content.Intent');
      const intent = new Intent(Intent.ACTION_GET_CONTENT);
      intent.setType('*/*');
      intent.addCategory(Intent.CATEGORY_OPENABLE);

      main.startActivityForResult(intent, 200);

      main.onActivityResult = (requestCode, resultCode, data) => {
        if (requestCode === 200 && data) {
          const uri = data.getData();
          const path = uri.getPath();
          const DocumentsContract = plus.android.importClass('android.provider.DocumentsContract');
          const docId = DocumentsContract.getDocumentId(uri);
          const split = docId.split(':');
          const type = split[0];
          const MediaStore = plus.android.importClass('android.provider.MediaStore');
          const contentResolver = main.getContentResolver();
          plus.android.importClass(contentResolver);

          let cursor = contentResolver.query(MediaStore.Files.getContentUri('external'), ['_data'], '_id=?', [split[1]], null);
          plus.android.importClass(cursor);

          if (cursor && cursor.moveToFirst()) {
            const columnIndex = cursor.getColumnIndexOrThrow('_data');
            const filePath = cursor.getString(columnIndex);
            cursor.close();

            plus.io.resolveLocalFileSystemURL('file://' + filePath, (entry) => {
              entry.file((file) => {
                this.handleFileSelected({
                  name: file.name,
                  size: file.size,
                  path: filePath
                });
              });
            });
          }
        }
      };
    },
    chooseFileIOS() {
      plus.io.chooseFile({
        title: '选择文件',
        multiple: false,
        success: (res) => {
          this.handleFileSelected({
            name: res.files[0].name,
            size: res.files[0].size,
            path: res.files[0].path
          });
        },
        fail: (err) => {
          // console.error('选择文件失败', err);
          uni.showToast({ title: '选择文件失败', icon: 'none' });
        }
      });
    },
    handleFileSelected(file) {
      this.selectedFile = {
        name: file.name,
        size: this.formatFileSize(file.size),
        path: file.path
      };
      this.$emit('file-selected', this.selectedFile);
    },
    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
      else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
      else return (bytes / 1073741824).toFixed(2) + ' GB';
    }
  }
}
</script>

<style scoped>
.attach-menu {
  background-color: #F6F6F6;
  padding: 20px 15px;
}

.attach-menu.active {
  padding-bottom: 0px;
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