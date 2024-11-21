/**
 * 获取当前位置的经纬度坐标
 * @returns {Promise<{latitude: number, longitude: number}>} 包含经纬度的对象
 */
export function getCurrentCoordinates() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: (err) => {
        reject(new Error('获取位置失败: ' + JSON.stringify(err)));
      }
    });
  });
}