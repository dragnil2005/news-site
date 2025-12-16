<template>
  <div class="contact-view">
    <div class="container">
      <!-- Заголовок -->
      <div class="contact-header">
        <h1>📞 Контакты</h1>
        <p>Свяжитесь с нами если у вас есть вопросы, предложения или нужна помощь</p>
      </div>

      <div class="contact-content">
        <!-- Контактная информация -->
        <div class="contact-info-section">
          <div class="contact-info-grid">
            <div class="contact-card">
              <div class="contact-icon">📧</div>
              <h3>Email</h3>
              <p>Основной канал связи для общих вопросов</p>
              <a href="mailto:info@newsportal.ru" class="contact-link">
                info@newsportal.ru
              </a>
              <p class="response-time">Ответ в течение 24 часов</p>
            </div>

            <div class="contact-card">
              <div class="contact-icon">🆘</div>
              <h3>Техническая поддержка</h3>
              <p>Помощь с техническими проблемами и багами</p>
              <a href="mailto:support@newsportal.ru" class="contact-link">
                support@newsportal.ru
              </a>
              <p class="response-time">Ответ в течение 12 часов</p>
            </div>

            <div class="contact-card">
              <div class="contact-icon">💼</div>
              <h3>Сотрудничество</h3>
              <p>Предложения по партнерству и рекламе</p>
              <a href="mailto:partners@newsportal.ru" class="contact-link">
                partners@newsportal.ru
              </a>
              <p class="response-time">Ответ в течение 48 часов</p>
            </div>

            <div class="contact-card">
              <div class="contact-icon">👨‍💻</div>
              <h3>Для разработчиков</h3>
              <p>API документация и вопросы разработки</p>
              <a href="mailto:dev@newsportal.ru" class="contact-link">
                dev@newsportal.ru
              </a>
              <p class="response-time">Ответ в течение 24 часов</p>
            </div>
          </div>
        </div>

        <!-- Форма обратной связи -->
        <div class="contact-form-section">
          <h2>✍️ Форма обратной связи</h2>
          <p class="form-description">
            Заполните форму ниже и мы обязательно ответим вам в ближайшее время
          </p>

          <form @submit.prevent="submitForm" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Ваше имя *</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  :class="['form-control', { 'is-invalid': errors.name }]"
                  placeholder="Введите ваше имя"
                  required
                />
                <div v-if="errors.name" class="invalid-feedback">
                  {{ errors.name }}
                </div>
              </div>

              <div class="form-group">
                <label for="email">Email адрес *</label>
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
            </div>

            <div class="form-group">
              <label for="subject">Тема сообщения *</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                :class="['form-control', { 'is-invalid': errors.subject }]"
                placeholder="Введите тему сообщения"
                required
              />
              <div v-if="errors.subject" class="invalid-feedback">
                {{ errors.subject }}
              </div>
            </div>

            <div class="form-group">
              <label for="category">Категория обращения *</label>
              <select
                id="category"
                v-model="form.category"
                :class="['form-control', { 'is-invalid': errors.category }]"
                required
              >
                <option value="">Выберите категорию</option>
                <option value="technical">Техническая поддержка</option>
                <option value="general">Общие вопросы</option>
                <option value="feedback">Обратная связь</option>
                <option value="bug">Сообщить об ошибке</option>
                <option value="suggestion">Предложение по улучшению</option>
                <option value="partnership">Сотрудничество</option>
                <option value="other">Другое</option>
              </select>
              <div v-if="errors.category" class="invalid-feedback">
                {{ errors.category }}
              </div>
            </div>

            <div class="form-group">
              <label for="message">Сообщение *</label>
              <textarea
                id="message"
                v-model="form.message"
                :class="['form-control', { 'is-invalid': errors.message }]"
                placeholder="Опишите ваш вопрос или предложение..."
                rows="6"
                required
              ></textarea>
              <div v-if="errors.message" class="invalid-feedback">
                {{ errors.message }}
              </div>
              <div class="char-counter">
                {{ form.message.length }}/1000 символов
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                  v-model="form.consent"
                  type="checkbox"
                  required
                />
                <span>Я согласен на обработку персональных данных *</span>
              </label>
              <div v-if="errors.consent" class="invalid-feedback">
                {{ errors.consent }}
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                  v-model="form.copyToEmail"
                  type="checkbox"
                />
                <span>Отправить копию сообщения на мою почту</span>
              </label>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary btn-lg"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting" class="spinner"></span>
                <span v-else>📨 Отправить сообщение</span>
              </button>
              <button 
                type="button" 
                @click="resetForm"
                class="btn btn-outline"
              >
                Очистить форму
              </button>
            </div>

            <div v-if="submitSuccess" class="success-message">
              <div class="success-icon">✅</div>
              <h3>Сообщение отправлено!</h3>
              <p>Мы получили ваше сообщение и ответим вам в ближайшее время.</p>
              <p>Номер вашего обращения: <strong>#{{ ticketNumber }}</strong></p>
            </div>

            <div v-if="submitError" class="error-message">
              <div class="error-icon">❌</div>
              <h3>Ошибка отправки</h3>
              <p>{{ submitError }}</p>
              <button @click="submitError = ''" class="btn btn-outline">
                Попробовать снова
              </button>
            </div>
          </form>
        </div>

        <!-- Часто задаваемые вопросы -->
        <div class="faq-section">
          <h2>❓ Часто задаваемые вопросы</h2>
          <div class="faq-list">
            <div 
              v-for="(faq, index) in faqs" 
              :key="index"
              class="faq-item"
              :class="{ open: openFaq === index }"
            >
              <div class="faq-question" @click="toggleFaq(index)">
                <h3>{{ faq.question }}</h3>
                <span class="faq-toggle">{{ openFaq === index ? '−' : '+' }}</span>
              </div>
              <div class="faq-answer" v-if="openFaq === index">
                <p>{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Контактные данные -->
        <div class="contact-details-section">
          <h2>📍 Контактные данные</h2>
          <div class="details-grid">
            <div class="detail-card">
              <div class="detail-icon">🏢</div>
              <div class="detail-content">
                <h3>Юридический адрес</h3>
                <p>г. Москва, ул. Примерная, д. 1, офис 101</p>
                <p>Индекс: 123456</p>
              </div>
            </div>

            <div class="detail-card">
              <div class="detail-icon">📞</div>
              <div class="detail-content">
                <h3>Телефоны</h3>
                <p>Общий: <a href="tel:+79991234567">+7 (999) 123-45-67</a></p>
                <p>Техподдержка: <a href="tel:+79991234568">+7 (999) 123-45-68</a></p>
              </div>
            </div>

            <div class="detail-card">
              <div class="detail-icon">⏰</div>
              <div class="detail-content">
                <h3>Часы работы</h3>
                <p>Понедельник - Пятница: 9:00 - 18:00</p>
                <p>Суббота: 10:00 - 16:00</p>
                <p>Воскресенье: выходной</p>
              </div>
            </div>

            <div class="detail-card">
              <div class="detail-icon">🌐</div>
              <div class="detail-content">
                <h3>Социальные сети</h3>
                <div class="social-links">
                  <a href="#" class="social-link" title="Telegram">
                    <span class="social-icon">✈️</span> Telegram
                  </a>
                  <a href="#" class="social-link" title="VK">
                    <span class="social-icon">👥</span> VK
                  </a>
                  <a href="#" class="social-link" title="GitHub">
                    <span class="social-icon">🐙</span> GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Карта -->
        <div class="map-section">
          <h2>🗺️ Как нас найти</h2>
          <div class="map-container">
            <div class="map-placeholder">
              <div class="map-content">
                <div class="map-marker">📍</div>
                <div class="map-info">
                  <h3>Мы находимся здесь</h3>
                  <p>г. Москва, ул. Примерная, д. 1</p>
                  <p>Ближайшее метро: "Примерная"</p>
                  <button class="btn btn-outline">
                    📍 Показать на карте
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// Состояния формы
const form = reactive({
  name: '',
  email: '',
  subject: '',
  category: '',
  message: '',
  consent: false,
  copyToEmail: false
})

const errors = reactive({})
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')
const openFaq = ref(0)
const ticketNumber = ref(Math.floor(100000 + Math.random() * 900000))

// Часто задаваемые вопросы
const faqs = ref([
  {
    question: 'Как зарегистрироваться на сайте?',
    answer: 'Нажмите кнопку "Регистрация" в правом верхнем углу сайта, заполните форму и подтвердите email.'
  },
  {
    question: 'Как восстановить доступ к аккаунту?',
    answer: 'На странице входа нажмите "Забыли пароль?", введите ваш email и следуйте инструкциям в письме.'
  },
  {
    question: 'Как опубликовать статью?',
    answer: 'После регистрации и входа перейдите в раздел "Редактор", заполните форму статьи и нажмите "Опубликовать".'
  },
  {
    question: 'Почему мою статью не публикуют?',
    answer: 'Все статьи проходят модерацию. Проверьте, соответствует ли ваша статья правилам публикации.'
  },
  {
    question: 'Как связаться с администрацией?',
    answer: 'Используйте форму обратной связи на этой странице или напишите на info@newsportal.ru.'
  },
  {
    question: 'Есть ли API для разработчиков?',
    answer: 'Да, доступно REST API. Документация доступна после авторизации в разделе "Для разработчиков".'
  }
])

// Валидация формы
const validateForm = () => {
  let isValid = true
  
  // Сброс ошибок
  Object.keys(errors).forEach(key => errors[key] = '')
  
  // Валидация имени
  if (!form.name.trim()) {
    errors.name = 'Введите ваше имя'
    isValid = false
  } else if (form.name.length < 2) {
    errors.name = 'Имя должно содержать минимум 2 символа'
    isValid = false
  }
  
  // Валидация email
  if (!form.email.trim()) {
    errors.email = 'Введите email адрес'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Введите корректный email адрес'
    isValid = false
  }
  
  // Валидация темы
  if (!form.subject.trim()) {
    errors.subject = 'Введите тему сообщения'
    isValid = false
  } else if (form.subject.length < 5) {
    errors.subject = 'Тема должна содержать минимум 5 символов'
    isValid = false
  }
  
  // Валидация категории
  if (!form.category) {
    errors.category = 'Выберите категорию обращения'
    isValid = false
  }
  
  // Валидация сообщения
  if (!form.message.trim()) {
    errors.message = 'Введите текст сообщения'
    isValid = false
  } else if (form.message.length < 10) {
    errors.message = 'Сообщение должно содержать минимум 10 символов'
    isValid = false
  } else if (form.message.length > 1000) {
    errors.message = 'Сообщение не должно превышать 1000 символов'
    isValid = false
  }
  
  // Валидация согласия
  if (!form.consent) {
    errors.consent = 'Необходимо согласие на обработку данных'
    isValid = false
  }
  
  return isValid
}

// Отправка формы
const submitForm = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  submitError.value = ''
  
  try {
    // Имитация отправки на сервер
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Успешная отправка
    submitSuccess.value = true
    
    // Генерация нового номера обращения
    ticketNumber.value = Math.floor(100000 + Math.random() * 900000)
    
    // Сброс формы
    if (!form.copyToEmail) {
      resetForm()
    }
    
    // Показываем уведомление
    if (window.showToast) {
      window.showToast('success', 'Сообщение отправлено', `Ваше обращение #${ticketNumber.value} успешно отправлено`)
    }
    
  } catch (error) {
    submitError.value = 'Произошла ошибка при отправке сообщения. Попробуйте еще раз.'
    
    if (window.showToast) {
      window.showToast('error', 'Ошибка отправки', 'Не удалось отправить сообщение')
    }
    
  } finally {
    isSubmitting.value = false
  }
}

// Сброс формы
const resetForm = () => {
  Object.assign(form, {
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    consent: false,
    copyToEmail: false
  })
  
  Object.keys(errors).forEach(key => errors[key] = '')
  submitSuccess.value = false
  submitError.value = ''
}

// Управление FAQ
const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? -1 : index
}
</script>

<style scoped>
.contact-view {
  padding: 40px 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.contact-header {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.contact-header h1 {
  color: #333;
  margin-bottom: 15px;
  font-size: 2.8rem;
}

.contact-header p {
  color: #666;
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
}

.contact-content {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

/* Контактная информация */
.contact-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.contact-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.contact-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  border-color: #007bff;
}

.contact-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.contact-card h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.contact-card p {
  color: #666;
  margin-bottom: 20px;
  font-size: 0.95rem;
  line-height: 1.5;
}

.contact-link {
  display: block;
  color: #007bff;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 10px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.contact-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.response-time {
  color: #28a745;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Форма обратной связи */
.contact-form-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.contact-form-section h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 2rem;
}

.form-description {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.form-control {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.is-invalid {
  border-color: #dc3545;
}

.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.invalid-feedback {
  color: #dc3545;
  font-size: 13px;
  margin-top: 5px;
}

.char-counter {
  text-align: right;
  color: #666;
  font-size: 13px;
  margin-top: 5px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.form-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-lg {
  padding: 16px 32px;
  font-size: 17px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-outline {
  background: white;
  color: #007bff;
  border-color: #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
}

.spinner {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-message {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 10px;
  padding: 25px;
  margin-top: 20px;
  text-align: center;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.success-message h3 {
  color: #155724;
  margin-bottom: 10px;
}

.success-message p {
  color: #155724;
  margin-bottom: 10px;
}

.error-message {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 10px;
  padding: 25px;
  margin-top: 20px;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.error-message h3 {
  color: #721c24;
  margin-bottom: 10px;
}

.error-message p {
  color: #721c24;
  margin-bottom: 15px;
}

/* FAQ секция */
.faq-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.faq-section h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.faq-item {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item.open {
  border-color: #007bff;
  box-shadow: 0 5px 20px rgba(0, 123, 255, 0.1);
}

.faq-question {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: #f8f9fa;
  transition: background 0.3s ease;
}

.faq-item.open .faq-question {
  background: #e3f2fd;
}

.faq-question h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 500;
}

.faq-toggle {
  font-size: 1.5rem;
  color: #666;
  font-weight: 300;
  transition: transform 0.3s ease;
}

.faq-item.open .faq-toggle {
  color: #007bff;
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 20px 20px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.faq-answer p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Контактные данные */
.contact-details-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.contact-details-section h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.detail-card {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 15px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.detail-card:hover {
  border-color: #007bff;
  background: #e3f2fd;
  transform: translateY(-5px);
}

.detail-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  flex-shrink: 0;
}

.detail-content h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.detail-content p {
  color: #666;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.detail-content a {
  color: #007bff;
  text-decoration: none;
}

.detail-content a:hover {
  text-decoration: underline;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #007bff;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.social-link:hover {
  background: white;
  border-color: #e9ecef;
  color: #0056b3;
}

.social-icon {
  font-size: 1.2rem;
}

/* Карта */
.map-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.map-section h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
}

.map-container {
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.map-placeholder {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.map-content {
  text-align: center;
  color: white;
  padding: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.map-marker {
  font-size: 3rem;
  margin-bottom: 15px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.map-info h3 {
  color: white;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.map-info p {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 15px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .contact-header {
    padding: 30px 20px;
  }
  
  .contact-header h1 {
    font-size: 2.2rem;
  }
  
  .contact-form-section,
  .faq-section,
  .contact-details-section,
  .map-section {
    padding: 30px 20px;
  }
  
  .contact-info-grid,
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .contact-view {
    padding: 20px 0;
  }
  
  .contact-header h1 {
    font-size: 1.8rem;
  }
  
  .contact-header p {
    font-size: 1rem;
  }
  
  .contact-card,
  .detail-card {
    padding: 20px;
  }
}
</style>