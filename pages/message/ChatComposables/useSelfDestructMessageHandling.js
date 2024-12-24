// useSelfDestructMessageHandling.js - 负责处理自毁消息相关的功能
import { readSelfDestructMessage } from '@/utils/api/message.js'

export function useSelfDestructMessageHandling(vm) {
  return {
    // 删除消息
    deleteMessage(messageId) {
      const index = vm.list.findIndex(msg => msg.id === messageId);
      if (index !== -1) {
        vm.list.splice(index, 1);
      }
    },

    // 处理自毁消息
    handleSelfDestructMessage(message) {
      if (message.userType === 'other' && message.selfDestruct) {
        readSelfDestructMessage({
          isGroup: vm.chatInfo.type === 'group',
          messageId: message.id,
          messageType: message.messageType
        }).then(() => {
          console.log('自毁消息已成功阅读');
          
          // 启动 10 秒计时器
          setTimeout(() => {
            // 10 秒后删除该消息
            vm.deleteMessage(message.id);
          }, 10000);
        }).catch((error) => {
          console.error('阅读自毁消息时出错:', error);
        });
      }
    },
  };
}

