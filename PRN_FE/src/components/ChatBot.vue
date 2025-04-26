<script>
export default {
  name: 'ChatBot',
  data() {
    return {
      messages: [
        {
          content: "Xin chào! Tôi là trợ lý ảo giúp bạn tìm phòng phù hợp. Bạn có thể hỏi tôi về các phòng hiện có, giá cả, tiện nghi, hoặc bất kỳ thông tin nào về phòng. Tôi sẽ giúp bạn tìm phòng phù hợp nhất!",
          isUser: false,
          timestamp: new Date().toLocaleTimeString()
        }
      ],
      newMessage: '',
      isLoading: false,
      isChatOpen: false
    }
  },
  methods: {
    async sendMessage() {
      if (!this.newMessage.trim()) return;

      this.messages.push({
        content: this.newMessage,
        isUser: true,
        timestamp: new Date().toLocaleTimeString()
      });

      const userMessage = this.newMessage;
      this.newMessage = '';
      this.isLoading = true;

      try {
        const response = await fetch('https://localhost:7223/api/Chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            message: userMessage
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        this.messages.push({
          content: data.reply || "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString()
        });
      } catch (error) {
        console.error('Error:', error);
        this.messages.push({
          content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
          isUser: false,
          timestamp: new Date().toLocaleTimeString()
        });
      } finally {
        this.isLoading = false;
      }
    },
    toggleChat() {
      this.isChatOpen = !this.isChatOpen;
    }
  },
  mounted() {
    // Auto-scroll to bottom when new messages are added
    this.$watch(
      () => this.messages,
      () => {
        this.$nextTick(() => {
          const container = this.$refs.messageContainer;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
      },
      { deep: true }
    );
  }
}
</script>

<template>
  <div class="chatbot-container">
    <!-- Chat Toggle Button -->
    <button class="chat-toggle" @click="toggleChat">
      <span v-if="!isChatOpen">💬 Tìm phòng với AI</span>
      <span v-else>✕</span>
    </button>

    <!-- Chat Window -->
    <div class="chat-window" :class="{ 'chat-open': isChatOpen }">
      <div class="chat-header">
        <h3>Trợ lý tìm phòng AI</h3>
      </div>

      <div class="chat-messages" ref="messageContainer">
        <div v-for="(message, index) in messages" 
             :key="index" 
             :class="['message', message.isUser ? 'user-message' : 'ai-message']">
          <div class="message-content">
            {{ message.content }}
          </div>
          <div class="message-timestamp">{{ message.timestamp }}</div>
        </div>
        <div v-if="isLoading" class="loading-indicator">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <input 
          type="text" 
          v-model="newMessage" 
          @keyup.enter="sendMessage"
          placeholder="Hỏi về phòng bạn cần..."
        >
        <button @click="sendMessage" :disabled="isLoading">Gửi</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-toggle {
  background-color: #003580;
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.chat-toggle:hover {
  background-color: #002255;
  transform: translateY(-2px);
}

.chat-window {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  transform: scale(0);
  opacity: 0;
  transition: all 0.3s ease;
  transform-origin: bottom right;
}

.chat-open {
  transform: scale(1);
  opacity: 1;
}

.chat-header {
  background-color: #003580;
  color: white;
  padding: 15px;
  border-radius: 10px 10px 0 0;
  text-align: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 18px;
}

.chat-messages {
  flex-grow: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f8f9fa;
}

.message {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 15px;
  margin: 5px 0;
  line-height: 1.4;
}

.user-message {
  background-color: #E3F2FD;
  align-self: flex-end;
  border-bottom-right-radius: 5px;
  color: #000;
}

.ai-message {
  background-color: white;
  align-self: flex-start;
  border-bottom-left-radius: 5px;
  color: #000;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.message-content {
  margin-bottom: 5px;
  word-wrap: break-word;
  white-space: pre-line;
}

.message-timestamp {
  font-size: 0.7em;
  color: #666;
  text-align: right;
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  background-color: white;
}

.chat-input input {
  flex-grow: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.chat-input input:focus {
  border-color: #003580;
  box-shadow: 0 0 0 2px rgba(0,53,128,0.1);
}

.chat-input button {
  background-color: #003580;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.chat-input button:hover {
  background-color: #002255;
  transform: translateY(-1px);
}

.chat-input button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.typing-indicator {
  display: flex;
  gap: 5px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: #003580;
  border-radius: 50%;
  animation: typing 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style> 