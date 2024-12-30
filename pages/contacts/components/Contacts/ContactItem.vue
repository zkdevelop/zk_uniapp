<!-- ContactItem.vue - 单个联系人项组件 -->
<template>
  <view class="contact-item">
    <avatar :src="contact.avatar" :size="40" />
    <view class="contact-info">
      <text class="contact-name">{{ contact.name }}</text>
      <text class="contact-title">{{ contact.title }}</text>
    </view>
  </view>
</template>

<script>
import Avatar from '../shared/Avatar.vue'

export default {
  name: 'ContactItem',
  components: {
    Avatar
  },
  props: {
    contact: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.contact-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
}

.contact-info {
  flex: 1;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
}

.contact-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.2;
}

.contact-title {
  font-size: 14px;
  color: #999;
  line-height: 1.2;
}
</style>

