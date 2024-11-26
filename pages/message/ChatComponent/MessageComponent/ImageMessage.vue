<template>
  <image 
    :src="content" 
    mode="widthFix" 
    class="message-image" 
    @click="previewImage(content)"
  ></image>
</template>

<script>
export default {
  name: 'ImageMessage',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  methods: {
    previewImage(url) {
      uni.previewImage({
        urls: [url],
        current: url
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.message-image {
  max-width: 100%;
  border-radius: 5px;
}
</style>