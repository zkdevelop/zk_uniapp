<template>
  <div class="loading-animation">
    <div class="spinner"></div>
    <p>正在加载消息...</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingAnimation'
}
</script>

<style scoped>
.loading-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

p {
  margin-top: 10px;
  color: #666;
}
</style>

