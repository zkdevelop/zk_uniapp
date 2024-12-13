<!-- VoiceMessageBubble.vue -->
<template>  
  <view 
    class="voice-message-bubble"
    :class="[
      content.isSelf ? 'self' : 'friend',
      isPlaying ? 'playing' : ''
    ]"
    :style="bubbleStyle"
    @click="togglePlay"
  >
    <view class="audio-icon">
      <view class="speaker-waves">
        <view class="wave" v-for="i in 3" :key="i"></view>
      </view>
    </view>
    
    <text class="duration">{{ formatDuration(audioDuration) }}"</text>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'

const props = defineProps({
  content: {
    type: Object,
    required: true,
    default: () => ({
      url: '',
      duration: 0,
      isSelf: false
    })
  }
})

const isPlaying = ref(false)
const audioDuration = ref(0)
let audioContext = null

// 格式化时长显示
const formatDuration = (duration) => {
  return Math.round(duration || 0)
}

// 在录音或播放音频前的检查
const beforeAudioRecordOrPlay = (type) => {
  const globalData = getApp().globalData
  const audioPlaying = globalData.audioPlaying
  const audioRecording = globalData.audioRecording

  if (audioPlaying || audioRecording) {
    uni.showToast({
      title: audioPlaying ? '请先暂停其他音频播放' : '请先结束其他录音',
      icon: 'none'
    })
    return false
  } else {
    if (type === 'play') {
      globalData.audioPlaying = true
    } else if (type === 'record') {
      globalData.audioRecording = true
    } else {
      console.error(`无效的类型: ${type}`)
      return false
    }
    return true
  }
}

// 音频播放结束后的处理
const afterAudioPlay = () => {
  getApp().globalData.audioPlaying = false
}

// 检查音频文件是否存在
const checkAudioFileExists = (url) => {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url: url,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(true)
        } else {
          reject(new Error(`音频文件下载失败，状态码：${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(new Error(`音频文件检查失败：${err.errMsg}`))
      }
    })
  })
}

// 创建音频上下文
const createAudioContext = async () => {
  if (audioContext) {
    audioContext.destroy()
  }
  if (!props.content.url) {
    console.error('音频 URL 未定义')
    uni.showToast({
      title: '音频文件不存在',
      icon: 'none'
    })
    return null
  }

  try {
    await checkAudioFileExists(props.content.url)
  } catch (error) {
    console.error('音频文件检查失败:', error)
    uni.showToast({
      title: '音频文件不可用',
      icon: 'none'
    })
    return null
  }

  audioContext = uni.createInnerAudioContext()
  audioContext.src = props.content.url
  
  audioContext.onCanplay(() => {
    console.log('音频可以播放')
    audioDuration.value = audioContext.duration || props.content.duration || 0
  })

  audioContext.onPlay(() => {
    console.log('音频开始播放')
    isPlaying.value = true
  })
  
  audioContext.onEnded(() => {
    console.log('音频播放结束')
    isPlaying.value = false
    afterAudioPlay()
  })
  
  audioContext.onError((res) => {
    console.error('音频播放错误:', res.errMsg, res.errCode)
    uni.showToast({
      title: '播放失败: ' + res.errMsg,
      icon: 'none'
    })
    isPlaying.value = false
    afterAudioPlay()
  })

  audioContext.onWaiting(() => {
    console.log('音频加载中...')
  })

  return audioContext
}

// 计算气泡样式
const bubbleStyle = computed(() => {
  const minWidth = 120 // 最小宽度，单位 rpx
  const maxWidth = 300 // 最大宽度，单位 rpx
  const widthPerSecond = 10 // 每秒增加的宽度，单位 rpx
  const duration = audioDuration.value || 0
  
  let width = minWidth + duration * widthPerSecond
  width = Math.min(width, maxWidth) // 确保不超过最大宽度
  
  return {
    width: `${width}rpx`
  }
})

// 切换播放状态
const togglePlay = async () => {
  console.log('togglePlay 被调用')
  if (!audioContext) {
    audioContext = await createAudioContext()
  }
  if (!audioContext) {
    console.error('无法创建音频上下文')
    return
  }

  if (isPlaying.value) {
    console.log('停止播放')
    audioContext.stop()
    isPlaying.value = false
    afterAudioPlay()
  } else {
    console.log('开始播放')
    if (beforeAudioRecordOrPlay('play')) {
      try {
        await audioContext.play()
      } catch (error) {
        console.error('播放音频失败:', error)
        uni.showToast({
          title: '播放失败，请重试',
          icon: 'none'
        })
        isPlaying.value = false
        afterAudioPlay()
      }
    }
  }
}

onMounted(async () => {
  console.log('VoiceMessageBubble 组件已挂载')
  audioContext = await createAudioContext()
})

onUnmounted(() => {
  console.log('VoiceMessageBubble 组件即将卸载')
  if (audioContext) {
    audioContext.destroy()
  }
})

// 监听 content 属性的变化
watch(() => props.content, async (newContent) => {
  if (newContent.url !== audioContext?.src) {
    audioContext = await createAudioContext()
  }
  audioDuration.value = newContent.duration || 0
}, { deep: true })
</script>

<style lang="scss" scoped>
.voice-message-bubble {
  display: flex;
  align-items: center;
  padding: 12rpx 24rpx;
  border-radius: 36rpx;
  background-color: #f5f5f5;
  min-width: 120rpx;
  max-width: 300rpx;
  
  &.friend {
    background-color: #f5f5f5;
    
    .audio-icon {
      margin-right: 16rpx;
    }
    
    .speaker-waves {
      flex-direction: row;
    }
  }
  
  &.self {
    background-color: #4e8cff;
    flex-direction: row-reverse;
    
    .audio-icon {
      margin-left: 16rpx;
    }
    
    .duration {
      color: #ffffff;
    }
  }
}

.audio-icon {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
}

.speaker-waves {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 4rpx;
}

.wave {
  width: 3rpx;
  height: 6rpx;
  background-color: #666;
  border-radius: 1.5rpx;
  
  .self & {
    background-color: #ffffff;
  }
}

.playing .wave {
  animation: waveAnimation 1s ease infinite;
  
  &:nth-child(2) {
    animation-delay: 0.2s;
    height: 12rpx;
  }
  
  &:nth-child(3) {
    animation-delay: 0.4s;
    height: 16rpx;
  }
}

@keyframes waveAnimation {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(1.5);
  }
}

.duration {
  font-size: 28rpx;
  color: #666666;
  font-weight: normal;
}
</style>