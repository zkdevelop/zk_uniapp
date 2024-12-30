<template>
  <view class="contact-detail">
	<view>
		<uni-nav-bar :fixed="true" status-bar left-icon="arrow-left" rightIcon="more-filled" @clickLeft="handleClose" @clickRight="" title="通讯录" />
	</view>
    <!-- <view class="header">
      <view class="back-button" @click="handleClose">
        <text class="icon">←</text>
      </view>
      <text class="header-title">通讯录</text>
      <view class="more-options">
        <text class="icon">⋯</text>
      </view>
    </view> -->

    <!-- 内容区域 -->
    <scroll-view class="content" scroll-y>
      <!-- 主要信息 -->
      <view class="main-info">
        <view class="profile-section">
          <image class="avatar" :src="contact.avatar" mode="aspectFill"></image>
          <view class="info-section">
            <view class="name-section">
              <text class="name">{{contact.name}}</text>
              <view class="badge-section">
                <text class="badge">{{ contact.title }}</text>
              </view>
            </view>
            <view class="details-section">
              <view class="detail-item">
                <text class="detail-label">用户名</text>
                <text class="detail-value">{{ contact.username }}</text>
              </view>
              <view class="detail-item">
                <text class="detail-label">设备IP</text>
                <text class="detail-value">{{ contact.ip }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 备注部分 -->
      <view class="remark-section">
        <view class="action-item" @click="handleRemark">
          <text class="action-text">备注</text>
          <text class="icon">›</text>
        </view>
      </view>

      <!-- 操作按钮 -->
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
import { useUserStore } from '@/store/userStore'

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
    // 处理关闭
    handleClose() {
      this.$emit('close');
    },
    
    // 处理备注
    handleRemark() {
      console.log('处理备注');
    },
    
    // 处理发送消息
    handleMessage() {
      this.navigateToChat();
    },
    
    // 处理清空聊天记录
    handleClearHistory() {
      this.showConfirmDialog('您确认要删除所有聊天记录吗？', () => {
        console.log('清空聊天记录');
      });
    },
    
    // 处理删除联系人
    handleDelete() {
      this.showConfirmDialog('您确认要删除此联系人吗？', () => {
        console.log('删除联系人');
        this.$emit('close');
      });
    },
    
    // 显示确认对话框
    showConfirmDialog(content, callback) {
      this.modalContent = content;
      this.modalCallback = callback;
      this.showModal = true;
    },
    
    // 处理模态框取消
    handleModalCancel() {
      this.showModal = false;
    },
    
    // 处理模态框确认
    handleModalConfirm() {
      this.showModal = false;
      if (this.modalCallback) {
        this.modalCallback();
      }
    },
    
    // 导航到聊天页面
    navigateToChat() {
      const userStore = useUserStore();
      const chatInfo = {
        id: this.contact.id,
        name: this.contact.name,
        avatar: this.contact.avatar ? [this.contact.avatar] : [],
        type: 'single',
        recipientId: this.contact.id,
        missionId: userStore.missionId ? userStore.missionId.toString() : ''
      };
      
      console.log('准备导航到聊天页面，chatInfo:', chatInfo);
      
      uni.navigateTo({
        url: '/pages/message/chat',
        success: (res) => {
          // 使用事件通道传递chatInfo
          res.eventChannel.emit('chatInfo', { chatInfo: chatInfo });
          console.log('成功导航到聊天页面并发送 chatInfo');
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

.header-title {
  font-size: 16px;
  font-weight: 500;
}

.icon {
  font-size: 24px;
  color: #333;
}

.content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.main-info {
  background-color: #fff;
  margin-bottom: 8px;
  padding: 20px 16px;
}

.profile-section {
  display: flex;
  align-items: flex-start;
}

.avatar {
  width: 65px;
  height: 65px;
  border-radius: 4px;
  margin-right: 16px;
  flex-shrink: 0;
}

.info-section {
  flex: 1;
  min-width: 0;
  padding-left:10px
}

.name-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.badge-section {
  margin-bottom: 16px;
}

.badge {
  display: inline-block;
  background-color: #e6f0ff;
  padding: 2px 8px;
  border-radius: 4px;
  color: #007AFF;
  font-size: 14px;
}

.details-section { 
}

.detail-item {
  margin-bottom: 2px;
  display: flex;
  align-items: center;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  color: #666;
  font-size: 15px;
}

.detail-value {
  color: #333;
  font-size: 15px;
  margin-left: 3px;
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

@media screen and (max-width: 375px) {
  .main-info {
    padding: 16px;
  }
  
  .avatar {
    width: 60px;
    height: 60px;
    margin-right: 6px;
    margin-top: 16px;
    margin-left: 10px;
  }

  .name {
    font-size: 18px;
  }

  .badge {
    font-size: 12px;
  }

  .detail-label, .detail-value {
    font-size: 14px;
  }

  .action-text, .button-text {
    font-size: 15px;
  }
}
</style>

