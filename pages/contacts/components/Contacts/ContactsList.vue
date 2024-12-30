<!-- ContactsList.vue - 联系人列表组件 -->
<template>
  <scroll-view class="contact-list" scroll-y @scrolltolower="loadMoreContacts">
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="!displayGroups || displayGroups.length === 0" class="no-contacts">暂无联系人</view>
    <template v-else>
      <contacts-group
        v-for="group in displayGroups"
        :key="group.id"
        :group="group"
        @select-contact="selectContact"
      />
    </template>
  </scroll-view>
</template>

<script>
import { onMounted, watch } from 'vue'
import { useContacts } from '../../composables/useContacts'
import ContactsGroup from './ContactsGroup.vue'

export default {
  name: 'ContactsList',
  components: {
    ContactsGroup
  },
  setup() {
    const { displayGroups, loading, loadContacts, loadMoreContacts, selectContact } = useContacts()

    onMounted(() => {
      console.log('ContactsList onMounted')
      loadContacts()
    })

    watch(displayGroups, (newGroups) => {
      console.log('displayGroups changed:', JSON.stringify(newGroups))
    }, { deep: true })

    return {
      displayGroups,
      loading,
      loadMoreContacts,
      selectContact
    }
  }
}
</script>

<style scoped>
.contact-list {
  flex: 1;
  overflow-y: auto;
  margin-top: 8px;
}

.loading, .no-contacts {
  padding: 20px;
  text-align: center;
  color: #999;
}
</style>

