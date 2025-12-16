<template>
  <div class="home-view">
    <div class="container">
      <!-- Поисковая строка -->
      <div class="search-section">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск статей..."
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="search-btn">
            🔍 Поиск
          </button>
          <button 
            v-if="searchQuery" 
            @click="clearSearch" 
            class="clear-btn"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Фильтры -->
      <ArticleFilters 
        :filters="articlesStore.filters"
        :search-query="searchQuery"
        @update-filters="handleFiltersUpdate"
      />

      <!-- Избранные статьи -->
      <section v-if="featuredArticles.length > 0 && !searchQuery" class="featured-section">
        <h2 class="section-title">⭐ Избранные статьи</h2>
        <div class="featured-slider">
          <div 
            v-for="article in featuredArticles.slice(0, 3)" 
            :key="article.id"
            class="featured-card"
            @click="$router.push(`/article/${article.id}`)"
          >
            <div v-if="article.attributes.coverImage?.data" class="featured-image">
              <img 
                :src="getImageUrl(article.attributes.coverImage.data.attributes.url)" 
                :alt="article.attributes.title"
              />
            </div>
            <div class="featured-content">
              <h3>{{ article.attributes.title }}</h3>
              <p>{{ article.attributes.excerpt }}</p>
              <div class="featured-meta">
                <span>{{ formatDate(article.attributes.publishedAt) }}</span>
                <span v-if="article.attributes.readingTime">
                  ⏱️ {{ article.attributes.readingTime }} мин
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Все статьи -->
      <section class="articles-section">
        <div class="section-header">
          <h2 class="section-title">📰 Все статьи</h2>
          <div class="articles-count" v-if="!articlesStore.isLoading">
            Найдено: {{ articlesStore.pagination.total }} статей
          </div>
        </div>

        <ArticleList 
          :articles="articles"
          :loading="articlesStore.isLoading"
          :error="articlesStore.error"
          @retry="articlesStore.fetchArticles"
          @delete="handleDeleteArticle"
        />

        <!-- Пагинация -->
        <div v-if="articlesStore.pagination.pageCount > 1" class="pagination-container">
          <div class="pagination">
            <button 
              :disabled="articlesStore.pagination.page === 1"
              @click="goToPage(articlesStore.pagination.page - 1)"
              class="pagination-btn prev"
            >
              ← Назад
            </button>
            
            <div class="page-numbers">
              <button 
                v-for="page in getPageNumbers()"
                :key="page"
                :class="['page-btn', { active: page === articlesStore.pagination.page, dots: page === '...' }]"
                @click="page !== '...' && goToPage(page)"
                :disabled="page === '...'"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              :disabled="articlesStore.pagination.page === articlesStore.pagination.pageCount"
              @click="goToPage(articlesStore.pagination.page + 1)"
              class="pagination-btn next"
            >
              Вперед →
            </button>
          </div>
          
          <div class="pagination-info">
            Страница {{ articlesStore.pagination.page }} из {{ articlesStore.pagination.pageCount }}
            ({{ articlesStore.pagination.total }} всего)
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format } from 'date-fns'
import { useArticlesStore } from '@/stores/articles'
import ArticleFilters from '@/components/articles/ArticleFilters.vue'
import ArticleList from '@/components/articles/ArticleList.vue'

const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()

const searchQuery = ref('')

// Получаем данные из хранилища
const articles = computed(() => articlesStore.articles)
const featuredArticles = computed(() => articlesStore.featuredArticles)

// Методы
const getImageUrl = (path) => {
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_STRAPI_URL}${path}`
}

const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'dd.MM.yyyy')
  } catch {
    return ''
  }
}

const handleSearch = () => {
  articlesStore.setFilters({ search: searchQuery.value })
}

const clearSearch = () => {
  searchQuery.value = ''
  articlesStore.setFilters({ search: '' })
}

const handleFiltersUpdate = (filters) => {
  articlesStore.setFilters(filters)
}

const handleDeleteArticle = async (articleId) => {
  try {
    await articlesStore.deleteArticle(articleId)
    // Обновляем список статей
    articlesStore.fetchArticles()
  } catch (error) {
    console.error('Failed to delete article:', error)
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= articlesStore.pagination.pageCount) {
    articlesStore.setPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const getPageNumbers = () => {
  const current = articlesStore.pagination.page
  const total = articlesStore.pagination.pageCount
  const pages = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 4) pages.push('...')
    
    const start = Math.max(2, current - 2)
    const end = Math.min(total - 1, current + 2)
    
    for (let i = start; i <= end; i++) pages.push(i)
    
    if (current < total - 3) pages.push('...')
    pages.push(total)
  }
  
  return pages
}

// Инициализация
onMounted(async () => {
  // Загружаем категории
  await articlesStore.fetchCategories()
  
  // Загружаем избранные статьи
  await articlesStore.fetchFeaturedArticles()
  
  // Применяем фильтры из URL
  if (route.query.category) {
    articlesStore.setFilters({ category: route.query.category })
  }
  if (route.query.featured === 'true') {
    articlesStore.setFilters({ isFeatured: true })
  }
  if (route.query.search) {
    searchQuery.value = route.query.search
    articlesStore.setFilters({ search: route.query.search })
  }
  
  // Загружаем статьи с текущими фильтрами
  articlesStore.fetchArticles()
})

// Обновление URL при изменении фильтров
watch(() => articlesStore.filters, (filters) => {
  const query = {}
  if (filters.category) query.category = filters.category
  if (filters.isFeatured) query.featured = true
  if (filters.search) query.search = filters.search
  
  router.replace({ query })
}, { deep: true })

// Обновление поискового запроса при изменении фильтров
watch(() => articlesStore.filters.search, (search) => {
  if (search !== searchQuery.value) {
    searchQuery.value = search || ''
  }
})
</script>

<style scoped>
.home-view {
  padding: 20px 0 40px;
  background: #f8f9fa;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Стили для поиска */
.search-section {
  margin-bottom: 30px;
}

.search-box {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  background: white;
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 15px 25px;
  border: none;
  font-size: 16px;
  outline: none;
  background: transparent;
}

.search-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  opacity: 0.9;
}

.clear-btn {
  position: absolute;
  right: 110px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 5px;
  z-index: 1;
}

.clear-btn:hover {
  color: #333;
}

/* Стили для избранных статей */
.featured-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.featured-slider {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.featured-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.featured-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.featured-image {
  height: 200px;
  overflow: hidden;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-card:hover .featured-image img {
  transform: scale(1.1);
}

.featured-content {
  padding: 20px;
}

.featured-card h3 {
  margin: 0 0 10px;
  color: #333;
  font-size: 1.3rem;
  line-height: 1.3;
}

.featured-card p {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.featured-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #888;
  font-size: 14px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

/* Стили для раздела статей */
.articles-section {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e9ecef;
}

.articles-count {
  color: #666;
  font-size: 14px;
  background: #e9ecef;
  padding: 5px 12px;
  border-radius: 20px;
}

/* Стили для пагинации */
.pagination-container {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px solid #e9ecef;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.pagination-btn {
  padding: 10px 20px;
  border: 2px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #007bff;
  color: white;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #ccc;
  color: #ccc;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-btn {
  min-width: 45px;
  height: 45px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled):not(.dots) {
  border-color: #007bff;
  color: #007bff;
  transform: translateY(-2px);
}

.page-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.page-btn.dots {
  border: none;
  background: none;
  cursor: default;
  min-width: auto;
  color: #666;
}

.page-btn:disabled {
  cursor: default;
}

.pagination-info {
  text-align: center;
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .search-box {
    flex-direction: column;
    border-radius: 15px;
  }
  
  .search-input {
    padding: 15px;
  }
  
  .search-btn {
    border-radius: 0 0 15px 15px;
  }
  
  .clear-btn {
    right: 20px;
  }
  
  .featured-slider {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
  
  .page-btn {
    min-width: 40px;
    height: 40px;
  }
}
</style>