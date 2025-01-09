// useMessageHandling.js - 负责消息处理相关的功能
import { getHistoryChatMessages, sendMessageToUser, sendGroupMessage, sendFilesToUser, getGroupChatMessages } from '@/utils/api/message.js'
import { nextTick } from 'vue'
import { useUserStore } from '@/store/userStore'
import { useGroupStore } from '@/pages/message/store/groupStore'

export function useMessageHandling(chatInfo, list, currentFrom, currentTo, hasMoreMessages, scrollToBottom) {
  const userStore = useUserStore();
  const groupStore = useGroupStore();

  // 发送消息
  const sendMessage = async (message) => {
    console.log('发送消息:', message);
    if (message.content && chatInfo.value && chatInfo.value.id) {
      try {
        let response;
        const messageData = {
          message: typeof message.content === 'object' ? JSON.stringify(message.content) : message.content,
          recipientId: chatInfo.value.id,
          messageType: message.type || 'text',
          missionId: chatInfo.value.missionId,
          isPosition: message.type === 'location',
          isSelfDestruct: chatInfo.value.isBurnAfterReadingMode
        };

        if (chatInfo.value.type === 'group') {
          // 群聊消息
          response = await sendGroupMessage({
            ...messageData,
            isGroupAnnouncement: false
          });
        } else {
          // 私聊消息
          response = await sendMessageToUser(messageData);
        }

        console.log('发送消息响应:', response);
        if (response.code === 200) {
          const sentMessage = {
            ...response.data,
            selfDestruct: response.data.selfDestruct,
            content: message.content,
            userType: 'self',
            timestamp: new Date(),
            type: message.type || 'text',
            messageType: message.type === 'text' ? 'MESSAGE' : message.type.toUpperCase()
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
        console.log('发送消息失败:', error);
      }
    } else {
      console.log('消息内容为空或 chatInfo 未正确初始化', {
        content: message.content,
        chatInfo: chatInfo.value
      });
    }
  };

  // 处理消息发送成功
  const handleMessageSent = (sentMessage) => {
    console.log('消息已发送:', sentMessage);
    list.value.push(sentMessage);
  };

  // 处理消息发送失败
  const handleMessageFailed = (failedMessage) => {
    console.log('消息发送失败:', failedMessage);
  };

  // 加载历史消息
  const loadHistoryMessages = async (isLoadingMore = false, newFrom = null, newTo = null) => {
    if (!chatInfo.value || !chatInfo.value.id || !chatInfo.value.missionId) {
      console.log('chatInfo 未正确初始化');
      hasMoreMessages.value = false;
      return false;
    }
    
    const from = newFrom !== null ? newFrom : currentFrom.value;
    const to = newTo !== null ? newTo : currentTo.value;
    
    console.log('开始加载历史消息', { 
      isLoadingMore, 
      from,
      to,
      missionId: chatInfo.value.missionId 
    });

    try {
      let response;
      if (chatInfo.value.type === 'group') {
        response = await getGroupChatMessages({
          opponentId: chatInfo.value.id,
          from,
          to
        });
      } else {
        response = await getHistoryChatMessages({
          opponentId: chatInfo.value.id,
          from,
          to,
          missionId: chatInfo.value.missionId
        });
      }

      console.log('历史消息响应:', response);

      if (response.code === 200) {
        let newMessages;
        if (chatInfo.value.type === 'group') {
          newMessages = response.data.groupMessageVOS.reverse().map(msg => mapGroupMessage(msg));
        } else {
          newMessages = response.data.messageVOList.reverse().map(msg => mapPrivateMessage(msg));
        }

        console.log('新消息数量:', newMessages.length);

        if (isLoadingMore) {
          list.value = [...newMessages, ...list.value];
          console.log('在列表前端添加新消息');
        } else {
          list.value = newMessages;
          console.log('替换整个消息列表');
        }
        
        hasMoreMessages.value = newMessages.length === (to - from + 1);
        console.log('是否有更多消息:', hasMoreMessages.value);

        currentFrom.value = from;
        currentTo.value = to;

        console.log('更新后的消息列表长度:', list.value.length);

        if (!isLoadingMore) {
          nextTick(() => {
            scrollToBottom();
          });
        }

        return true;
      } else {
        console.log('加载历史消息失败:', response.msg);
        hasMoreMessages.value = false;
        uni.showToast({
          title: '加载历史消息失败',
          icon: 'none'
        });
        return false;
      }
    } catch (error) {
      console.log('加载历史消息出错:', error);
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
    console.log('开始更新消息列表');
    try {
      let response;
      if (chatInfo.value.type === 'group') {
        response = await getGroupChatMessages({
          opponentId: chatInfo.value.id,
          from: 0,
          to: 10
        });
      } else {
        response = await getHistoryChatMessages({
          opponentId: chatInfo.value.id,
          from: 0,
          to: 10,
          missionId: chatInfo.value.missionId
        });
      }

      console.log('接收到的响应:', response);

      if (response.code === 200) {
        let newMessages;
        if (chatInfo.value.type === 'group') {
          newMessages = response.data.groupMessageVOS.reverse().map(msg => mapGroupMessage(msg));
        } else {
          newMessages = response.data.messageVOList.reverse().map(msg => mapPrivateMessage(msg));
        }

        list.value = newMessages;

        console.log('消息列表已更新，新长度:', list.value.length);

        nextTick(() => {
          scrollToBottom();
        });
      } else {
        console.log('获取新消息失败:', response.msg);
        throw new Error(response.msg || '获取新消息失败');
      }
    } catch (error) {
      console.log('更新消息列表出错:', error);
      uni.showToast({
        title: '更新消息列表失败，请重试',
        icon: 'none'
      });
    }
  };

  // 映射私聊消息
  const mapPrivateMessage = (msg) => {
    let content = msg.message;
    let type = msg.messageType.toLowerCase();

    if (type === 'position') {
      try {
        content = JSON.parse(msg.message);
        type = 'location';
      } catch (e) {
        console.log('解析位置数据失败:', e);
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
  };

  // 映射群聊消息
  const mapGroupMessage = (msg) => {
    let content = msg.message;
    let type = msg.messageType.toLowerCase();

    if (type === 'position') {
      try {
        content = JSON.parse(msg.message);
        type = 'location';
      } catch (e) {
        console.log('解析位置数据失败:', e);
      }
    } else if (type === 'image') {
      content = msg.previewUrl || msg.message;
    } else if (type === 'text' && msg.message.toLowerCase().endsWith('.txt')) {
      type = 'file';
    } else if (type === 'audio' || type === 'voice_message') {
      content = msg.previewUrl || msg.message;
    }

    // 从 groupStore 中获取群组信息
    const groupInfo = groupStore.state.groupInfo;
    let avatar = chatInfo.value._selfAvatar; // 默认头像

    if (groupInfo && groupInfo.groupMembers) {
      const sender = groupInfo.groupMembers.find(member => member.userId === msg.senderId);
      if (sender) {
        avatar = sender.avatarUrl;
      }
    }

    const mappedMessage = {
      id: msg.id,
      content: content,
      userType: userStore.state.id === msg.senderId ? 'self' : 'other',
      avatar: avatar,
      timestamp: new Date(msg.sendTime),
      type: type,
      isRead: msg.groupMessageUserReadVO.some(user => user.userId === chatInfo.value.id && user.isRead),
      messageType: msg.messageType,
      selfDestruct: msg.selfDestruct,
      senderName: msg.groupMessageUserReadVO.find(user => user.userId === msg.senderId)?.userName || '未知用户'
    };
    console.log(mappedMessage,'mappedMessage',msg.senderId,userStore.state.id)
    handleSelfDestructMessage(mappedMessage);

    return mappedMessage;
  };

  // 处理文件选择
  const handleFileSelected = async (fileInfo) => {
    console.log('文件被选择，完整的 fileInfo:', JSON.stringify(fileInfo));
    console.log('当前 isBurnAfterReadingMode 状态:', chatInfo.value.isBurnAfterReadingMode);
    if (!fileInfo || typeof fileInfo !== 'object') {
      console.log('文件信息无效:', fileInfo);
      uni.showToast({
        title: '文件信息无效，请重试',
        icon: 'none'
      });
      return;
    }

    if (!fileInfo.path) {
      console.log('文件路径缺失:', fileInfo);
      uni.showToast({
        title: '文件路径缺失，请重试',
        icon: 'none'
      });
      return;
    }

    try {
      const response = await sendFilesToUser({
        files: [fileInfo.path],
        isGroup: chatInfo.value.type === 'group',
        isSelfDestruct: chatInfo.value.isBurnAfterReadingMode || false,
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
      console.log('发送文件消息出错:', error);
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

  // 处理消息删除
  const handleMessageDeleted = (messageId) => {
    const index = list.value.findIndex(msg => msg.id === messageId);
    if (index !== -1) {
      list.value.splice(index, 1);
    }
  };

  return {
    sendMessage,
    handleMessageFailed,
    loadHistoryMessages,
    updateMessageList,
    handleFileSelected,
    handleMessageDeleted
  };
}

