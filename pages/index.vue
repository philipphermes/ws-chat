<script setup lang="ts">
import {useWebSocket} from "@vueuse/core";

const messages = ref([]);
const chatName = ref('');
const chatInput = ref('');

const { status, data, send, open, close, ws } = useWebSocket('http://localhost:3000/_ws', {
  autoReconnect: {
    retries: 3,
    delay: 1000,
    onFailed() {
      alert('Failed to connect WebSocket after 3 retries')
    },
  },
  heartbeat: {
    message: 'ping',
    interval: 10000,
    pongTimeout: 1000,
  },
  onMessage(ws, event) {
      const message = JSON.parse(event.data);
      if (message.type === 'heartbeat') return;
      messages.value.push(message);
  },
})

function sendMessage() {
  send(JSON.stringify({
    "type": "message",
    "content": chatInput.value,
    "user": chatName.value
  }));
}
</script>
<template>
  <input type="text" v-model="chatName" :ref="chatName" placeholder="Username">
  <input type="text" v-model="chatInput" :ref="chatInput" placeholder="Your message...">
  <button @click="sendMessage">Send message</button>
  <p>Status: {{ status }}</p>
  <ul>
    <li v-for="message in messages">{{ message.user }}: {{ message.content }}</li>
  </ul>
</template>