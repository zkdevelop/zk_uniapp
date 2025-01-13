import { ref } from 'vue';
import { useUserStore } from '@/store/userStore'
import { useGroupStore } from '@/pages/message/store/groupStore'
import { getGroupBasicInfo } from '@/utils/api/message.js'

export function useChatInitialization() {
  const chatInfo = ref(null);
  const userStore = useUserStore();
  const groupStore = useGroupStore();

  // 获取并存储群组基本信息
  const fetchAndStoreGroupInfo = async (groupId) => {
    try {
      const response = await getGroupBasicInfo(groupId);
      if (response.code === 200) {
        const groupInfo = response.data;
        groupStore.setGroupInfo({
          id: groupInfo.id,
          groupName: groupInfo.groupName,
          groupMembers: groupInfo.groupMembers
        });
      } else {
        console.log('获取群组信息失败:', response.msg);
      }
    } catch (error) {
      console.log('获取群组信息时发生错误:', JSON.stringify(error));
    }
  };

  // 返回上一页
  const goBack = () => {
    uni.navigateBack({
      success: () => {
        uni.$emit('updateTabBarActiveTab', 1);
      },
      fail: (err) => {
        console.log('返回失败:', JSON.stringify(err));
        uni.reLaunch({
          url: '/pages/tabBar/tabBar',
          success: () => {
            uni.$emit('updateTabBarActiveTab', 1);
          }
        });
      }
    });
  };

  // 设置聊天信息
  const setupChatInfo = async (eventChannel, vm) => {
    if (!eventChannel) {
      console.log('事件通道未定义');
      return;
    }

    eventChannel.on('chatInfo', async (data) => {
      if (!data || !data.chatInfo) {
        console.log('接收到的聊天信息无效:', JSON.stringify(data));
        return;
      }

      try {
        // 更新聊天信息
        vm.chatInfo.value = {
          ...vm.chatInfo.value,
          ...data.chatInfo
        };

        // 处理missionId
        if (!vm.chatInfo.value.missionId) {
          vm.chatInfo.value.missionId = userStore.state.missionId.toString();
        } else if (Array.isArray(vm.chatInfo.value.missionId)) {
          vm.chatInfo.value.missionId = vm.chatInfo.value.missionId.join(',');
        }

        // 如果是群聊，获取并存储群组信息
        if (vm.chatInfo.value.type === 'group') {
          await fetchAndStoreGroupInfo(vm.chatInfo.value.id);
        }

        // 保存聊天信息到本地存储，以备后用
        uni.setStorageSync('chatQuery', JSON.stringify(vm.chatInfo.value));

        // 初始化聊天
        vm.loadHistoryMessages();
        vm.$nextTick(() => {
          vm.scrollToBottom();
        });

        console.log('聊天初始化:', {
          聊天ID: vm.chatInfo.value.id,
          聊天类型: vm.chatInfo.value.type,
          任务ID: vm.chatInfo.value.missionId
        });
      } catch (error) {
        console.log('处理 chatInfo 时发生错误:', JSON.stringify(error));
      }
    });
  };

  return {
    goBack,
    setupChatInfo
  };
}

