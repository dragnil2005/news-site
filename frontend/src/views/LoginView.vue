<template>
  <div class="auth-view">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Вход в систему</h2>
          <p>Введите свои учетные данные для доступа к аккаунту</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="identifier">Email или имя пользователя</label>
            <input
              id="identifier"
              v-model="form.identifier"
              type="text"
              :class="['form-control', { 'is-invalid': errors.identifier }]"
              placeholder="Введите email или имя пользователя"
              required
            />
            <div v-if="errors.identifier" class="invalid-feedback">
              {{ errors.identifier }}
            </div>
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>
            <div class="password-input">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                :class="['form-control', { 'is-invalid': errors.password }]"
                placeholder="Введите пароль"
                required
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div v-if="errors.password" class="invalid-feedback">
              {{ errors.password }}
            </div>
          </div>

          <div class="form-group remember-forgot">
            <label class="checkbox-label">
              <input v-model="form.remember" type="checkbox" />
              <span>Запомнить меня</span>
            </label>
            <router-link to="/forgot-password" class="forgot-link">
              Забыли пароль?
            </router-link>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-block"
            :disabled="authStore.isLoading"
          >
            <span v-if="authStore.isLoading" class="spinner"></span>
            <span v-else>Войти</span>
          </button>

          <div v-if="authStore.error" class="alert alert-danger">
            {{ authStore.error }}
          </div>

          <div class="auth-divider">
            <span>Или</span>
          </div>

          <div class="auth-links">
            <router-link to="/register" class="auth-link">
              Создать новый аккаунт
            </router-link>
            <router-link to="/" class="auth-link">
              Вернуться на главную
            </router-link>
          </div>
        </form>
      </div>

      <div class="auth-info">
        <h3>Возможности для зарегистрированных пользователей:</h3>
        <ul>
          <li>👤 Создание собственных статей (для авторов)</li>
          <li>✏️ Редактирование своих материалов</li>
          <li>📊 Отслеживание статистики просмотров</li>
          <li>💾 Сохранение избранных статей</li>
          <li>🔔 Уведомления о новых публикациях</li>
          <li>👥 Комментирование статей</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  identifier: '',
  password: '',
  remember: false
})

const errors = reactive({
  identifier: '',
  password: ''
})

const showPassword = ref(false)

const validateForm = () => {
  let isValid = true
  errors.identifier = ''
  errors.password = ''

  if (!form.identifier.trim()) {
    errors.identifier = 'Введите email или имя пользователя'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Введите пароль'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Пароль должен содержать минимум 6 символов'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  try {
    await authStore.login(form.identifier, form.password)
    
    if (form.remember) {
      localStorage.setItem('rememberMe', 'true')
    }
    
    // Проверяем роль и перенаправляем
    if (authStore.isEditor || authStore.isAdmin) {
      router.push('/editor')
    } else {
      router.push('/')
    }
  } catch (error) {
    // Ошибка уже обработана в store
  }
}

const clearErrors = () => {
  authStore.clearError()
}

onMounted(() => {
  // Проверяем, был ли пользователь уже авторизован
  if (authStore.isAuthenticated) {
    router.push('/')
  }
  
  // Восстанавливаем данные из localStorage
  if (localStorage.getItem('rememberMe') === 'true') {
    const savedEmail = localStorage.getItem('savedEmail')
    if (savedEmail) {
      form.identifier = savedEmail
    }
  }
})
</script>

<style scoped>
.auth-view {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-container {
  display: flex;
  max-width: 1000px;
  width: 100%;
  gap: 40px;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.auth-card {
  flex: 1;
  padding: 40px;
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 2rem;
}

.auth-header p {
  color: #666;
  font-size: 1.1rem;
}

.auth-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
}

.is-invalid {
  border-color: #dc3545 !important;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.forgot-link {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}

.forgot-link:hover {
  text-decoration: underline;
}

.btn-block {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  margin-bottom: 20px;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.alert {
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.auth-divider {
  display: flex;
  align-items: center;
  margin: 25px 0;
  color: #666;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #ddd;
}

.auth-divider span {
  padding: 0 15px;
  font-size: 14px;
}

.auth-links {
  text-align: center;
}

.auth-link {
  display: block;
  color: #007bff;
  text-decoration: none;
  padding: 10px;
  border-radius: 4px;
  margin: 5px 0;
  transition: all 0.3s ease;
}

.auth-link:hover {
  background-color: #f8f9fa;
  text-decoration: underline;
}

.auth-info {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-info h3 {
  font-size: 1.5rem;
  margin-bottom: 25px;
  color: white;
}

.auth-info ul {
  list-style: none;
  padding: 0;
}

.auth-info li {
  margin-bottom: 12px;
  font-size: 1.1rem;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.auth-info li::before {
  content: '✓';
  font-weight: bold;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
  }
  
  .auth-info {
    order: -1;
  }
}
</style>