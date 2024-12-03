// useVoiceInput.js
import { ref, onMounted, onUnmounted } from 'vue';

export default function useVoiceInput(emit) {
  const isRecording = ref(false);
  const recordAuth = ref(false);
  const duration = ref(0);
  const voiceStatus = ref({
    status: 'ready',
    duration: 0,
    volume: 0,
  });

  let recorder = null;
  let audioContext = null;
  let audioStream = null;

  // 初始化录音
  async function initRecorder() {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder = audioContext.createMediaStreamSource(audioStream);
      recordAuth.value = true;
      console.log('录音初始化成功');
    } catch (error) {
      console.error('录音初始化失败:', error);
      uni.showToast({
        title: '无法初始化录音',
        icon: 'none'
      });
    }
  }

  // 开始录音
  async function startVoiceRecord() {
    if (!recordAuth.value) {
      await initRecorder();
    }

    if (!recorder) {
      console.error('录音器未初始化');
      return;
    }

    isRecording.value = true;
    voiceStatus.value = {
      status: 'recording',
      duration: 0,
      volume: 0,
    };

    const chunks = [];
    const mediaRecorder = new MediaRecorder(audioStream);

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(blob);
      emit('file-selected', {
        type: 'voice',
        path: audioUrl,
        duration: Math.round(duration.value / 1000),
        size: blob.size,
        name: 'voice_message.webm'
      });
    };

    mediaRecorder.start();

    // 更新录音状态
    const startTime = Date.now();
    const updateStatus = setInterval(() => {
      duration.value = Date.now() - startTime;
      voiceStatus.value.duration = duration.value;
      // 这里可以添加音量检测逻辑
    }, 100);

    // 保存停止函数以便后续调用
    const stopRecording = () => {
      clearInterval(updateStatus);
      mediaRecorder.stop();
      isRecording.value = false;
      voiceStatus.value.status = 'ready';
    };

    return stopRecording;
  }

  // 停止录音
  function stopVoiceRecord(stopRecording) {
    if (stopRecording) {
      stopRecording();
    }
  }

  // 获取录音权限
  async function getRecordPermission() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recordAuth.value = true;
    } catch (error) {
      console.error('无法获取录音权限:', error);
      uni.showToast({
        title: '无法获取录音权限',
        icon: 'none'
      });
    }
  }

  onMounted(() => {
    getRecordPermission();
  });

  onUnmounted(() => {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext) {
      audioContext.close();
    }
  });

  return {
    isRecording,
    recordAuth,
    duration,
    voiceStatus,
    startVoiceRecord,
    stopVoiceRecord,
  };
}