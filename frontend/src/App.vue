<template>
  <div id="app">
    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition 
          :name="route.meta.transition || 'fade'"
          mode="out-in"
        >
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
    <AppToast />
  </div>
</template>

<script setup>
import { onMounted, onErrorCaptured } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppToast from '@/components/ui/AppToast.vue'

const authStore = useAuthStore()

// Загружаем информацию о пользователе при запуске
onMounted(() => {
  if (localStorage.getItem('jwt')) {
    authStore.fetchUser()
  }
})

// Глобальный обработчик ошибок
onErrorCaptured((error, instance, info) => {
  console.error('Global error:', error, info)
  
  // Показываем пользователю уведомление об ошибке
  if (window.showToast) {
    window.showToast('error', 'Ошибка', 'Произошла непредвиденная ошибка')
  }
  
  return false // Продолжаем распространение ошибки
})
</script>

<style>
/* Глобальные стили */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #17a2b8;
  --light-color: #f8f9fa;
  --dark-color: #343a40;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px 0;
}

/* Анимации переходов */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Утилитарные классы */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}

.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 1rem; }
.mt-4 { margin-top: 1.5rem; }
.mt-5 { margin-top: 3rem; }

.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.mb-5 { margin-bottom: 3rem; }

.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 1rem; }
.p-4 { padding: 1.5rem; }
.p-5 { padding: 3rem; }

/* Стили для выделения кода */
pre, code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  background: #f6f8fa;
  border-radius: 3px;
}

pre {
  padding: 16px;
  overflow: auto;
  line-height: 1.45;
}

code {
  padding: 0.2em 0.4em;
  font-size: 85%;
}

/* Стили для таблиц */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
}

/* Стили для списков */
ul, ol {
  padding-left: 2rem;
  margin: 1rem 0;
}

li {
  margin-bottom: 0.5rem;
}

/* Стили для изображений */
img {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}

/* Стили для ссылок */
a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: #0056b3;
  text-decoration: underline;
}

/* Стили для кнопок */
button {
  cursor: pointer;
  font-family: inherit;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

/* Стили для форм */
input, textarea, select {
  font-family: inherit;
  font-size: inherit;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

/* Адаптивные стили */
@media (max-width: 768px) {
  .main-content {
    padding: 10px 0;
  }
  
  .container {
    padding: 0 15px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }
}
</style>