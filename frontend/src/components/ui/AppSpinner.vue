<template>
  <div :class="['spinner', sizeClass, colorClass]" :style="customStyle">
    <div class="spinner-inner"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: 'primary'
  },
  customColor: {
    type: String,
    default: ''
  }
})

const sizeClass = computed(() => `spinner-${props.size}`)
const colorClass = computed(() => {
  if (props.customColor) return ''
  return `spinner-${props.color}`
})

const customStyle = computed(() => {
  if (props.customColor) {
    return {
      borderColor: `${props.customColor} transparent transparent transparent`
    }
  }
  return {}
})
</script>

<style scoped>
.spinner {
  display: inline-block;
  position: relative;
}

.spinner-inner {
  box-sizing: border-box;
  display: block;
  position: absolute;
  border-radius: 50%;
  animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border: 4px solid;
}

/* Sizes */
.spinner-small {
  width: 20px;
  height: 20px;
}

.spinner-medium {
  width: 40px;
  height: 40px;
}

.spinner-large {
  width: 60px;
  height: 60px;
}

.spinner-small .spinner-inner {
  border-width: 2px;
}

.spinner-medium .spinner-inner {
  border-width: 4px;
}

.spinner-large .spinner-inner {
  border-width: 6px;
}

/* Colors */
.spinner-primary .spinner-inner {
  border-color: #007bff transparent transparent transparent;
}

.spinner-secondary .spinner-inner {
  border-color: #6c757d transparent transparent transparent;
}

.spinner-success .spinner-inner {
  border-color: #28a745 transparent transparent transparent;
}

.spinner-danger .spinner-inner {
  border-color: #dc3545 transparent transparent transparent;
}

.spinner-warning .spinner-inner {
  border-color: #ffc107 transparent transparent transparent;
}

.spinner-info .spinner-inner {
  border-color: #17a2b8 transparent transparent transparent;
}

.spinner-light .spinner-inner {
  border-color: #f8f9fa transparent transparent transparent;
}

.spinner-dark .spinner-inner {
  border-color: #343a40 transparent transparent transparent;
}

/* Animation */
@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>