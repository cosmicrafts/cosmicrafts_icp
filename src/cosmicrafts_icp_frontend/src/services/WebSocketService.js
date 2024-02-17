// src/services/WebSocketService.js

export default class WebSocketService {
      constructor() {
          this.webSocket = null;
      }
  
      connect(url) {
            this.webSocket = new WebSocket(url);
            this.webSocket.onopen = () => {
                console.log('WebSocket connection established.');
            };
  
          this.webSocket.onmessage = (message) => {
              console.log('Message from server ', message.data);
          };
  
          this.webSocket.onclose = () => {
              console.log('WebSocket connection closed.');
          };
  
          this.webSocket.onerror = (error) => {
              console.error('WebSocket error: ', error);
          };
      }
  
      sendMessage(message) {
            if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
                this.webSocket.send(JSON.stringify(message));
            } else {
                console.error("WebSocket is not open. Message not sent.");
            }
        }
  
      // Implement any additional functionality as needed
  }
  