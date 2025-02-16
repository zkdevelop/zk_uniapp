<template>
  <view class="chat-header">
    <div class="uni-page-head-hd" @click="$emit('goBack')">
      <div class="uni-page-head-btn">
        <image
          src="/static/message/back.png"
          class="back-icon"
          mode="aspectFit"
        ></image>
      </div>
    </div>
    <view class="chat-title-container">
      <text class="chat-title">{{ chatInfo.name }}</text>
    </view>
    <text class="menu-button">...</text>
  </view>
</template>

<script>
export default {
  name: "ChatHeader",
  components: {},
  props: {
    chatInfo: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  background-color: #ffffff;
  color: #000000;
  position: sticky;
  top: 0;
  z-index: 100;
  height: 50px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.11);
}

.chat-title-container {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.chat-title {
  font-family: NotoSansCJKsc-Bold;
  font-size: 18px;
  color: #000000;
  letter-spacing: 0;
  line-height: 20px;
  font-weight: 700;
  text-align: center;
}

.uni-page-head-hd,
.menu-button {
  z-index: 1;
}

.uni-page-head-hd {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}

.uni-page-head-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.back-icon {
  width: 24px;
  height: 24px;
}

.menu-button {
  font-size: 24px;
  color: #000000;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media screen and (max-width: 375px) {
  .chat-title {
    font-size: 16px;
  }
}
</style>
