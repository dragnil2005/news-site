<template>
  <div class="not-found-view">
    <div class="container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1>Страница не найдена</h1>
        <p class="error-message">
          Извините, но страница, которую вы ищете, не существует, была удалена или временно недоступна.
        </p>
        
        <div class="suggestions">
          <h3>Возможно, вы искали:</h3>
          <ul>
            <li><router-link to="/">Главную страницу</router-link></li>
            <li><router-link to="/login">Страницу входа</router-link></li>
            <li><router-link to="/register">Регистрацию</router-link></li>
            <li><router-link to="/?featured=true">Избранные статьи</router-link></li>
          </ul>
        </div>
        
        <div class="actions">
          <router-link to="/" class="btn btn-primary">
            ← Вернуться на главную
          </router-link>
          <button @click="goBack" class="btn btn-outline">
            Назад
          </button>
        </div>
        
        <div class="search-box">
          <h3>Или попробуйте найти нужную страницу:</h3>
          <div class="search-container">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Введите запрос для поиска..."
              class="search-input"
              @keyup.enter="searchArticles"
            />
            <button @click="searchArticles" class="search-btn">
              Поиск
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

const goBack = () => {
  router.go(-1)
}

const searchArticles = () => {
  if (searchQuery.value.trim()) {
    router.push(`/?search=${encodeURIComponent(searchQuery.value)}`)
  }
}
</script>

<style scoped>
.not-found-view {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 800px;
}

.not-found-content {
  background: white;
  border-radius: 20px;
  padding: 50px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #667eea;
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-bottom: 20px;
  font-size: 2.5rem;
}

.error-message {
  color: #666;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.suggestions {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  text-align: left;
}

.suggestions h3 {
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.suggestions ul {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.suggestions li {
  padding: 8px 15px;
  background: white;
  border-radius: 5px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.suggestions li:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.suggestions a {
  color: #667eea;
  text-decoration: none;
  display: block;
}

.suggestions a:hover {
  text-decoration: underline;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 40px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-outline {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.search-box {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10px;
  padding: 30px;
  border: 2px dashed #dee2e6;
}

.search-box h3 {
  color: #333;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid #667eea;
  border-radius: 8px 0 0 8px;
  font-size: 16px;
  outline: none;
}

.search-input:focus {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 0 8px 8px 0;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: #5a6fd8;
}
</style>