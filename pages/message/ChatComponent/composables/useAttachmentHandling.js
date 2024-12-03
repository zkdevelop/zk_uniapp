// useAttachmentHandling.js - 附件处理相关的可组合函数
import { ref } from 'vue'

export default function useAttachmentHandling(emit, props) {
  // 是否显示位置共享
  const showLocationSharing = ref(false)

  // 处理附件项选择
  const attachItem = (action, data) => {
    console.log('附件项被选择:', action)
    
    switch (action) {
      case 'file':
        chooseAndSendFile()
        break
      case 'album':
        chooseAndSendPhoto()
        break
      case 'burn-after-reading':
        // 实现阅后即焚功能
        console.log('阅后即焚功能尚未实现')
        break
      case 'camera':
        takePhoto()
        break
      case 'location':
        openLocationSharing()
        break
      case 'video-call':
        emit('video-call', action)
        break
      default:
        emit('attach', action)
    }

    // 关闭附件菜单（除了位置和文件选择）
    if (action !== 'location' && action !== 'file') {
      emit('toggle-attach-menu', false)
    }
  }

  // 选择并发送照片
  const chooseAndSendPhoto = async () => {
    console.log('chooseAndSendPhoto 方法被调用')
    try {
      const imageRes = await new Promise((resolve, reject) => {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            console.log('图片选择成功:', JSON.stringify(res))
            resolve(res)
          },
          fail: (err) => {
            console.error('图片选择失败:', err)
            reject(err)
          }
        })
      })
      
      const tempFilePath = imageRes.tempFilePaths[0]
      const fileName = tempFilePath.split('/').pop()
      console.log('选择的图片名:', fileName)

      emit('file-selected', {
        type: 'image',
        path: tempFilePath,
        name: fileName,
        recipientId: props.recipientId,
        missionId: props.missionId
      })
      emit('toggle-attach-menu', false)
    } catch (error) {
      console.error('选择图片时出错:', error)
      uni.showToast({
        title: '选择失败，请重试',
        icon: 'none'
      })
    }
  }

  // 拍摄照片
  const takePhoto = () => {
    console.log('拍摄照片')
    uni.chooseImage({
      count: 1,
      sourceType: ['camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        emit('file-selected', {
          type: 'image',
          path: tempFilePath,
          name: 'camera_photo.jpg',
          recipientId: props.recipientId,
          missionId: props.missionId
        })
      },
      fail: (err) => {
        console.error('拍照失败:', err)
        uni.showToast({
          title: '拍照失败',
          icon: 'none'
        })
      }
    })
  }

  // 打开位置共享
  const openLocationSharing = () => {
    console.log('打开位置分享')
    showLocationSharing.value = true
    emit('toggle-attach-menu', false)
  }

  // 关闭位置共享
  const closeLocationSharing = () => {
    console.log('关闭位置分享')
    showLocationSharing.value = false
  }

  // 处理位置选择
  const handleLocationSelected = (location) => {
    console.log('位置被选择:', JSON.stringify(location))
    emit('send-message', {
      type: 'location',
      content: location,
      missionId: props.missionId
    })
    closeLocationSharing()
  }

  // 选择并发送文件
  const chooseAndSendFile = () => {
    console.log('选择文件')
    uni.chooseFile({
      count: 1,
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        const fileName = res.tempFiles[0].name
        emit('file-selected', {
          type: 'file',
          path: tempFilePath,
          name: fileName,
          recipientId: props.recipientId,
          missionId: props.missionId
        })
        emit('toggle-attach-menu', false)
      },
      fail: (err) => {
        console.error('文件选择失败:', err)
        uni.showToast({
          title: '文件选择失败',
          icon: 'none'
        })
      }
    })
  }

  return {
    showLocationSharing,
    attachItem,
    handleFileSelected: chooseAndSendPhoto,
    chooseAndSendFile,
    openLocationSharing,
    closeLocationSharing,
    handleLocationSelected
  }
}