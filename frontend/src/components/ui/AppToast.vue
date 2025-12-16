<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
        @click="removeToast(toast.id)"
      >
        <div class="toast-icon">
          <span v-if="toast.type === 'success'">✅</span>
          <span v-else-if="toast.type === 'error'">❌</span>
          <span v-else-if="toast.type === 'warning'">⚠️</span>
          <span v-else>ℹ️</span>
        </div>
        <div class="toast-content">
          <div class="toast-title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" @click.stop="removeToast(toast.id)">
          ×
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

const showToast = (type, title, message, duration = 5000) => {
  const id = ++toastId
  toasts.value.push({
    id,
    type,
    title,
    message,
    duration
  })
  
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

// Экспортируем функцию для глобального использования
if (typeof window !== 'undefined') {
  window.showToast = showToast
}

defineExpose({ showToast })
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  display: flex;
  align-items: center;
  min-width: 300px;
  max-width: 400px;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease;
  backdrop-filter: blur(10px);
}

.toast:hover {
  transform: translateX(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
}

.toast-success {
  background: rgba(40, 167, 69, 0.95);
  color: white;
  border-left: 4px solid #28a745;
}

.toast-error {
  background: rgba(220, 53, 69, 0.95);
  color: white;
  border-left: 4px solid #dc3545;
}

.toast-warning {
  background: rgba(255, 193, 7, 0.95);
  color: #333;
  border-left: 4px solid #ffc107;
}

.toast-info {
  background: rgba(23, 162, 184, 0.95);
  color: white;
  border-left: 4px solid #17a2b8;
}

.toast-icon {
  font-size: 20px;
  margin-right: 15px;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 14px;
}

.toast-message {
  font-size: 13px;
  line-height: 1.4;
  word-break: break-word;
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .toast-container {
    left: 20px;
    right: 20px;
    top: 10px;
  }
  
  .toast {
    min-width: auto;
    max-width: 100%;
  }
}
</style>