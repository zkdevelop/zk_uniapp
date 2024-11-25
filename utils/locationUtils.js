/**
 * 获取当前位置的经纬度坐标
 * @returns {Promise<{latitude: number, longitude: number, error: boolean, errorMessage: string}>} 包含经纬度、错误标志和错误消息的对象
 */
export function getCurrentCoordinates() {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve({
        latitude: 0,
        longitude: 0,
        error: true,
        errorMessage: '获取位置超时'
      });
    }, 1000);

    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        clearTimeout(timeoutId);
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
          error: false,
          errorMessage: ''
        });
      },
      fail: (err) => {
        clearTimeout(timeoutId);
        console.error('获取位置失败:', err);
        resolve({
          latitude: 0,
          longitude: 0,
          error: true,
          errorMessage: '获取位置失败: ' + JSON.stringify(err)
        });
      }
    });
  });
}

/**
 * 检查是否有位置权限
 * @returns {Promise<boolean>} 是否有位置权限
 */
export function checkLocationPermission() {
  return new Promise((resolve) => {
    uni.authorize({
      scope: 'scope.userLocation',
      success: () => {
        resolve(true);
      },
      fail: () => {
        resolve(false);
      }
    });
  });
}

/**
 * 打开应用设置页面
 */
export function openAppSettings() {
  uni.openSetting({
    success: (res) => {
      console.log('打开设置页面成功', res);
    },
    fail: (err) => {
      console.error('打开设置页面失败', err);
    }
  });
}