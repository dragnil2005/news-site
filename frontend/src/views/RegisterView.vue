<template>
  <div class="auth-view">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Создать аккаунт</h2>
          <p>Зарегистрируйтесь для доступа ко всем возможностям</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="username">Имя пользователя *</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              :class="['form-control', { 'is-invalid': errors.username }]"
              placeholder="Придумайте имя пользователя"
              required
            />
            <div v-if="errors.username" class="invalid-feedback">
              {{ errors.username }}
            </div>
            <small class="form-text">От 3 до 20 символов, только буквы и цифры</small>
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              :class="['form-control', { 'is-invalid': errors.email }]"
              placeholder="Введите ваш email"
              required
            />
            <div v-if="errors.email" class="invalid-feedback">
              {{ errors.email }}
            </div>
          </div>

          <div class="form-group">
            <label for="password">Пароль *</label>
            <div class="password-input">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                :class="['form-control', { 'is-invalid': errors.password }]"
                placeholder="Придумайте пароль"
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
            <small class="form-text">Минимум 6 символов</small>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Подтвердите пароль *</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              :class="['form-control', { 'is-invalid': errors.confirmPassword }]"
              placeholder="Повторите пароль"
              required
            />
            <div v-if="errors.confirmPassword" class="invalid-feedback">
              {{ errors.confirmPassword }}
            </div>
          </div>

          <div class="form-group terms">
            <label class="checkbox-label">
              <input 
                v-model="form.acceptTerms" 
                type="checkbox" 
                required
              />
              <span>Я согласен с 
                <a href="#" @click.prevent="showTerms">Условиями использования</a> 
                и 
                <a href="#" @click.prevent="showPrivacy">Политикой конфиденциальности</a>
              </span>
            </label>
            <div v-if="errors.acceptTerms" class="invalid-feedback">
              {{ errors.acceptTerms }}
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-block"
            :disabled="authStore.isLoading"
          >
            <span v-if="authStore.isLoading" class="spinner"></span>
            <span v-else>Зарегистрироваться</span>
          </button>

          <div v-if="authStore.error" class="alert alert-danger">
            {{ authStore.error }}
          </div>

          <div class="auth-divider">
            <span>Уже есть аккаунт?</span>
          </div>

          <div class="auth-links">
            <router-link to="/login" class="auth-link">
              Войти в существующий аккаунт
            </router-link>
            <router-link to="/" class="auth-link">
              Вернуться на главную
            </router-link>
          </div>
        </form>
      </div>

      <div class="auth-info">
        <h3>Почему стоит зарегистрироваться?</h3>
        <ul>
          <li>📝 Станьте автором и публикуйте свои статьи</li>
          <li>💬 Оставляйте комментарии к статьям</li>
          <li>⭐ Добавляйте статьи в избранное</li>
          <li>🔔 Получайте уведомления о новых публикациях</li>
          <li>📊 Отслеживайте статистику ваших статей</li>
          <li>🎯 Персонализированные рекомендации</li>
          <li>🏆 Участвуйте в рейтинге авторов</li>
          <li>📱 Доступ с любых устройств</li>
        </ul>
        
        <div class="security-info">
          <h4>🔒 Безопасность данных</h4>
          <p>Мы шифруем и защищаем ваши данные. Ваш пароль хранится в зашифрованном виде.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: ''
})

const showPassword = ref(false)

const validateForm = () => {
  let isValid = true
  
  // Сброс ошибок
  Object.keys(errors).forEach(key => errors[key] = '')
  
  // Валидация имени пользователя
  if (!form.username.trim()) {
    errors.username = 'Введите имя пользователя'
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = 'Имя пользователя должно быть не менее 3 символов'
    isValid = false
  } else if (form.username.length > 20) {
    errors.username = 'Имя пользователя должно быть не более 20 символов'
    isValid = false
  } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    errors.username = 'Только буквы, цифры и подчеркивания'
    isValid = false
  }
  
  // Валидация email
  if (!form.email.trim()) {
    errors.email = 'Введите email'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Введите корректный email'
    isValid = false
  }
  
  // Валидация пароля
  if (!form.password) {
    errors.password = 'Введите пароль'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Пароль должен содержать минимум 6 символов'
    isValid = false
  }
  
  // Подтверждение пароля
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Подтвердите пароль'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают'
    isValid = false
  }
  
  // Принятие условий
  if (!form.acceptTerms) {
    errors.acceptTerms = 'Необходимо принять условия использования'
    isValid = false
  }
  
  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  try {
    await authStore.register({
      username: form.username,
      email: form.email,
      password: form.password
    })
    
    // Перенаправляем на главную страницу
    router.push('/')
    
  } catch (error) {
    // Ошибка уже обработана в store
  }
}

const showTerms = () => {
  alert('Условия использования:\n\n1. Пользователь обязуется соблюдать правила сообщества\n2. Запрещена публикация незаконного контента\n3. Администрация оставляет за собой право удалять материалы\n4. Все публикации проходят модерацию')
}

const showPrivacy = () => {
  alert('Политика конфиденциальности:\n\n1. Мы защищаем ваши персональные данные\n2. Email используется только для уведомлений\n3. Мы не передаем данные третьим лицам\n4. Вы можете удалить аккаунт в любой момент')
}

const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 6) strength += 1
  if (password.length >= 8) strength += 1
  if (/[A-Z]/.test(password)) strength += 1
  if (/[0-9]/.test(password)) strength += 1
  if (/[^A-Za-z0-9]/.test(password)) strength += 1
  
  return strength
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return 'Слабый'
  if (strength <= 3) return 'Средний'
  return 'Сильный'
})

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return '#dc3545'
  if (strength <= 3) return '#ffc107'
  return '#28a745'
})
</script>

<style scoped>
.auth-view {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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

.form-text {
  display: block;
  margin-top: 5px;
  color: #6c757d;
  font-size: 12px;
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

.password-strength {
  margin-top: 5px;
  font-size: 12px;
}

.strength-bar {
  height: 5px;
  background: #e9ecef;
  border-radius: 3px;
  margin-top: 5px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.terms {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.terms a {
  color: #007bff;
  text-decoration: none;
}

.terms a:hover {
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
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
  margin-bottom: 30px;
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

.security-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.security-info h4 {
  margin-bottom: 10px;
  color: white;
}

.security-info p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.4;
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