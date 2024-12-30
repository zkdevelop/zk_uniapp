// useMessageHandling.js - 负责消息处理相关的功能
import { getHistoryChatMessages, sendMessageToUser, sendFilesToUser } from '@/utils/api/message.js'
import { nextTick } from 'vue'

export function useMessageHandling(chatInfo, list, currentFrom, currentTo, hasMoreMessages, scrollToBottom) {
  // 发送消息
  const sendMessage = async (message) => {
    console.log('[sendMessage] 发送消息:', message);
    if (message.content && chatInfo.value && chatInfo.value.id) {
      try {
        const response = await sendMessageToUser({
          message: typeof message.content === 'object' ? JSON.stringify(message.content) : message.content,
          recipientId: chatInfo.value.id,
          messageType: message.type || 'text',
          missionId: chatInfo.value.missionId,
          isPosition: message.type === 'location',
          isSelfDestruct: chatInfo.value.isBurnAfterReadingMode
        });
        console.log('[sendMessage] 发送消息响应:', response);
        if (response.code === 200) {
          const sentMessage = {
            ...response.data,
            selfDestruct: response.data.selfDestruct
          };
          handleMessageSent(sentMessage);
          await updateMessageList();
          // 发送消息后滚动到底部
          nextTick(() => {
            scrollToBottom();
          });
        } else {
          throw new Error(response.msg || '发送消息失败');
        }
      } catch (error) {
        console.error('[sendMessage] 发送消息失败:', error);
      }
    } else {
      console.error('[sendMessage] 消息内容为空或 chatInfo 未正确初始化', {
        content: message.content,
        chatInfo: chatInfo.value
      });
    }
  };

  // 处理消息发送成功
  const handleMessageSent = (sentMessage) => {
    console.log('[handleMessageSent] 消息已发送:', sentMessage);
  };

  // 处理消息发送失败
  const handleMessageFailed = (failedMessage) => {
    console.log('[handleMessageFailed] 消息发送失败:', failedMessage);
  };

  // 加载历史消息
  const loadHistoryMessages = async (isLoadingMore = false, newFrom = null, newTo = null) => {
    if (!chatInfo.value || !chatInfo.value.id || !chatInfo.value.missionId) {
      console.error('[loadHistoryMessages] chatInfo 未正确初始化');
      hasMoreMessages.value = false;
      return false;
    }
    
    const from = newFrom !== null ? newFrom : currentFrom.value;
    const to = newTo !== null ? newTo : currentTo.value;
    
    console.log('[loadHistoryMessages] 开始加载历史消息', { 
      isLoadingMore, 
      from,
      to,
      missionId: chatInfo.value.missionId 
    });

    try {
      const response = await getHistoryChatMessages({
        opponentId: chatInfo.value.id,
        from,
        to,
        missionId: chatInfo.value.missionId
      });

      console.log('[loadHistoryMessages] 历史消息响应:', response);

      if (response.code === 200 && response.data && Array.isArray(response.data.messageVOList)) {
        const newMessages = response.data.messageVOList.reverse().map(msg => {
          let content = msg.message;
          let type = msg.messageType.toLowerCase();

          if (type === 'position') {
            try {
              content = JSON.parse(msg.message);
              type = 'location';
            } catch (e) {
              console.error('解析位置数据失败:', e);
            }
          } else if (type === 'image') {
            content = msg.previewUrl || msg.message;
          } else if (type === 'text' && msg.message.toLowerCase().endsWith('.txt')) {
            type = 'file';
          } else if (type === 'audio' || type === 'voice_message') {
            content = msg.previewUrl || msg.message;
          }

          const mappedMessage = {
            id: msg.id,
            content: content,
            userType: msg.senderId === chatInfo.value.id ? 'other' : 'self',
            avatar: msg.senderId === chatInfo.value.id ? chatInfo.value.avatar[0] : chatInfo.value._selfAvatar,
            timestamp: new Date(msg.sendTime),
            type: type,
            isRead: msg.isRead,
            messageType: msg.messageType,
            selfDestruct: msg.selfDestruct
          };

          handleSelfDestructMessage(mappedMessage);

          return mappedMessage;
        });

        console.log('[loadHistoryMessages] 新消息数量:', newMessages.length);

        if (isLoadingMore) {
          list.value = [...newMessages, ...list.value];
          console.log('[loadHistoryMessages] 在列表前端添加新消息');
        } else {
          list.value = newMessages;
          console.log('[loadHistoryMessages] 替换整个消息列表');
        }
        
        hasMoreMessages.value = newMessages.length === (to - from + 1);
        console.log('[loadHistoryMessages] 是否有更多消息:', hasMoreMessages.value);

        currentFrom.value = from;
        currentTo.value = to;

        console.log('[loadHistoryMessages] 更新后的消息列表长度:', list.value.length);

        if (!isLoadingMore) {
          nextTick(() => {
            scrollToBottom();
          });
        }

        return true;
      } else {
        console.error('[loadHistoryMessages] 加载历史消息失败:', response.msg);
        hasMoreMessages.value = false;
        uni.showToast({
          title: '加载历史消息失败',
          icon: 'none'
        });
        return false;
      }
    } catch (error) {
      console.error('[loadHistoryMessages] 加载历史消息出错:', error);
      hasMoreMessages.value = false;
      uni.showToast({
        title: '网络错误，请稍后重试',
        icon: 'none'
      });
      return false;
    }
  };

  // 更新消息列表
  const updateMessageList = async () => {
    console.log('[updateMessageList] 开始更新消息列表');
    try {
      const response = await getHistoryChatMessages({
        opponentId: chatInfo.value.id,
        from: 0,
        to: 10,
        missionId: chatInfo.value.missionId
      });

      console.log('[updateMessageList] 接收到的响应:', response);

      if (response.code === 200 && response.data && Array.isArray(response.data.messageVOList)) {
        const newMessages = response.data.messageVOList.reverse().map(msg => {
          let content = msg.message;
          let type = msg.messageType.toLowerCase();

          if (type === 'position') {
            try {
              content = JSON.parse(msg.message);
              type = 'location';
            } catch (e) {
              console.error('解析位置数据失败:', e);
            }
          } else if (type === 'image') {
            content = msg.previewUrl || msg.message;
          } else if (type === 'text' && msg.message.toLowerCase().endsWith('.txt')) {
            type = 'file';
          } else if (type === 'audio' || type === 'voice_message') {
            content = msg.previewUrl || msg.message;
          }

          return {
            id: msg.id,
            content: content,
            userType: msg.senderId === chatInfo.value.id ? 'other' : 'self',
            avatar: msg.senderId === chatInfo.value.id ? chatInfo.value.avatar[0] : chatInfo.value._selfAvatar,
            timestamp: new Date(msg.sendTime),
            type: type,
            isRead: msg.isRead,
            messageType: msg.messageType,
            selfDestruct: msg.selfDestruct
          };
        });

        list.value = newMessages;

        console.log('[updateMessageList] 消息列表已更新，新长度:', list.value.length);

        nextTick(() => {
          scrollToBottom();
        });
      } else {
        console.error('[updateMessageList] 获取新消息失败:', response.msg);
        throw new Error(response.msg || '获取新消息失败');
      }
    } catch (error) {
      console.error('[updateMessageList] 更新消息列表出错:', error);
      uni.showToast({
        title: '更新消息列表失败，请重试',
        icon: 'none'
      });
    }
  };

  // 处理文件选择
  const handleFileSelected = async (fileInfo) => {
    console.log('文件被选择，完整的 fileInfo:', JSON.stringify(fileInfo));
    console.log('当前 isBurnAfterReadingMode 状态:', chatInfo.value.isBurnAfterReadingMode);
    if (!fileInfo || typeof fileInfo !== 'object') {
      console.error('文件信息无效:', fileInfo);
      uni.showToast({
        title: '文件信息无效，请重试',
        icon: 'none'
      });
      return;
    }

    if (!fileInfo.path) {
      console.error('文件路径缺失:', fileInfo);
      uni.showToast({
        title: '文件路径缺失，请重试',
        icon: 'none'
      });
      return;
    }

    try {
      const response = await sendFilesToUser({
        files: [fileInfo.path],
        isGroup: false,
        isSelfDestruct: chatInfo.value.isBurnAfterReadingMode || false, // 确保始终有一个布尔值
        latitude: '0',
        longitude: '0',
        missionId: chatInfo.value.missionId,
        receptionId: chatInfo.value.id,
        voiceMessage: fileInfo.fromVoiceInput || false
      });

      console.log('文件上传响应:', response);

      if (response.code === 200) {
        await updateMessageList();
        // 发送文件后滚动到底部
        nextTick(() => {
          scrollToBottom();
        });
      } else {
        throw new Error(response.msg || '发送文件消息失败');
      }
    } catch (error) {
      console.error('发送文件消息出错:', error);
      uni.showToast({
        title: '发送失败，请重试',
        icon: 'none'
      });
    }
  };

  // 处理自毁消息
  const handleSelfDestructMessage = (message) => {
    console.log('处理自毁消息:', message);
    // 在这里添加处理自毁消息的逻辑（如果需要）
  };

  return {
    sendMessage,
    handleMessageFailed,
    loadHistoryMessages,
    updateMessageList,
    handleFileSelected
  };
}

