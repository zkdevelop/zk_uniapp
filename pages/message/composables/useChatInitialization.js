// useChatInitialization.js - 负责聊天初始化相关的功能
import { useUserStore } from '@/store/userStore'

export function useChatInitialization() {
  console.log('[useChatInitialization] 被调用');

  return {
    // 返回上一页
    goBack() {
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
    },

    // 设置聊天信息
    setupChatInfo(eventChannel, vm) {
      console.log('[useChatInitialization] setupChatInfo 被调用，eventChannel:', eventChannel);
      console.log('[useChatInitialization] vm 对象:', vm);
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

          // 加载历史消息
          if (vm.loadHistoryMessages) {
            vm.loadHistoryMessages();
          } else {
            console.error('[useChatInitialization] loadHistoryMessages 方法未定义');
          }
        } catch (error) {
          console.error('[useChatInitialization] 处理 chatInfo 时发生错误:', error);
        }
      });
    }
  };
}

