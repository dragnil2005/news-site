<template>
  <div 
    :class="['alert', `alert-${type}`, { 'alert-dismissible': dismissible }]"
    role="alert"
  >
    <div class="alert-content">
      <div v-if="showIcon" class="alert-icon">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'error'">✗</span>
        <span v-else-if="type === 'warning'">⚠</span>
        <span v-else>ℹ</span>
      </div>
      
      <div class="alert-body">
        <h4 v-if="title" class="alert-title">{{ title }}</h4>
        <div class="alert-message">
          <slot></slot>
        </div>
      </div>
      
      <button 
        v-if="dismissible" 
        type="button" 
        class="alert-close"
        @click="$emit('close')"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  dismissible: {
    type: Boolean,
    default: false
  },
  showIcon: {
    type: Boolean,
    default: true
  }
})

defineEmits(['close'])
</script>

<style scoped>
.alert {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid transparent;
  animation: slideIn 0.3s ease;
}

.alert-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.alert-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.alert-body {
  flex: 1;
}

.alert-title {
  margin: 0 0 5px;
  font-weight: 600;
}

.alert-message {
  line-height: 1.5;
}

.alert-close {
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  flex-shrink: 0;
}

.alert-close:hover {
  opacity: 1;
}

/* Alert Types */
.alert-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.alert-success .alert-icon {
  color: #28a745;
}

.alert-error {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.alert-error .alert-icon {
  color: #dc3545;
}

.alert-warning {
  background-color: #fff3cd;
  border-color: #ffeaa7;
  color: #856404;
}

.alert-warning .alert-icon {
  color: #ffc107;
}

.alert-info {
  background-color: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
}

.alert-info .alert-icon {
  color: #17a2b8;
}

/* Animation */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>