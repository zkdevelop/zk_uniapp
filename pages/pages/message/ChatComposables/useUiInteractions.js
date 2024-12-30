// useUiInteractions.js - 负责处理用户界面交互相关的功能
import { nextTick } from 'vue'

export function useUiInteractions({
  messageListRef,
  isScrolledToBottom,
  showScrollToBottom,
  showNewMessageTip,
  hasNewMessages,
  isLoading,
  currentFrom,
  currentTo,
  loadHistoryMessages,
  showAttachMenu,
  hasMoreMessages
}) {
  // 处理附件
  const handleAttachment = (type, data) => {
    console.log('[handleAttachment] 处理附件:', type, data);
    if (type === 'location') {
      handleLocationMessage(data);
    } else {
      const handlers = {
        album: chooseImage,
        file: () => handleFileTransfer(data),
        'burn-after-reading': () => handleBurnAfterReading(data)
      };
      if (handlers[type]) {
        handlers[type]();
      }
    }
  };

  // 处理位置消息
  const handleLocationMessage = (locationData) => {
    console.log('[handleLocationMessage] 处理位置消息:', locationData);
    sendMessage({
      type: 'location',
      content: locationData
    });
  };

  // 查看阅后即焚图片
  const viewBurnAfterReadingImage = (message) => {
    currentBurnAfterReadingImage.value = message.content.originalPath;
    currentBurnAfterReadingMessage.value = message;
    nextTick(() => {
      if (burnAfterReadingRef.value) {
        burnAfterReadingRef.value.open();
      }
    });
  };

  // 关闭阅后即焚预览
  const closeBurnAfterReadingPreview = () => {
    currentBurnAfterReadingImage.value = '';
    if (currentBurnAfterReadingMessage.value) {
      const index = list.value.indexOf(currentBurnAfterReadingMessage.value);
      if (index > -1) {
        list.value.splice(index, 1);
      }
      currentBurnAfterReadingMessage.value = null;
    }
    updateMessageList();
  };

  // 切换附件菜单
  const toggleAttachMenu = (show) => {
    showAttachMenu.value = show;
    console.log('附件菜单切换:', show);
  };

  // 处理遮罩层点击
  const handleOverlayClick = () => {
    showAttachMenu.value = false;
    console.log('附件菜单已关闭');
  };

  // 滚动到底部
  const scrollToBottom = () => {
    nextTick(() => {
      if (messageListRef.value && messageListRef.value.scrollToBottom) {
        messageListRef.value.scrollToBottom();
        showScrollToBottom.value = false;
        showNewMessageTip.value = false;
        hasNewMessages.value = false;
        isScrolledToBottom.value = true;
        console.log('滚动到底部');
      }
    });
  };

  // 处理滚动事件
  const onScroll = (event) => {
    if (messageListRef.value && messageListRef.value.scrollViewHeight) {
      const { scrollTop, scrollHeight } = event.detail;
      const isAtBottom = scrollHeight - (scrollTop + messageListRef.value.scrollViewHeight) < 10;
      
      isScrolledToBottom.value = isAtBottom;
      showScrollToBottom.value = !isAtBottom && hasNewMessages.value;
      showNewMessageTip.value = !isAtBottom && hasNewMessages.value;
      if (isAtBottom) {
        hasNewMessages.value = false;
        showNewMessageTip.value = false;
      }
    }
  };

  // 加载更多消息
  const loadMoreMessages = async () => {
    console.log('[loadMoreMessages] 开始加载更多消息');
    console.log('[loadMoreMessages] hasMoreMessages:', hasMoreMessages.value);
    console.log('[loadMoreMessages] messageListRef:', messageListRef.value);
    
    // 安全检查：确保 hasMoreMessages 存在且为 true，且 messageListRef 不为 null
    if (!hasMoreMessages || !hasMoreMessages.value || !messageListRef.value) {
      console.log('[loadMoreMessages] 没有更多消息或 messageListRef 为 null');
      console.log('[loadMoreMessages] hasMoreMessages:', hasMoreMessages);
      console.log('[loadMoreMessages] messageListRef:', messageListRef.value);
      return;
    }

    if (!isLoading.value) {
      isLoading.value = true;
    
    try {
      const oldContentHeight = await messageListRef.value.getContentHeight();
      console.log('[loadMoreMessages] 旧内容高度:', oldContentHeight);

      const newFrom = currentTo.value + 1;
      const newTo = currentTo.value + 10;
  
      const loadResult = await loadHistoryMessages(true, newFrom, newTo);
    
      if (loadResult) {
        nextTick(async () => {
          if (messageListRef.value) {  // 再次检查 messageListRef 是否存在
            const newContentHeight = await messageListRef.value.getContentHeight();
            console.log('[loadMoreMessages] 新内容高度:', newContentHeight);

            const heightDifference = newContentHeight - oldContentHeight;
            console.log('[loadMoreMessages] 高度差:', heightDifference);
        
            if (messageListRef.value.setScrollTop) {
              messageListRef.value.setScrollTop(heightDifference);
            }
          }

          isLoading.value = false;
          console.log('[loadMoreMessages] 加载完成');
        });
      } else {
        isLoading.value = false;
      }
    } catch (error) {
      console.error('[loadMoreMessages] 加载更多消息时出错:', error);
      isLoading.value = false;
    }
    } else {
      console.log('[loadMoreMessages] 正在加载中');
    }
  };

  // 切换阅后即焚模式
  const toggleBurnAfterReadingMode = (isActive) => {
    isBurnAfterReadingMode.value = isActive;
  };

  return {
    handleAttachment,
    viewBurnAfterReadingImage,
    closeBurnAfterReadingPreview,
    toggleAttachMenu,
    handleOverlayClick,
    scrollToBottom,
    onScroll,
    loadMoreMessages,
    toggleBurnAfterReadingMode
  };
}

