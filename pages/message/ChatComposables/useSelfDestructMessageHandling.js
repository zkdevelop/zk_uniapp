import { readSelfDestructMessage } from '@/utils/api/message.js'

export function useSelfDestructMessageHandling(vm) {
  // 删除消息
  const deleteMessage = (messageId) => {
    const index = vm.list.findIndex(msg => msg.id === messageId);
    if (index !== -1) {
      vm.list.splice(index, 1);
    }
  }

  // 处理自毁消息
  const handleSelfDestructMessage = async (message) => {
    try {
      // 处理自毁消息
      const decryptedMessage = decryptMessage(message);

      // 根据解密后的消息执行操作
      await processMessage(decryptedMessage);

      if (message.userType === 'other' && message.selfDestruct) {
        await readSelfDestructMessage({
          isGroup: vm.chatInfo.type === 'group',
          messageId: message.id,
          messageType: message.messageType
        });
        
        // 启动 10 秒计时器
        setTimeout(() => {
          // 10 秒后删除该消息
          deleteMessage(message.id);
        }, 10000);
      }
    } catch (error) {
      console.log('自毁消息处理错误:', { 消息ID: message.id, 错误: error.message });
    }
  }

  // 解密消息
  const decryptMessage = (message) => {
    // 这里应该实现实际的解密逻辑
    return "已解密的消息";
  }

  // 处理消息
  const processMessage = async (decryptedMessage) => {
    // 这里应该实现实际的消息处理逻辑
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟异步操作
  }

  return {
    handleSelfDestructMessage
  };
}

