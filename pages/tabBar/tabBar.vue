<template>
  <view class="main-container">
    <!-- 主要内容区域 -->
    <view class="content-area">
      <main-page v-if="currentTab === 3"></main-page>
      <messages v-else-if="currentTab === 1"></messages>
      <view v-else class="placeholder-content">
        <text>这是{{ ['首页', '', '通讯录'][currentTab] }}的内容</text>
      </view>
    </view>

    <!-- 底部导航栏 -->
    <view class="tab-bar" ref="tabBar">
      <view 
        v-for="(tab, index) in tabs" 
        :key="index" 
        class="tab-item"
        @click="onTabClick(index)"
      >
        <image :src="tab.icon" class="tab-icon" mode="aspectFit"></image>
        <text :class="['tab-text', { 'active': currentTab === index }]">{{ tab.label }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import MainPage from '../profile/profile.vue'
import Messages from '../message/main.vue'
import TaskPage from '../task/task.vue'

export default {
  name: 'TabBar',
  components: {
    MainPage,
    Messages
  
  },
  data() {
    return {
      currentTab: 1, // 默认显示"消息"页面
      tabs: [
        { icon: '../../static/c1.png', label: '首页' },
        { icon: '../../static/c1.png', label: '消息' },
        { icon: '../../static/c1.png', label: '通讯录' },
        { icon: '../../static/c1.png', label: '我的' },
      ],
    }
  },
  methods: {
    onTabClick(index) {
      this.currentTab = index;
    },
    hideTabBar() {
      this.$refs.tabBar.style.display = 'none';
    },
    showTabBar() {
      this.$refs.tabBar.style.display = 'flex';
    }
  }
}
</script>

<style>
.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-area {
  flex: 1;
  overflow-y: auto;
}

.placeholder-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 18px;
  color: #666;
}

.tab-bar {
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  padding: 10px 0;
  border-top: 1px solid #f0f0f0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}

.tab-text {
  font-size: 12px;
  color: #999;
}

.tab-text.active {
  color: #4285f4;
}
</style>