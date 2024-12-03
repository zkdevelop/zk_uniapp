// useMessageSending.js - 消息发送相关的可组合函数
export default function useMessageSending(newMessage, emit, props) {
  // 发送消息
  const sendMessage = () => {
    console.log('sendMessage 方法被调用')
    
    if (typeof newMessage.value !== 'string' || !newMessage.value.trim()) {
      console.log('消息为空或不是字符串，不发送')
      return
    }

    const messageData = {
      content: newMessage.value,
      type: 'text',
      recipientId: props.recipientId,
      missionId: props.missionId
    }
    
    console.log('准备发送消息:', messageData)
    
    emit('send-message', messageData)
    
    newMessage.value = ''
  }

  return {
    sendMessage
  }
}