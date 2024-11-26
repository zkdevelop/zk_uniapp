<template>
  <view class="file-bubble">
    <view class="file-name">{{ content }}</view>
    <image 
      v-if="messageType.toUpperCase() === 'TEXT'"
      src="../icon/text.png"
      class="file-type-icon" 
      mode="aspectFit"
    />
    <image 
      v-else-if="messageType.toUpperCase() === 'DOCX'"
      src="../icon/docx.png"
      class="file-type-icon" 
      mode="aspectFit"
    />
    <image 
      v-else-if="messageType.toUpperCase() === 'JPG'"
      src="../icon/jpg.png"
      class="file-type-icon" 
      mode="aspectFit"
    />
    <image 
      v-else-if="messageType.toUpperCase() === 'PNG'"
      src="../icon/png.png"
      class="file-type-icon" 
      mode="aspectFit"
    />
    <image 
      v-else-if="messageType.toUpperCase() === 'PPTX'"
      src="../icon/pptx.png"
      class="file-type-icon" 
      mode="aspectFit"
    />
    <image 
      v-else-if="messageType.toUpperCase() === 'XLSX'"
      src="../icon/xlsx.png"
      class="file-type-icon" 
      mode="aspectFit"
    />
    <!--   <image 
      v-else-if="messageType.toUpperCase() === 'ZIP'"
      src="./icon/zip.png"
      class="file-type-icon" 
      mode="aspectFit"
    /> -->
    <image
      v-else
      src="../icon/text.png"
      class="file-type-icon" 
      mode="aspectFit"
    />
  </view>
</template>

<script>
export default {
  name: 'FileMessage',
  props: {
    content: {
      type: String,
      required: true
    },
    messageType: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.file-bubble {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #FFFFFF;
  box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.1);
  border-radius: 4px;
  padding: 11px 11px 15px 12px;
  width: 210px;
  height: 83px;
}

.file-name {
  flex: 1;
  font-family: NotoSansCJKsc-Regular;
  font-size: 14px;
  color: #414141;
  letter-spacing: 0;
  text-align: justify;
  font-weight: 400;
  margin-right: 7px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 47px); /* Adjust based on icon width and margin */
}

.file-type-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}
</style>