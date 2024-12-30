<!-- ContactDetailView.vue - 联系人详情视图组件 -->
<template>
  <view class="contact-detail">
    <uni-nav-bar
      :fixed="true"
      status-bar
      left-icon="arrow-left"
      right-icon="more-filled"
      @clickLeft="handleClose"
      @clickRight="handleMoreOptions"
      title="通讯录"
    />
    <scroll-view class="content" scroll-y>
      <contact-info :contact="contact" />
      <contact-actions
        @handle-remark="handleRemark"
        @handle-message="handleMessage"
        @handle-clear-history="handleClearHistory"
        @handle-delete="handleDelete"
      />
    </scroll-view>
    <confirm-modal
      v-if="showModal"
      :content="modalContent"
      @confirm="handleModalConfirm"
      @cancel="handleModalCancel"
    />
  </view>
</template>

<script>
import { ref } from 'vue'
import { useContactDetail } from '../../composables/useContactDetail'
import ContactInfo from './ContactInfo.vue'
import ContactActions from './ContactActions.vue'
import ConfirmModal from '../shared/ConfirmModal.vue'

export default {
  name: 'ContactDetailView',
  components: {
    ContactInfo,
    ContactActions,
    ConfirmModal
  },
  props: {
    contact: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const {
      showModal,
      modalContent,
      handleClose,
      handleMoreOptions,
      handleRemark,
      handleMessage,
      handleClearHistory,
      handleDelete,
      handleModalConfirm,
      handleModalCancel
    } = useContactDetail(props.contact, emit)

    return {
      showModal,
      modalContent,
      handleClose,
      handleMoreOptions,
      handleRemark,
      handleMessage,
      handleClearHistory,
      handleDelete,
      handleModalConfirm,
      handleModalCancel
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

.content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>

