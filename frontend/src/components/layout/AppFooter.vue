<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <!-- Информация о проекте -->
        <div class="footer-section">
          <div class="footer-logo">
            <div class="logo-icon">📰</div>
            <div class="logo-text">
              <h3>Новостной портал</h3>
              <p>Курсовой проект по Node.js</p>
            </div>
          </div>
          <p class="footer-description">
            Современный новостной портал с системой управления контентом на основе Strapi и Vue.js
          </p>
          <div class="footer-social">
            <a href="#" class="social-link" title="GitHub">
              <span class="social-icon">🐙</span>
            </a>
            <a href="#" class="social-link" title="Telegram">
              <span class="social-icon">✈️</span>
            </a>
            <a href="#" class="social-link" title="VK">
              <span class="social-icon">👥</span>
            </a>
            <a href="#" class="social-link" title="Email">
              <span class="social-icon">✉️</span>
            </a>
          </div>
        </div>

        <!-- Быстрые ссылки -->
        <div class="footer-section">
          <h4>Быстрые ссылки</h4>
          <ul class="footer-links">
            <li><router-link to="/">Главная</router-link></li>
            <li><router-link to="/?featured=true">Избранное</router-link></li>
            <li><router-link to="/categories" v-if="authStore.isEditor">Категории</router-link></li>
            <li><router-link to="/search">Поиск</router-link></li>
            <li><router-link to="/about">О проекте</router-link></li>
            <li><router-link to="/contact">Контакты</router-link></li>
          </ul>
        </div>

        <!-- Категории -->
        <div class="footer-section">
          <h4>Популярные категории</h4>
          <ul class="footer-links">
            <li v-for="category in popularCategories" :key="category.id">
              <router-link :to="`/?category=${category.attributes.slug}`">
                {{ category.attributes.name }}
              </router-link>
            </li>
            <li v-if="categories.length > 5">
              <router-link to="/categories" v-if="authStore.isEditor">
                Все категории →
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Контактная информация -->
        <div class="footer-section">
          <h4>Контакты</h4>
          <ul class="footer-contacts">
            <li>
              <span class="contact-icon">📧</span>
              <span>info@newsportal.ru</span>
            </li>
            <li>
              <span class="contact-icon">📞</span>
              <span>+7 (999) 123-45-67</span>
            </li>
            <li>
              <span class="contact-icon">📍</span>
              <span>г. Москва, ул. Примерная, д. 1</span>
            </li>
            <li>
              <span class="contact-icon">⏰</span>
              <span>Пн-Пт: 9:00-18:00</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Нижняя часть футера -->
      <div class="footer-bottom">
        <div class="copyright">
          <p>&copy; 2024 Новостной портал. Все права защищены.</p>
          <p>Курсовой проект специальности «ПОИТ», 4 курс</p>
        </div>
        
        <div class="footer-legal">
          <router-link to="/privacy">Политика конфиденциальности</router-link>
          <router-link to="/terms">Условия использования</router-link>
        </div>
        
        <div class="footer-stats">
          <span v-if="totalArticles > 0">📊 Статей: {{ totalArticles }}</span>
          <span v-if="totalCategories > 0">📂 Категорий: {{ totalCategories }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useArticlesStore } from '@/stores/articles'

const authStore = useAuthStore()
const articlesStore = useArticlesStore()

// Статистика
const totalArticles = computed(() => articlesStore.pagination.total || 0)
const totalCategories = computed(() => articlesStore.categories.length)

// Популярные категории (первые 5)
const popularCategories = computed(() => {
  return articlesStore.categories.slice(0, 5)
})

// Получаем категории при монтировании
onMounted(async () => {
  if (articlesStore.categories.length === 0) {
    await articlesStore.fetchCategories()
  }
})
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 60px 0 20px;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-section h4 {
  color: white;
  margin-bottom: 20px;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Логотип футера */
.footer-logo {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.footer-logo .logo-icon {
  font-size: 36px;
}

.footer-logo h3 {
  margin: 0;
  font-size: 1.3rem;
  color: white;
}

.footer-logo p {
  margin: 5px 0 0;
  color: #bdc3c7;
  font-size: 0.9rem;
}

.footer-description {
  color: #bdc3c7;
  line-height: 1.6;
  margin-bottom: 25px;
  font-size: 0.95rem;
}

.footer-social {
  display: flex;
  gap: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #007bff;
  transform: translateY(-3px);
}

.social-icon {
  font-size: 18px;
}

/* Списки ссылок */
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
  padding: 2px 0;
}

.footer-links a:hover {
  color: white;
  transform: translateX(5px);
}

/* Контакты */
.footer-contacts {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-contacts li {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  color: #bdc3c7;
  font-size: 0.95rem;
}

.contact-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  font-size: 12px;
  flex-shrink: 0;
}

/* Нижняя часть футера */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding-top: 20px;
}

.copyright {
  color: #95a5a6;
  font-size: 0.9rem;
}

.copyright p {
  margin: 5px 0;
}

.footer-legal {
  display: flex;
  gap: 20px;
}

.footer-legal a {
  color: #95a5a6;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.footer-legal a:hover {
  color: white;
}

.footer-stats {
  display: flex;
  gap: 20px;
  color: #95a5a6;
  font-size: 0.9rem;
}

.footer-stats span {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .footer-legal {
    flex-direction: column;
    gap: 10px;
  }
  
  .footer-stats {
    flex-direction: column;
    gap: 10px;
  }
}
</style>