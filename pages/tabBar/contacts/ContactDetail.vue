<template>
  <view class="contact-detail">
    <view class="header">
      <view class="back-button" @click="handleClose">
        <text class="icon">←</text>
      </view>
      <view class="more-options">
        <text class="icon">⋯</text>
      </view>
    </view>

    <scroll-view class="content" scroll-y>
      <view class="main-info">
        <view class="profile-section">
          <image class="avatar" :src="contact.avatar" mode="aspectFill"></image>
          <view class="name-container">
            <view class="name-badge-container">
              <text class="name">{{ contact.name }}</text>
              <view class="badge">
                <text class="badge-text">{{ contact.title }}</text>
              </view>
            </view>
            <view class="info-item">
              <text class="info-label">用户名</text>
              <text class="info-value">{{ contact.username }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">设备IP</text>
              <text class="info-value">{{ contact.ip }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="remark-section">
        <view class="action-item" @click="handleRemark">
          <text class="action-text">备注</text>
          <text class="icon">›</text>
        </view>
      </view>

      <view class="message-button" @click="handleMessage">
        <text class="button-text">发信息</text>
      </view>

      <view class="clear-history" @click="handleClearHistory">
        <text class="button-text">清空聊天记录</text>
      </view>

      <view class="delete-contact" @click="handleDelete">
        <text class="button-text">删除联系人</text>
      </view>
    </scroll-view>

    <!-- 自定义弹窗 -->
    <view v-if="showModal" class="modal-overlay">
      <view class="modal-content">
        <view class="modal-body">{{ modalContent }}</view>
        <view class="modal-footer">
          <button class="modal-button cancel" @click="handleModalCancel">取消</button>
          <button class="modal-button confirm" @click="handleModalConfirm">确认</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ContactDetail',
  props: {
    contact: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showModal: false,
      modalContent: '',
      modalCallback: null
    }
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    
    handleRemark() {
      console.log('处理备注');
    },
    
    handleMessage() {
      this.navigateToChat();
    },
    
    handleClearHistory() {
      this.showConfirmDialog('您确认要删除所有聊天记录吗？', () => {
        console.log('清空聊天记录');
        // TODO: 实现清空聊天记录的逻辑
      });
    },
    
    handleDelete() {
      this.showConfirmDialog('您确认要删除此联系人吗？', () => {
        console.log('删除联系人');
        // TODO: 实现删除联系人的逻辑
        this.$emit('close');
      });
    },
    
    showConfirmDialog(content, callback) {
      this.modalContent = content;
      this.modalCallback = callback;
      this.showModal = true;
    },
    
    handleModalCancel() {
      this.showModal = false;
    },
    
    handleModalConfirm() {
      this.showModal = false;
      if (this.modalCallback) {
        this.modalCallback();
      }
    },
    
    navigateToChat() {
      const chatInfo = {
        id: this.contact.id,
        name: this.contact.name,
        avatar: [this.contact.avatar],
        type: 'single'
      };
      
      uni.navigateTo({
        url: '/pages/message/chat',
        success: (res) => {
          res.eventChannel.emit('chatInfo', { chatInfo: chatInfo });
        },
        fail: (err) => {
          console.error('导航到聊天页面失败:', err);
        }
      });
    }
  }
}
</script>

<style scoped>
.contact-detail {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.header {
  height: 44px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
}

.back-button, .more-options {
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon {
  font-size: 24px;
  color: #333;
}

.content {
  flex: 1;
  overflow-y: auto;
}

.main-info {
  background-color: #fff;
  margin-bottom: 8px;
  padding: 16px;
}

.profile-section {
  display: flex;
  align-items: flex-start;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  margin-right: 16px;
}

.name-container {
  flex: 1;
}

.name-badge-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.name {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.badge {
  background-color: #e6f0ff;
  padding: 2px 8px;
  border-radius: 4px;
}

.badge-text {
  color: #007AFF;
  font-size: 14px;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  width: 60px;
  color: #666;
  font-size: 15px;
}

.info-value {
  flex: 1;
  color: #333;
  font-size: 15px;
}

.remark-section {
  background-color: #fff;
  margin-bottom: 8px;
}

.action-item {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-text {
  font-size: 16px;
  color: #333;
}

.message-button, .clear-history, .delete-contact {
  background-color: #fff;
  padding: 12px 0;
  text-align: center;
  margin-bottom: 1px;
}

.button-text {
  font-size: 16px;
}

.message-button .button-text {
  color: #333;
}

.clear-history .button-text {
  color: #007AFF;
}

.delete-contact .button-text {
  color: #ff3b30;
}

.content {
  padding-bottom: 16px;
}

/* 自定义弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  width: 80%;
  max-width: 300px;
}

.modal-body {
  padding: 20px;
  text-align: center;
  font-size: 16px;
  color: #333;
}

.modal-footer {
  display: flex;
  border-top: 1px solid #eee;
}

.modal-button {
  flex: 1;
  padding: 10px;
  text-align: center;
  font-size: 16px;
  background-color: transparent;
  border: none;
}

.modal-button.cancel {
  color: #333;
  border-right: 1px solid #eee;
}

.modal-button.confirm {
  color: #FF3B30;
}
</style>