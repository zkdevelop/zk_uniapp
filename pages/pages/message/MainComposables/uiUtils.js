// uiUtils.js - UI相关的工具函数

// 计算滚动视图高度
export const calculateScrollViewHeight = () => {
  const systemInfo = uni.getSystemInfoSync()
  const headerHeight = 44 // 根据实际头部高度调整
  const tabBarHeight = 50 // 根据实际底部 tabBar 高度调整
  return systemInfo.windowHeight - headerHeight - tabBarHeight
}

