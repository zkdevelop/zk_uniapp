<!-- Avatar.vue - 头像展示组件 -->
<template>
  <image
    class="avatar"
    :src="src"
    :style="{ width: `${size}px`, height: `${size}px` }"
    mode="aspectFill"
  ></image>
</template>

<script>
export default {
  name: "Avatar",
  props: {
    src: {
      type: String,
      default: "/static/message/defaultimg.png",
    },
    size: {
      type: Number,
      default: 40,
    },
  },
};
</script>

<style scoped>
.avatar {
  border-radius: 4px;
}
</style>
