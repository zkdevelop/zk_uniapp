<template>
	<view class="main-container">
		<!-- 主要内容区域 -->
		<view class="content-area">
			<TaskPage v-if="currentTab === 0"></TaskPage>
			<messages v-else-if="currentTab === 1"></messages>
			<main-page v-else-if="currentTab === 3"></main-page>
			<contacts v-else-if="currentTab === 2"></contacts>
			<view v-else class="placeholder-content">
				<text>这是{{ ['首页', '', '', ''][currentTab] }}的内容</text>
			</view>
		</view>

		<!-- 底部导航栏 -->
		<view class="tab-bar" ref="tabBar">
			<view v-for="(tab, index) in tabs" :key="index" class="tab-item" @click="onTabClick(index)">
				<image :src="currentTab === index ? tab.icon_choice : tab.icon_nochoice" class="tab-icon" mode="aspectFit"></image>
				<text :class="['tab-text', { 'active': currentTab === index }]">{{ tab.label }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import TaskPage from '@/pages/task/task.vue'
	import Messages from '../message/main.vue'
	import MainPage from '../profile/profile.vue'
	import Contacts from './contacts/contacts.vue'

	export default {
		name: 'TabBar',
		components: {
			MainPage,
			Messages,
			Contacts,
			TaskPage
		},
		data() {
			return {
				currentTab: 0,
				tabs: [{
						icon_nochoice: '../../static/tabBar/首页-未选中.png',
						icon_choice: '../../static/tabBar/首页-选中.png',
						label: '首页'
					},
					{
						icon_nochoice: '../../static/tabBar/消息-未选中.png',
						icon_choice: '../../static/tabBar/消息-选中.png',
						label: '消息'
					},
					{
						icon_nochoice: '../../static/tabBar/通讯录-未选中.png',
						icon_choice: '../../static/tabBar/通讯录-选中.png',
						label: '通讯录'
					},
					{
						icon_nochoice: '../../static/tabBar/我的-未选中.png',
						icon_choice: '../../static/tabBar/我的-选中.png',
						label: '我的'
					},
				],
			}
		},
		methods: {
			onTabClick(index) {
				this.currentTab = index;
				const title = this.tabs[index].label;
				uni.setNavigationBarTitle({
					title: title
				})
			},
			hideTabBar() {
				if (this.$refs.tabBar) {
					this.$refs.tabBar.style.display = 'none';
				}
			},
			showTabBar() {
				if (this.$refs.tabBar) {
					this.$refs.tabBar.style.display = 'flex';
				}
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