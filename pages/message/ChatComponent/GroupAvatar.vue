<template>
  <div class="avatar-wrap">
    <template v-if="processedAvatar.length === 1">
      <image :src="processedAvatar[0]" class="horizonta-1"></image>
    </template>
    <template v-else-if="processedAvatar.length >= 2 && processedAvatar.length <= 4">
      <image v-for="(item, index) in processedAvatar" :key="index" :src="item" class="horizonta-2"></image>
    </template>
    <template v-else>
      <image v-for="(item, index) in processedAvatar.slice(0, 4)" :key="index" :src="item" class="horizonta-3"></image>
    </template>
  </div>
</template>

<script>
export default {
  name: 'GroupAvatar',
  props: {
    avatar: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      defaultAvatarPath: '../../static/message/默认头像.png'
    }
  },
  computed: {
    processedAvatar() {
      if (this.avatar.length === 0) {
        return [this.defaultAvatarPath];
      }
      return this.avatar.map(avatarPath => avatarPath || this.defaultAvatarPath);
    }
  }
}
</script>

<style>
.avatar-wrap {
  width: 40px;
  height: 40px;
  background: #f2f2f2;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap-reverse;
  border-radius: 5px;
  overflow: hidden;
}

.avatar-wrap image {
  object-fit: cover;
}

.horizonta-1 {
  width: 40px;
  height: 40px;
}

.horizonta-2 {
  width: 19px;
  height: 19px;
  margin: 0.5px;
}

.horizonta-3 {
  width: 19px;
  height: 19px;
  margin: 0.5px;
}
</style>