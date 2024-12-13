// useVoiceInput.js
import { ref, reactive, onMounted, onUnmounted } from 'vue'

// 音频录制结束后的处理函数
export function afterAudioRecord() {
    getApp().globalData.audioRecording = false
}

// 音频播放结束后的处理函数
export function afterAudioPlay() {
    getApp().globalData.audioPlaying = false
}

// 在音频录制或播放前的检查函数
export function beforeAudioRecordOrPlay(type) {
    const audioPlaying = getApp().globalData.audioPlaying
    const audioRecording = getApp().globalData.audioRecording
    if (audioPlaying || audioRecording) {
        uni.showToast({
            title: audioPlaying ? '请先暂停其他音频播放' : '请先结束其他录音',
            icon: 'none'
        })
        return false
    } else {
        if (type === 'play') {
            getApp().globalData.audioPlaying = true
        } else if (type === 'record') {
            getApp().globalData.audioRecording = true
        } else {
            throw new Error('type Error', type)
        }
        return true
    }
}

// 语音输入钩子函数
export default function useVoiceInput(onFileSelected) {
  const isRecording = ref(false)
  const recordAuth = ref(false)
  const duration = ref(600000) // 最大录音时长，10分钟
  const tempFilePath = ref('')
  const time = ref(0)
  const voiceAllTime = ref(0)
  const playStatus = ref(0)
  const recordImg = ref('/static/images/icon_record.png')

  const voiceStatus = reactive({
    status: 'ready',
    duration: 0,
    volume: 0,
  })

  let recorderManager = null
  let timer = null

  onMounted(() => {
    initRecorderManager()
  })

  onUnmounted(() => {
    if (recorderManager) {
      recorderManager.onStop(() => {})
      recorderManager.onError(() => {})
    }
    stopTimer()
  })

  // 初始化录音管理器
  function initRecorderManager() {
    if (typeof uni !== 'undefined' && uni.getRecorderManager) {
      recorderManager = uni.getRecorderManager()
      if (recorderManager) {
        recorderManager.onStart((e) => onStart(e))
        recorderManager.onPause((e) => onPause(e))
        recorderManager.onResume((e) => onResume(e))
        recorderManager.onInterruptionBegin((e) => onInterruptionBegin(e))
        recorderManager.onInterruptionEnd((e) => onInterruptionEnd(e))
        recorderManager.onError((e) => onError(e))
        recorderManager.onStop((e) => onStop(e))
        console.log('录音管理器初始化成功')
      } else {
        console.error('获取录音管理器实例失败')
      }
    } else {
      console.error('当前平台不支持录音管理器')
    }
  }

  // 开始录音
  function startVoiceRecord() {
    if (!recorderManager) {
      console.error('录音管理器未初始化')
      uni.showToast({
        title: '录音功能初始化失败',
        icon: 'none'
      })
      return
    }

    if (recordImg.value === '/static/images/icon_record.png' && beforeAudioRecordOrPlay('record')) {
      // 重置计时器和状态
      resetTimer()
      recorderManager.start({
        duration: duration.value,
        format: 'mp3',
        sampleRate: 22050,
      })
    } else if (recordImg.value === '/static/images/icon_recording.png') {
      stopVoiceRecord()
    }
  }

  // 停止录音
  function stopVoiceRecord() {
    if (!recorderManager) {
      console.error('录音管理器未初始化')
      return
    }

    recorderManager.stop()
    afterAudioRecord()
  }

  // 录音开始回调
  function onStart(e) {
    console.log('开始录音', e)
    recordImg.value = '/static/images/icon_recording.png'
    isRecording.value = true
    voiceStatus.status = 'recording'
    startTimer()
  }

  // 录音暂停回调
  function onPause(e) {
    console.log('录音暂停', e)
    afterAudioRecord()
    stopTimer()
  }

  // 录音恢复回调
  function onResume(e) {
    console.log('录音恢复', e)
    startTimer()
  }

  // 录音结束回调
  function onStop(e) {
    console.log('录音结束', e)
    recordImg.value = '/static/images/icon_record.png'
    isRecording.value = false
    voiceStatus.status = 'ready'
    tempFilePath.value = e.tempFilePath
    time.value = Math.round(e.duration / 1000)
    voiceAllTime.value = time.value
    voiceStatus.duration = time.value
    stopTimer()
    uploadMp3Action(e)
  }

  // 录音被中断开始回调
  function onInterruptionBegin(e) {
    console.log('录音因为受到系统占用而被中断', e)
    stopTimer()
  }

  // 录音中断结束回调
  function onInterruptionEnd(e) {
    console.log('录音中断结束', e)
    startTimer()
  }

  // 录音错误回调
  function onError(e) {
    console.log('录音错误', e)
    uni.showToast({
      title: '录音失败，请重试',
      icon: 'none'
    })
    stopTimer()
    resetTimer()
  }

  // 开始计时器
  function startTimer() {
    if (!timer) {
      timer = setInterval(() => {
        time.value++
        voiceStatus.duration = time.value
      }, 1000)
    }
  }

  // 停止计时器
  function stopTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  // 重置计时器
  function resetTimer() {
    stopTimer()
    time.value = 0
    voiceStatus.duration = 0
  }

  // 上传MP3文件
  function uploadMp3Action(e) {
    console.log('上传MP3，完整的事件对象:', JSON.stringify(e))
    
    if (!e || !e.tempFilePath) {
      console.error('录音文件路径缺失:', e)
      uni.showToast({
        title: '录音文件保存失败，请重试',
        icon: 'none'
      })
      return
    }

    const fileInfo = {
      type: 'voice',
      path: e.tempFilePath,
      duration: time.value,
      size: e.fileSize,
      fromVoiceInput: true
    }
    
    console.log('准备发送的文件信息:', JSON.stringify(fileInfo))
    onFileSelected(fileInfo)
  }

  return {
    isRecording,
    recordAuth,
    duration,
    tempFilePath,
    time,
    voiceAllTime,
    playStatus,
    voiceStatus,
    recordImg,
    startVoiceRecord,
    stopVoiceRecord,
  }
}