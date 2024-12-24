// useChatInitialization.js - 负责聊天初始化相关的功能
import { useUserStore } from '@/store/userStore'

export function useChatInitialization() {
  console.log('[useChatInitialization] 被调用');

  // 返回上一页
  const goBack = () => {
    console.log('[useChatInitialization] goBack 被调用');
    uni.navigateBack({
      success: () => {
        console.log('[useChatInitialization] 导航返回成功');
        uni.$emit('updateTabBarActiveTab', 1);
      },
      fail: (err) => {
        console.error('[useChatInitialization] 返回失败:', err);
        uni.reLaunch({
          url: '/pages/tabBar/tabBar',
          success: () => {
            console.log('[useChatInitialization] 重新启动到 tabBar 页面成功');
            uni.$emit('updateTabBarActiveTab', 1);
          }
        });
      }
    });
  };

  // 设置聊天信息
  const setupChatInfo = (eventChannel, vm) => {
    console.log('[useChatInitialization] setupChatInfo 被调用，eventChannel:', eventChannel);
    if (!eventChannel) {
      console.error('[useChatInitialization] 事件通道未定义');
      return;
    }

    eventChannel.on('chatInfo', (data) => {
      console.log('[useChatInitialization] 接收到 chatInfo 事件:', JSON.stringify(data));
      if (!data || !data.chatInfo) {
        console.error('[useChatInitialization] 接收到的聊天信息无效:', JSON.stringify(data));
        return;
      }

      try {
        // 更新聊天信息
        vm.chatInfo.value = {
          ...vm.chatInfo.value,
          ...data.chatInfo
        };
        console.log('[useChatInitialization] 更新后的聊天信息:', JSON.stringify(vm.chatInfo.value));

        // 处理missionId
        if (!vm.chatInfo.value.missionId) {
          const userStore = useUserStore();
          vm.chatInfo.value.missionId = userStore.missionId.toString();
        } else if (Array.isArray(vm.chatInfo.value.missionId)) {
          vm.chatInfo.value.missionId = vm.chatInfo.value.missionId.join(',');
        }

        console.log('[useChatInitialization] 使用的 missionId:', vm.chatInfo.value.missionId);

        // 保存聊天信息到本地存储，以备后用
        uni.setStorageSync('chatQuery', JSON.stringify(vm.chatInfo.value));

        // 初始化聊天
        initializeChat(vm.chatInfo.value, vm);
      } catch (error) {
        console.error('[useChatInitialization] 处理 chatInfo 时发生错误:', error);
      }
    });
  };

  // 初始化聊天
  const initializeChat = async (chatInfoData, vm) => {
    console.log('[initializeChat] 开始初始化聊天', chatInfoData);
    if (chatInfoData && chatInfoData.id) {
      vm.chatInfo.value = chatInfoData;
      if (!vm.chatInfo.value.missionId) {
        const userStore = useUserStore();
        const storedMissionId = uni.getStorageSync('currentMissionId');
        vm.chatInfo.value.missionId = storedMissionId || (Array.isArray(userStore.state.missionId) ? userStore.state.missionId.join(',') : userStore.state.missionId) || '';
        if (!vm.chatInfo.value.missionId) {
          console.warn('[initializeChat] 无法设置 missionId，聊天功能可能受限');
        } else {
          console.log('[initializeChat] 设置 missionId:', vm.chatInfo.value.missionId);
        }
      }
      await vm.loadHistoryMessages();
      vm.$nextTick(() => {
        console.log('[initializeChat] 初始化完成，滚动到底部');
        vm.scrollToBottom();
      });
    } else {
      console.error('[initializeChat] 聊天信息无效', chatInfoData);
      uni.showToast({
        title: '初始化聊天失败，请重试',
        icon: 'none'
      });
    }
  };

  return {
    goBack,
    setupChatInfo,
    initializeChat
  };
}

