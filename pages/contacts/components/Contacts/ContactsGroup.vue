<!-- ContactsGroup.vue - 联系人分组组件 -->
<template>
  <view class="group">
    <view class="group-header" @click="toggleGroup">
      <text class="group-title">{{ group.name }} ({{ group.members.length }}人)</text>
      <text class="group-arrow" :class="{ 'expanded': expanded }">›</text>
    </view>
    <view 
      class="group-content" 
      :class="{ 'expanded': expanded }"
    >
      <contact-item
        v-for="member in group.members"
        :key="member.id"
        :contact="member"
        @click="$emit('select-contact', member)"
      />
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'
import ContactItem from './ContactItem.vue'

export default {
  name: 'ContactsGroup',
  components: {
    ContactItem
  },
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  emits: ['select-contact'],
  setup() {
    const expanded = ref(true)

    const toggleGroup = () => {
      expanded.value = !expanded.value
    }

    return {
      expanded,
      toggleGroup
    }
  }
}
</script>

<style scoped>
.group {
  background-color: #fff;
  margin-bottom: 10px;
  border-radius: 4px;
  overflow: hidden;
}

.group-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  background-color: #fafafa;
}

.group-title {
  font-size: 16px;
  color: #333;
}

.group-arrow {
  font-size: 20px;
  color: #999;
  transform: rotate(90deg);
  transition: transform 0.3s ease;
}

.group-arrow.expanded {
  transform: rotate(-90deg);
}

.group-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.group-content.expanded {
  max-height: 1000px;
}
</style>

