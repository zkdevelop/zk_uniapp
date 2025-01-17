import { ref, onMounted, watch, nextTick } from 'vue';

const throttle = (func, delay) => {
  let lastCall = 0;
  return function (...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return func.apply(this, args);
  };
};

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
  const isNearTop = ref(false);
  const scrollThreshold = 100; // 距离顶部的阈值，单位为像素
  const isInitialized = ref(false);

  // 加载更多消息
  const loadMoreMessages = async () => {
    console.log('开始加载更多消息');
    if (!hasMoreMessages.value || !messageListRef.value || isLoading.value) {
      console.log('无法加载更多消息:', { 
        hasMoreMessages: hasMoreMessages.value, 
        messageListRef: !!messageListRef.value,
        isLoading: isLoading.value
      });
      return;
    }

    isLoading.value = true;
    try {
      const oldScrollHeight = messageListRef.value.scrollHeight;
      await loadHistoryMessages(true, currentFrom.value - 10, currentFrom.value);
      await nextTick();
      const newScrollHeight = messageListRef.value.scrollHeight;
      const heightDifference = newScrollHeight - oldScrollHeight;
      
      if (heightDifference > 0) {
        messageListRef.value.scrollTop = heightDifference;
      }

      console.log('加载更多消息完成:', { 高度差: heightDifference });
    } catch (error) {
      console.log("加载更多消息时出错:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // 处理滚动事件
  const onScroll = throttle(() => {
    if (!messageListRef.value || !isInitialized.value) return;

    const { scrollTop, scrollHeight, clientHeight } = messageListRef.value;
    const isNearTopNow = scrollTop < scrollThreshold;
    const isNearBottomNow = scrollTop + clientHeight >= scrollHeight - 20;

    console.log('滚动详情:', {
      滚动位置: scrollTop,
      内容高度: scrollHeight,
      可视区域高度: clientHeight,
      距离顶部阈值: scrollThreshold,
      是否接近顶部: isNearTopNow,
      是否接近底部: isNearBottomNow,
      之前是否接近顶部: isNearTop.value,
      之前是否滚动到底部: isScrolledToBottom.value
    });

    if (isNearTopNow !== isNearTop.value) {
      isNearTop.value = isNearTopNow;
      console.log('接近顶部状态改变:', isNearTopNow);
      if (isNearTopNow && hasMoreMessages.value && !isLoading.value) {
        console.log('触发加载更多消息');
        loadMoreMessages();
      }
    }

    if (isNearBottomNow !== isScrolledToBottom.value) {
      isScrolledToBottom.value = isNearBottomNow;
      console.log('接近底部状态改变:', isNearBottomNow);
      if (isNearBottomNow) {
        showScrollToBottom.value = false;
        showNewMessageTip.value = false;
        hasNewMessages.value = false;
      }
    }
  }, 200);

  // 滚动到底部
  const scrollToBottom = () => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
      showScrollToBottom.value = false;
      showNewMessageTip.value = false;
      hasNewMessages.value = false;
      isScrolledToBottom.value = true;
    }
  };

  // 初始化
  const initialize = () => {
    if (messageListRef.value) {
      isInitialized.value = true;
      messageListRef.value.addEventListener('scroll', onScroll);
      scrollToBottom();
    }
  };

  // 清理
  const cleanup = () => {
    if (messageListRef.value) {
      messageListRef.value.removeEventListener('scroll', onScroll);
    }
  };

  onMounted(() => {
    nextTick(() => {
      initialize();
    });
  });

  watch(messageList, () => {
    nextTick(() => {
      if (isScrolledToBottom.value) {
        scrollToBottom();
      }
    });
  });

  return {
    messageList,
    loadMoreMessages,
    scrollToBottom,
    onScroll,
    isNearTop,
    initialize,
    cleanup
  };
}

