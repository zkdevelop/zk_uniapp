import { ref, reactive, onMounted, onUnmounted } from 'vue'

export function afterAudioRecord() {
    getApp().globalData.audioRecording = false
}

export function afterAudioPlay() {
    getApp().globalData.audioPlaying = false
}

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

export default function useVoiceInput(emit) {
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
        console.log('RecorderManager initialized successfully')
      } else {
        console.error('Failed to get RecorderManager instance')
      }
    } else {
      console.error('RecorderManager is not available on this platform')
    }
  }

  function startVoiceRecord() {
    if (!recorderManager) {
      console.error('RecorderManager is not initialized')
      uni.showToast({
        title: '录音功能初始化失败',
        icon: 'none'
      })
      return
    }

    if (recordImg.value === '/static/images/icon_record.png' && beforeAudioRecordOrPlay('record')) {
      // Reset timer and status before starting
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

  function stopVoiceRecord() {
    if (!recorderManager) {
      console.error('RecorderManager is not initialized')
      return
    }

    recorderManager.stop()
    afterAudioRecord()
  }

  function onStart(e) {
    console.log('开始录音', e)
    recordImg.value = '/static/images/icon_recording.png'
    isRecording.value = true
    voiceStatus.status = 'recording'
    startTimer()
  }

  function onPause(e) {
    console.log('录音暂停', e)
    afterAudioRecord()
    stopTimer()
  }

  function onResume(e) {
    console.log('录音恢复', e)
    startTimer()
  }

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

  function onInterruptionBegin(e) {
    console.log('录音因为受到系统占用而被中断', e)
    stopTimer()
  }

  function onInterruptionEnd(e) {
    console.log('录音中断结束', e)
    startTimer()
  }

  function onError(e) {
    console.log('录音错误', e)
    uni.showToast({
      title: '录音失败，请重试',
      icon: 'none'
    })
    stopTimer()
    resetTimer()
  }

  function startTimer() {
    if (!timer) {
      timer = setInterval(() => {
        time.value++
        voiceStatus.duration = time.value
      }, 1000)
    }
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function resetTimer() {
    stopTimer()
    time.value = 0
    voiceStatus.duration = 0
  }

  function uploadMp3Action(e) {
    console.log('Uploading MP3', e)
    emit('file-selected', {
      type: 'voice',
      path: e.tempFilePath,
      duration: time.value,
      size: e.fileSize
    })
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