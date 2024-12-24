<!-- GroupAvatar.vue - 群组头像组件，用于显示多个用户头像 -->
<template>
  <view class="group-avatar">
    <image 
      v-for="(src, index) in avatarSources" 
      :key="index" 
      :src="src" 
      class="avatar-image" 
    />
  </view>
</template>

<script>
export default {
  name: 'GroupAvatar',
  props: {
    // 头像数组
    avatar: {
      type: Array,
      required: true
    }
  },
  computed: {
    // 计算要显示的头像源
    avatarSources() {
      // 最多显示4个头像
      return this.avatar.slice(0, 4)
    }
  }
}
</script>

<style scoped>
.group-avatar {
  width: 54px;
  height: 54px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
}

.avatar-image {
  width: 45%;
  height: 45%;
  border-radius: 3px;
  object-fit: cover;
}
</style>

