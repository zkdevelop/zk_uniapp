import { ref, onMounted, watch } from 'vue';

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
  const messageList = ref([]);

  // 加载更多消息
  const loadMoreMessages = async () => {
    if (!hasMoreMessages.value || !messageListRef.value) {
      return;
    }

    try {
      const oldContentHeight = messageListRef.value.scrollHeight;
      // 模拟获取更多消息
      await new Promise(resolve => setTimeout(resolve, 500));
      const newMessages = Array.from({ length: 10 }, (_, i) => `新消息 ${i + 1}`);
      messageList.value = [...messageList.value, ...newMessages];
      const newContentHeight = messageListRef.value.scrollHeight;
      const heightDifference = newContentHeight - oldContentHeight;

      if (heightDifference > 0) {
        messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
      }

    } catch (error) {
      console.log("加载更多消息时出错:", error);
    }
  };

  // 处理附件
  const handleAttachment = (type, data) => {
    console.log('UI交互:', {
      操作: '附件',
      附件类型: type,
      是否滚动到底部: isScrolledToBottom.value,
      是否有新消息: hasNewMessages.value
    });
  };

  // 处理位置消息
  const handleLocationMessage = (locationData) => {
    console.log('UI交互:', {
      操作: '位置',
      附件类型: null,
      是否滚动到底部: isScrolledToBottom.value,
      是否有新消息: hasNewMessages.value
    });
  };

  // 切换附件菜单
  const toggleAttachMenu = (show) => {
    console.log('UI交互:', {
      操作: '切换附件菜单',
      附件类型: null,
      是否滚动到底部: isScrolledToBottom.value,
      是否有新消息: hasNewMessages.value
    });
  };

  // 处理遮罩层点击
  const handleOverlayClick = () => {
    showAttachMenu.value = false;
  };

  // 滚动到底部
  const scrollToBottom = () => {
    if (messageListRef.value && messageListRef.value.scrollToBottom) {
      messageListRef.value.scrollToBottom();
      showScrollToBottom.value = false;
      showNewMessageTip.value = false;
      hasNewMessages.value = false;
      isScrolledToBottom.value = true;
    }
  };

  // 处理滚动事件
  const onScroll = () => {
    if (messageListRef.value.scrollTop + messageListRef.value.clientHeight >= messageListRef.value.scrollHeight) {
      isScrolledToBottom.value = true;
      loadMoreMessages();
    } else {
      isScrolledToBottom.value = false;
    }
    console.log('UI交互:', {
      操作: '滚动',
      附件类型: null,
      是否滚动到底部: isScrolledToBottom.value,
      是否有新消息: hasNewMessages.value
    });
  };

  // 切换阅后即焚模式
  const toggleBurnAfterReadingMode = (isActive) => {
    // 这里可以添加切换阅后即焚模式的逻辑
  };

  onMounted(() => {
    loadMoreMessages();
  });

  watch(hasNewMessages, (newValue) => {
    if (newValue) {
      // 当有新消息时滚动到底部
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
    }
  });

  return {
    messageList,
    loadMoreMessages,
    handleAttachment,
    handleLocationMessage,
    toggleAttachMenu,
    handleOverlayClick,
    scrollToBottom,
    onScroll,
    toggleBurnAfterReadingMode
  };
}

