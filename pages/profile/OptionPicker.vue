<template>
  <view class="picker-wrapper">
    <view class="picker-overlay" @click="$emit('close')">
      <view class="picker-content" @click.stop>
        <view class="picker-header">
          <text class="picker-title">{{ title }}</text>
          <text class="picker-close" @click="$emit('close')">×</text>
        </view>
        <view class="picker-options">
          <view 
            v-for="option in options" 
            :key="option.value" 
            class="picker-option"
            :class="{ 'selected': selectedValue === option.value }"
            @click="selectOption(option.value)"
          >
            <text>{{ option.label }}</text>
          </view>
        </view>
        <view class="picker-footer">
          <button class="picker-btn" @click="$emit('close')">取消</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'OptionPicker',
  props: {
    title: String,
    options: Array,
    selectedValue: String,
  },
  methods: {
    selectOption(value) {
      this.$emit('select', value);
    },
  },
}
</script>

<style>
.picker-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}

.picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 9999;
}

.picker-content {
  background-color: #fff;
  border-radius: 12px 12px 0 0;
  width: 100%;
  max-height: 70vh;
  overflow-y: auto;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.picker-title {
  font-size: 18px;
  font-weight: bold;
}

.picker-close {
  font-size: 24px;
  color: #999;
}

.picker-options {
  max-height: 50vh;
  overflow-y: auto;
}

.picker-option {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.picker-option.selected {
  color: #007aff;
}

.picker-footer {
  padding: 15px;
  border-top: 1px solid #f0f0f0;
}

.picker-btn {
  width: 100%;
  padding: 12px;
  text-align: center;
  font-size: 16px;
  color: #007aff;
  background-color: transparent;
  border: none;
}
</style>