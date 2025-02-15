// useAttachmentHandling.js - 附件处理相关的可组合函数
import { ref } from "vue"  

export default function useAttachmentHandling(emit, props) {
  // 是否显示位置共享
  const showLocationSharing = ref(false)
  // 阅后即焚模式状态
  const isBurnAfterReadingMode = ref(false)

  // 处理附件项选择
  const attachItem = (action, data) => {
    console.log("附件项被选择:", action)

    switch (action) {
      case "file":
        chooseAndSendFile()
        break
      case "album":
        chooseAndSendPhoto()
        break
      case "burn-after-reading":
        toggleBurnAfterReadingMode()
        break
      case "camera":
        takePhoto()
        break
      case "location":
        openLocationSharing()
        break
      case "video-call":
        emit("video-call", action)
        break
      default:
        emit("attach", action)
    }

    // 关闭附件菜单（除了位置和文件选择）
    if (action !== "location" && action !== "file" && action !== "burn-after-reading") {
      emit("toggle-attach-menu", false)
    }
  }

  // 选择并发送照片
  const chooseAndSendPhoto = async () => {
    console.log("选择照片方法被调用")
    try {
      const imageRes = await new Promise((resolve, reject) => {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            console.log("图片选择成功:", JSON.stringify(res))
            resolve(res)
          },
          fail: (err) => {
            console.error("图片选择失败:", err)
            reject(err)
          },
        })
      })

      const tempFilePath = imageRes.tempFilePaths[0]
      const fileName = tempFilePath.split("/").pop()
      console.log("选择的图片名:", fileName)

      emit("file-selected", {
        type: "image",
        path: tempFilePath,
        name: fileName,
        recipientId: props.recipientId,
        missionId: props.missionId,
        isBurnAfterReading: isBurnAfterReadingMode.value,
      })
      emit("toggle-attach-menu", false)
    } catch (error) {
      console.error("选择图片时出错:", error)
      showToast("选择失败，请重试")
    }
  }

  // 拍摄照片
  const takePhoto = () => {
    console.log("拍摄照片")
    uni.chooseImage({
      count: 1,
      sourceType: ["camera"],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        emit("file-selected", {
          type: "image",
          path: tempFilePath,
          name: "camera_photo.jpg",
          recipientId: props.recipientId,
          missionId: props.missionId,
          isBurnAfterReading: isBurnAfterReadingMode.value,
        })
      },
      fail: (err) => {
        console.error("拍照失败:", err)
        showToast("拍照失败")
      },
    })
  }

  // 打开位置共享
  const openLocationSharing = () => {
    console.log("打开位置分享")
    showLocationSharing.value = true
    emit("toggle-attach-menu", false)
  }

  // 关闭位置共享
  const closeLocationSharing = () => {
    console.log("关闭位置分享")
    showLocationSharing.value = false
  }

  // 处理位置选择
  const handleLocationSelected = (location) => {
    console.log("位置被选择:", JSON.stringify(location))
    emit("send-message", {
      type: "location",
      content: location,
      missionId: props.missionId,
      isBurnAfterReading: isBurnAfterReadingMode.value,
    })
    closeLocationSharing()
  }

  // 选择并发送文件
  const chooseAndSendFile = () => {
    console.log("选择文件")
    // 判断平台
    // #ifdef APP-PLUS
    chooseFileApp()
    // #endif

    // #ifdef H5 || MP-WEIXIN || MP-ALIPAY
    chooseFileH5OrMp()
    // #endif
  }

  // App端选择文件
  const chooseFileApp = () => {
    plus.io.resolveLocalFileSystemURL(
      "_doc/",
      (entry) => {
        entry.createReader().readEntries(
          (entries) => {
            const fileList = entries.filter((entry) => !entry.isDirectory)
            if (fileList.length > 0) {
              // 这里可以显示一个文件选择器UI，让用户选择文件
              // 为了演示，我们直接选择第一个文件
              const selectedFile = fileList[0]
              handleFileSelected(selectedFile.fullPath, selectedFile.name, "file")
            } else {
              showToast("没有可选择的文件")
            }
          },
          (e) => {
            console.error("读取文件夹失败:", e)
            showToast("读取文件失败，请重试")
          },
        )
      },
      (e) => {
        console.error("解析文件系统URL失败:", e)
        showToast("无法访问文件系统，请重试")
      },
    )
  }

  // H5或小程序端选择文件
  const chooseFileH5OrMp = () => {
    uni.chooseMessageFile({
      count: 1,
      type: "file",
      success: (res) => {
        const tempFilePath = res.tempFiles[0].path
        const fileName = res.tempFiles[0].name
        handleFileSelected(tempFilePath, fileName, "file")
      },
      fail: handleFileSelectionError,
    })
  }

  const handleFileSelected = (tempFilePath, fileName, type) => {
    emit("file-selected", {
      type: type,
      path: tempFilePath,
      name: fileName,
      recipientId: props.recipientId,
      missionId: props.missionId,
      isBurnAfterReading: isBurnAfterReadingMode.value,
    })
    emit("toggle-attach-menu", false)
  }

  const handleFileSelectionError = (err) => {
    console.error("文件选择失败:", err)
    showToast("文件选择失败，请重试")
  }

  // 切换阅后即焚模式
  const toggleBurnAfterReadingMode = () => {
    isBurnAfterReadingMode.value = !isBurnAfterReadingMode.value
    console.log("阅后即焚模式已切换:", isBurnAfterReadingMode.value)
    emit("toggle-burn-after-reading", isBurnAfterReadingMode.value)
  }

  // 显示提示信息
  const showToast = (message) => {
    uni.showToast({
      title: message,
      icon: "none",
    })
  }

  return {
    showLocationSharing,
    attachItem,
    handleFileSelected,
    chooseAndSendFile,
    openLocationSharing,
    closeLocationSharing,
    handleLocationSelected,
    isBurnAfterReadingMode,
    toggleBurnAfterReadingMode,
  }
}

