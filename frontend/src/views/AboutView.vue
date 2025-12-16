<template>
  <div class="about-view">
    <div class="container">
      <!-- Герой-секция -->
      <section class="hero-section">
        <div class="hero-content">
          <h1>О проекте</h1>
          <p class="hero-subtitle">Новостной портал - курсовой проект по Node.js</p>
          <p class="hero-description">
            Современная система управления контентом для публикации новостей и статей с 
            полноценной системой авторизации, ролями пользователей и расширенным функционалом.
          </p>
        </div>
        <div class="hero-image">
          <div class="image-placeholder">📰</div>
        </div>
      </section>

      <!-- Цели проекта -->
      <section class="goals-section">
        <h2>Цели проекта</h2>
        <div class="goals-grid">
          <div class="goal-card">
            <div class="goal-icon">🎯</div>
            <h3>Образовательная</h3>
            <p>Демонстрация навыков full-stack разработки на стеке Node.js + Vue.js</p>
          </div>
          <div class="goal-card">
            <div class="goal-icon">💡</div>
            <h3>Практическая</h3>
            <p>Создание реального работающего приложения с полным циклом разработки</p>
          </div>
          <div class="goal-card">
            <div class="goal-icon">🚀</div>
            <h3>Технологическая</h3>
            <p>Освоение современных технологий: Strapi, Vue 3, Pinia, Docker, REST API</p>
          </div>
        </div>
      </section>

      <!-- Технологический стек -->
      <section class="tech-stack-section">
        <h2>Технологический стек</h2>
        <div class="tech-tabs">
          <button 
            v-for="tab in techTabs" 
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <div class="tech-content">
          <!-- Backend -->
          <div v-if="activeTab === 'backend'" class="tech-grid">
            <div class="tech-card">
              <div class="tech-logo">🟢</div>
              <div class="tech-info">
                <h4>Node.js</h4>
                <p>Среда выполнения JavaScript на стороне сервера</p>
                <span class="tech-version">v18+</span>
              </div>
            </div>
            <div class="tech-card">
              <div class="tech-logo">⚡</div>
              <div class="tech-info">
                <h4>Strapi</h4>
                <p>Headless CMS с автоматической генерацией API</p>
                <span class="tech-version">v4+</span>
              </div>
            </div>
            <div class="tech-card">
              <div class="tech-logo">🐘</div>
              <div class="tech-info">
                <h4>PostgreSQL</h4>
                <p>Реляционная база данных для хранения контента</p>
                <span class="tech-version">v15+</span>
              </div>
            </div>
            <div class="tech-card">
              <div class="tech-logo">🔐</div>
              <div class="tech-info">
                <h4>JWT</h4>
                <p>JSON Web Tokens для аутентификации пользователей</p>
                <span class="tech-version">стандарт</span>
              </div>
            </div>
          </div>

          <!-- Frontend -->
          <div v-else-if="activeTab === 'frontend'" class="tech-grid">
            <div class="tech-card">
              <div class="tech-logo">🟢</div>
              <div class="tech-info">
                <h4>Vue.js 3</h4>
                <p>Прогрессивный JavaScript фреймворк</p>
                <span class="tech-version">v3.4+</span>
              </div>
            </div>
            <div class="tech-card">
              <div class="tech-logo">⚡</div>
              <div class="tech-info">
                <h4>Vite</h4>
                <p>Современный сборщик для быстрой разработки</p>
                <span class="tech-version">v5+</span>
              </div>
            </div>
            <div class="tech-card">
              <div class="tech-logo">📦</div>
              <div class="tech-info">
                <h4>Pinia</h4>
                <p>Управление состоянием приложения</p>
                <span class="tech-version">v2+</span>
              </div>
            </div>
            <div class="tech-card">
              <div class="tech-logo">🛣️</div>
              <div class="tech-info">
                <h4>Vue Router</h4>
                <p>Маршрутизация на стороне клиента</p>
                <span class="tech-version">v4+</span>
              </div>
            </div>
            <div class="tech-card">
              <div class="tech-logo">📡</div>
              <div class="tech-info">
                <h4>Axios</h4>
                <p>HTTP клиент для работы с API</p>
                <span class="tech-version">v1+</span>
              </div>
            </div>
            <div class="tech-card">
              <div class="tech-logo">📊</div>
              <div class="tech-info">
                <h4>Chart.js</h4>
                <p>Библиотека для построения графиков</p>
                <span class="tech-version">v4+</span>
              </div>
            </div>
          </div>

          <!-- DevOps -->
          <div v-else class="tech-grid">
            <div class="tech-card">
              <div class="tech-logo">🐳</div>
              <div class="tech-info">
                <h4>Docker</h4>
                <p>Контейнеризация приложения</p>
                <span class="tech-version">v24+</span>
              </div>
            </div>
            <div class="tech-card">
              <div class="tech-logo">🚢</div>
              <div class="tech-info">
                <h4>Docker Compose</h4>
                <p>Оркестрация многоконтейнерных приложений</p>
                <span class="tech-version">v2+</span>
              </div>
            </div>
            <div class="tech-card">
              <div class="tech-logo">🌐</div>
              <div class="tech-info">
                <h4>Nginx</h4>
                <p>Веб-сервер и обратный прокси</p>
                <span class="tech-version">v1.24+</span>
              </div>
            </div>
            <div class="tech-card">
              <div class="tech-logo">🔧</div>
              <div class="tech-info">
                <h4>ESLint + Prettier</h4>
                <p>Линтинг и форматирование кода</p>
                <span class="tech-version">последние</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Функциональность -->
      <section class="features-section">
        <h2>Ключевые возможности</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>Ролевая модель</h3>
            <ul>
              <li>Гость - чтение статей</li>
              <li>Пользователь - создание статей</li>
              <li>Редактор - управление контентом</li>
              <li>Администратор - полный доступ</li>
            </ul>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>Управление контентом</h3>
            <ul>
              <li>Создание и редактирование статей</li>
              <li>Загрузка изображений</li>
              <li>Категории и теги</li>
              <li>SEO оптимизация</li>
              <li>Черновики и публикация</li>
            </ul>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Поиск и фильтрация</h3>
            <ul>
              <li>Полнотекстовый поиск</li>
              <li>Фильтрация по категориям</li>
              <li>Сортировка по дате/популярности</li>
              <li>Пагинация</li>
              <li>Расширенные фильтры</li>
            </ul>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Аналитика</h3>
            <ul>
              <li>Статистика просмотров</li>
              <li>Время чтения статей</li>
              <li>Рейтинг популярности</li>
              <li>Аудит действий</li>
              <li>Графики и отчеты</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Архитектура -->
      <section class="architecture-section">
        <h2>Архитектура проекта</h2>
        <div class="architecture-diagram">
          <div class="layer">
            <div class="layer-title">Клиент (Frontend)</div>
            <div class="layer-items">
              <div class="layer-item">Vue.js 3</div>
              <div class="layer-item">Vite</div>
              <div class="layer-item">Pinia</div>
              <div class="layer-item">Vue Router</div>
            </div>
          </div>
          
          <div class="layer-arrow">↓</div>
          
          <div class="layer">
            <div class="layer-title">API Gateway</div>
            <div class="layer-items">
              <div class="layer-item">Nginx</div>
              <div class="layer-item">CORS</div>
              <div class="layer-item">Rate Limiting</div>
            </div>
          </div>
          
          <div class="layer-arrow">↓</div>
          
          <div class="layer">
            <div class="layer-title">Бэкенд (Backend)</div>
            <div class="layer-items">
              <div class="layer-item">Strapi CMS</div>
              <div class="layer-item">REST API</div>
              <div class="layer-item">JWT Auth</div>
              <div class="layer-item">RBAC</div>
            </div>
          </div>
          
          <div class="layer-arrow">↓</div>
          
          <div class="layer">
            <div class="layer-title">База данных</div>
            <div class="layer-items">
              <div class="layer-item">PostgreSQL</div>
              <div class="layer-item">Миграции</div>
              <div class="layer-item">Репликация</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Для разработчиков -->
      <section class="developers-section">
        <h2>Для разработчиков</h2>
        <div class="dev-info">
          <div class="dev-card">
            <h3>Исходный код</h3>
            <p>Проект полностью открыт для изучения и модификации.</p>
            <div class="code-links">
              <a href="#" class="code-link">
                <span class="link-icon">🐙</span>
                GitHub Frontend
              </a>
              <a href="#" class="code-link">
                <span class="link-icon">⚙️</span>
                GitHub Backend
              </a>
            </div>
          </div>
          
          <div class="dev-card">
            <h3>Документация</h3>
            <p>Полная документация по API и настройке проекта.</p>
            <div class="doc-links">
              <a href="#" class="doc-link">📚 API Documentation</a>
              <a href="#" class="doc-link">🔧 Installation Guide</a>
              <a href="#" class="doc-link">🚀 Deployment Guide</a>
            </div>
          </div>
          
          <div class="dev-card">
            <h3>Лицензия</h3>
            <p>Проект распространяется под лицензией MIT.</p>
            <div class="license-info">
              <p>Разрешено: использование, копирование, модификация, распространение.</p>
              <p>Требуется: указание авторства.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Авторы -->
      <section class="authors-section">
        <h2>Авторы проекта</h2>
        <div class="authors-grid">
          <div class="author-card">
            <div class="author-avatar">👨‍💻</div>
            <div class="author-info">
              <h4>Студент ПОИТ</h4>
              <p class="author-role">Full-stack разработчик</p>
              <p class="author-bio">Разработка архитектуры, реализация frontend и backend.</p>
              <div class="author-skills">
                <span class="skill-tag">Vue.js</span>
                <span class="skill-tag">Node.js</span>
                <span class="skill-tag">Docker</span>
              </div>
            </div>
          </div>
          
          <div class="author-card">
            <div class="author-avatar">🎓</div>
            <div class="author-info">
              <h4>Учебное заведение</h4>
              <p class="author-role">Кафедра ПОИТ</p>
              <p class="author-bio">Курсовой проект по дисциплине "Back-end разработка на Node.js".</p>
              <div class="author-skills">
                <span class="skill-tag">Обучение</span>
                <span class="skill-tag">Менторство</span>
                <span class="skill-tag">Оценка</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="cta-content">
          <h2>Готовы начать использовать?</h2>
          <p>Зарегистрируйтесь и начните публиковать статьи прямо сейчас!</p>
          <div class="cta-buttons">
            <router-link to="/register" class="btn btn-primary btn-lg">
              Начать бесплатно
            </router-link>
            <router-link to="/" class="btn btn-outline btn-lg">
              Посмотреть демо
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('backend')
const techTabs = [
  { id: 'backend', label: 'Backend' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'devops', label: 'DevOps' }
]
</script>

<style scoped>
.about-view {
  padding: 40px 0 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Герой-секция */
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  margin-bottom: 80px;
  padding: 40px 0;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 20px;
  color: white;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-placeholder {
  font-size: 200px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

/* Секция целей */
.goals-section {
  margin-bottom: 80px;
}

.goals-section h2 {
  text-align: center;
  margin-bottom: 50px;
  color: white;
  font-size: 2.5rem;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.goal-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.goal-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.goal-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.goal-card h3 {
  color: white;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.goal-card p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

/* Технологический стек */
.tech-stack-section {
  margin-bottom: 80px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 40px;
}

.tech-stack-section h2 {
  text-align: center;
  margin-bottom: 40px;
  color: white;
  font-size: 2.5rem;
}

.tech-tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 40px;
}

.tab-btn {
  padding: 12px 30px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tab-btn.active {
  background: white;
  color: #667eea;
  font-weight: 600;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.tech-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tech-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

.tech-logo {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.tech-info h4 {
  color: white;
  margin-bottom: 8px;
  font-size: 1.2rem;
}

.tech-info p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 10px;
  line-height: 1.4;
}

.tech-version {
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Функциональность */
.features-section {
  margin-bottom: 80px;
}

.features-section h2 {
  text-align: center;
  margin-bottom: 50px;
  color: white;
  font-size: 2.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  color: white;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.feature-card ul {
  list-style: none;
  padding: 0;
}

.feature-card li {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
}

.feature-card li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #4CAF50;
}

/* Архитектура */
.architecture-section {
  margin-bottom: 80px;
}

.architecture-section h2 {
  text-align: center;
  margin-bottom: 50px;
  color: white;
  font-size: 2.5rem;
}

.architecture-diagram {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.layer {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 20px;
}

.layer:last-child {
  margin-bottom: 0;
}

.layer-title {
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 15px;
  text-align: center;
}

.layer-items {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.layer-item {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.layer-arrow {
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 2rem;
  margin: 10px 0;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Для разработчиков */
.developers-section {
  margin-bottom: 80px;
}

.developers-section h2 {
  text-align: center;
  margin-bottom: 50px;
  color: white;
  font-size: 2.5rem;
}

.dev-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.dev-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dev-card h3 {
  color: white;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.dev-card p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 25px;
  line-height: 1.6;
}

.code-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.code-link {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 15px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.code-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(10px);
}

.link-icon {
  font-size: 1.5rem;
}

.doc-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.doc-link {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.doc-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

.license-info {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.license-info p {
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.license-info p:last-child {
  margin-bottom: 0;
}

/* Авторы */
.authors-section {
  margin-bottom: 80px;
}

.authors-section h2 {
  text-align: center;
  margin-bottom: 50px;
  color: white;
  font-size: 2.5rem;
}

.authors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.author-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  display: flex;
  gap: 25px;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.author-avatar {
  font-size: 4rem;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  flex-shrink: 0;
}

.author-info h4 {
  color: white;
  margin-bottom: 5px;
  font-size: 1.5rem;
}

.author-role {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 15px;
  font-size: 1rem;
}

.author-bio {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 0.95rem;
}

.author-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 6px 15px;
  border-radius: 50px;
  font-size: 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* CTA секция */
.cta-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  padding: 60px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-content h2 {
  color: white;
  margin-bottom: 20px;
  font-size: 2.5rem;
}

.cta-content p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
  font-size: 1.2rem;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-lg {
  padding: 18px 40px;
  font-size: 1.2rem;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  background: #f8f9fa;
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.btn-outline {
  background: transparent;
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
  transform: translateY(-3px);
}

/* Адаптивность */
@media (max-width: 992px) {
  .hero-section {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }
  
  .hero-content h1 {
    font-size: 2.8rem;
  }
  
  .image-placeholder {
    font-size: 150px;
  }
}

@media (max-width: 768px) {
  .tech-tabs {
    flex-direction: column;
    align-items: center;
  }
  
  .tab-btn {
    width: 100%;
    max-width: 300px;
  }
  
  .architecture-diagram {
    padding: 20px;
  }
  
  .layer-items {
    flex-direction: column;
    align-items: center;
  }
  
  .layer-item {
    width: 100%;
    text-align: center;
  }
  
  .cta-section {
    padding: 40px 20px;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .about-view {
    padding: 20px 0 40px;
  }
  
  .hero-content h1 {
    font-size: 2.2rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .image-placeholder {
    font-size: 120px;
  }
  
  .goals-grid,
  .features-grid,
  .tech-grid,
  .dev-info,
  .authors-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-stack-section,
  .architecture-diagram,
  .dev-card,
  .author-card {
    padding: 20px;
  }
}
</style>