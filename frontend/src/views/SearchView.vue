<template>
  <div class="search-view">
    <div class="container">
      <!-- Заголовок поиска -->
      <div class="search-header">
        <h1>🔍 Расширенный поиск статей</h1>
        <p>Найдите интересующие вас статьи с помощью расширенного поиска</p>
      </div>

      <!-- Основная поисковая форма -->
      <div class="search-main">
        <div class="search-form-container">
          <div class="search-input-large">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Введите поисковый запрос..."
              class="search-input"
              @keyup.enter="performSearch"
              ref="searchInput"
            />
            <button @click="performSearch" class="search-btn-large">
              <span class="search-icon">🔍</span>
              Искать
            </button>
            <button 
              v-if="searchQuery" 
              @click="clearSearch" 
              class="clear-btn-large"
            >
              Очистить
            </button>
          </div>

          <!-- Расширенные фильтры -->
          <div class="advanced-filters" :class="{ open: showAdvancedFilters }">
            <button 
              class="toggle-filters-btn"
              @click="showAdvancedFilters = !showAdvancedFilters"
            >
              <span class="toggle-icon">{{ showAdvancedFilters ? '▲' : '▼' }}</span>
              {{ showAdvancedFilters ? 'Скрыть фильтры' : 'Показать расширенные фильтры' }}
            </button>

            <div v-if="showAdvancedFilters" class="filters-content">
              <div class="filters-grid">
                <!-- Категория -->
                <div class="filter-group">
                  <label>Категория</label>
                  <select v-model="filters.category" class="filter-select">
                    <option value="">Все категории</option>
                    <option 
                      v-for="category in categories" 
                      :key="category.id"
                      :value="category.attributes.slug"
                    >
                      {{ category.attributes.name }}
                    </option>
                  </select>
                </div>

                <!-- Автор -->
                <div class="filter-group">
                  <label>Автор</label>
                  <select v-model="filters.author" class="filter-select">
                    <option value="">Все авторы</option>
                    <option 
                      v-for="author in uniqueAuthors" 
                      :key="author.id"
                      :value="author.id"
                    >
                      {{ author.attributes.username }}
                    </option>
                  </select>
                </div>

                <!-- Дата -->
                <div class="filter-group">
                  <label>Дата публикации</label>
                  <select v-model="filters.dateRange" class="filter-select">
                    <option value="">Все время</option>
                    <option value="today">Сегодня</option>
                    <option value="week">За неделю</option>
                    <option value="month">За месяц</option>
                    <option value="year">За год</option>
                    <option value="custom">Выбрать диапазон</option>
                  </select>
                </div>

                <!-- Теги -->
                <div class="filter-group">
                  <label>Теги</label>
                  <div class="tags-input">
                    <input
                      v-model="tagInput"
                      type="text"
                      placeholder="Введите тег..."
                      class="tag-input"
                      @keyup.enter="addTag"
                    />
                    <div class="tags-list">
                      <span 
                        v-for="tag in filters.tags" 
                        :key="tag"
                        class="tag"
                      >
                        {{ tag }}
                        <button @click="removeTag(tag)" class="tag-remove">×</button>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Сортировка -->
                <div class="filter-group">
                  <label>Сортировка</label>
                  <select v-model="filters.sort" class="filter-select">
                    <option value="relevance">По релевантности</option>
                    <option value="publishedAt:desc">Сначала новые</option>
                    <option value="publishedAt:asc">Сначала старые</option>
                    <option value="views:desc">По популярности</option>
                    <option value="title:asc">По алфавиту (А-Я)</option>
                  </select>
                </div>

                <!-- Дополнительные опции -->
                <div class="filter-group options">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="filters.isFeatured" 
                    />
                    <span>Только избранные</span>
                  </label>
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="filters.hasImage" 
                    />
                    <span>Только с изображениями</span>
                  </label>
                </div>
              </div>

              <div class="filters-actions">
                <button @click="applyFilters" class="btn btn-primary">
                  Применить фильтры
                </button>
                <button @click="resetFilters" class="btn btn-outline">
                  Сбросить все
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Результаты поиска -->
        <div class="search-results">
          <div class="results-header">
            <h2 v-if="searchQuery || hasActiveFilters">
              Результаты поиска
            </h2>
            <h2 v-else>
              Последние статьи
            </h2>
            
            <div class="results-stats" v-if="!articlesStore.isLoading">
              <span v-if="totalResults > 0">
                Найдено: <strong>{{ totalResults }}</strong> статей
              </span>
              <span v-else-if="searchQuery">
                По запросу "{{ searchQuery }}" ничего не найдено
              </span>
            </div>
          </div>

          <!-- Состояния загрузки -->
          <div v-if="articlesStore.isLoading" class="loading-results">
            <div class="spinner"></div>
            <p>Поиск статей...</p>
          </div>

          <!-- Сообщение об ошибке -->
          <div v-else-if="articlesStore.error" class="error-results">
            <p>{{ articlesStore.error }}</p>
            <button @click="performSearch" class="btn btn-primary">
              Повторить попытку
            </button>
          </div>

          <!-- Результаты -->
          <div v-else-if="articles.length > 0" class="results-grid">
            <ArticleCard 
              v-for="article in articles" 
              :key="article.id"
              :article="article"
            />
          </div>

          <!-- Пустые результаты -->
          <div v-else class="no-results">
            <div class="no-results-icon">🔍</div>
            <h3>Статьи не найдены</h3>
            <p>Попробуйте изменить параметры поиска или фильтры</p>
            <button @click="resetFilters" class="btn btn-primary">
              Сбросить фильтры
            </button>
          </div>

          <!-- Пагинация -->
          <AppPagination 
            v-if="totalPages > 1"
            :current-page="currentPage"
            :total-pages="totalPages"
            :total-items="totalResults"
            :page-size="pageSize"
            :show-size-selector="true"
            @page-change="changePage"
            @size-change="changePageSize"
            class="search-pagination"
          />
        </div>

        <!-- Популярные запросы -->
        <div class="popular-searches" v-if="!searchQuery && !hasActiveFilters">
          <h3>🔥 Популярные запросы</h3>
          <div class="popular-tags">
            <span 
              v-for="tag in popularTags" 
              :key="tag"
              class="popular-tag"
              @click="searchByTag(tag)"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticlesStore } from '@/stores/articles'
import ArticleCard from '@/components/articles/ArticleCard.vue'
import AppPagination from '@/components/ui/AppPagination.vue'

const route = useRoute()
const router = useRouter()
const articlesStore = useArticlesStore()
const searchInput = ref(null)

// Состояния
const searchQuery = ref('')
const tagInput = ref('')
const showAdvancedFilters = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)

// Фильтры
const filters = reactive({
  category: '',
  author: '',
  dateRange: '',
  tags: [],
  sort: 'relevance',
  isFeatured: false,
  hasImage: false,
  startDate: '',
  endDate: ''
})

// Данные
const categories = computed(() => articlesStore.categories)
const articles = computed(() => articlesStore.articles)
const totalResults = computed(() => articlesStore.pagination.total || 0)
const totalPages = computed(() => articlesStore.pagination.pageCount || 0)

// Вычисляемые свойства
const hasActiveFilters = computed(() => {
  return filters.category !== '' ||
         filters.author !== '' ||
         filters.dateRange !== '' ||
         filters.tags.length > 0 ||
         filters.sort !== 'relevance' ||
         filters.isFeatured ||
         filters.hasImage
})

// Уникальные авторы (извлекаем из статей)
const uniqueAuthors = computed(() => {
  const authors = new Map()
  articlesStore.articles.forEach(article => {
    if (article.attributes.author?.data) {
      const author = article.attributes.author.data
      if (!authors.has(author.id)) {
        authors.set(author.id, author)
      }
    }
  })
  return Array.from(authors.values())
})

// Популярные теги
const popularTags = computed(() => {
  const tags = new Set()
  articlesStore.articles.forEach(article => {
    if (article.attributes.tags) {
      article.attributes.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags).slice(0, 10)
})

// Методы
const performSearch = () => {
  if (!searchQuery.value.trim() && !hasActiveFilters.value) {
    // Если нет запроса и фильтров, показываем последние статьи
    fetchLatestArticles()
    return
  }
  
  currentPage.value = 1
  updateArticles()
}

const clearSearch = () => {
  searchQuery.value = ''
  resetFilters()
  fetchLatestArticles()
}

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !filters.tags.includes(tag)) {
    filters.tags.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (tagToRemove) => {
  filters.tags = filters.tags.filter(tag => tag !== tagToRemove)
}

const searchByTag = (tag) => {
  searchQuery.value = tag
  performSearch()
}

const applyFilters = () => {
  currentPage.value = 1
  updateArticles()
}

const resetFilters = () => {
  Object.assign(filters, {
    category: '',
    author: '',
    dateRange: '',
    tags: [],
    sort: 'relevance',
    isFeatured: false,
    hasImage: false,
    startDate: '',
    endDate: ''
  })
  tagInput.value = ''
  currentPage.value = 1
  updateArticles()
}

const changePage = (page) => {
  currentPage.value = page
  updateArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const changePageSize = (size) => {
  pageSize.value = size
  currentPage.value = 1
  updateArticles()
}

const updateArticles = () => {
  const params = {
    'pagination[page]': currentPage.value,
    'pagination[pageSize]': pageSize.value,
    populate: 'category,author,coverImage'
  }

  // Добавляем текстовый поиск
  if (searchQuery.value.trim()) {
    params['filters[$or][0][title][$containsi]'] = searchQuery.value
    params['filters[$or][1][content][$containsi]'] = searchQuery.value
    params['filters[$or][2][excerpt][$containsi]'] = searchQuery.value
  }

  // Добавляем фильтры
  if (filters.category) {
    params['filters[category][slug][$eq]'] = filters.category
  }
  if (filters.author) {
    params['filters[author][id][$eq]'] = filters.author
  }
  if (filters.isFeatured) {
    params['filters[isFeatured][$eq]'] = true
  }
  if (filters.hasImage) {
    params['filters[coverImage][id][$notNull]'] = true
  }
  if (filters.tags.length > 0) {
    params['filters[tags][$containsi]'] = filters.tags[0]
  }

  // Добавляем сортировку
  if (filters.sort === 'relevance' && searchQuery.value) {
    params.sort = 'publishedAt:desc' // По умолчанию для релевантности
  } else if (filters.sort) {
    params.sort = filters.sort
  }

  // Фильтр по дате
  if (filters.dateRange) {
    const now = new Date()
    let startDate = new Date()
    
    switch (filters.dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }
    
    if (filters.dateRange !== 'custom') {
      params['filters[publishedAt][$gte]'] = startDate.toISOString()
    }
  }

  articlesStore.fetchArticles(params)
}

const fetchLatestArticles = () => {
  articlesStore.fetchArticles({
    sort: 'publishedAt:desc',
    'pagination[pageSize]': pageSize.value
  })
}

// Инициализация
onMounted(() => {
  // Фокусируемся на поле поиска
  if (searchInput.value) {
    searchInput.value.focus()
  }

  // Загружаем категории
  if (categories.value.length === 0) {
    articlesStore.fetchCategories()
  }

  // Проверяем параметры URL
  if (route.query.q) {
    searchQuery.value = route.query.q
  }
  if (route.query.category) {
    filters.category = route.query.category
  }
  if (route.query.tag) {
    filters.tags = [route.query.tag]
  }

  // Загружаем статьи
  if (searchQuery.value || hasActiveFilters.value) {
    performSearch()
  } else {
    fetchLatestArticles()
  }
})

// Обновление URL при поиске
watch([searchQuery, filters], () => {
  const query = {}
  if (searchQuery.value) query.q = searchQuery.value
  if (filters.category) query.category = filters.category
  if (filters.tags.length > 0) query.tag = filters.tags[0]
  
  router.replace({ query })
}, { deep: true })
</script>

<style scoped>
.search-view {
  padding: 30px 0 60px;
  background: #f8f9fa;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.search-header h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 2rem;
}

.search-header p {
  color: #666;
  font-size: 1.1rem;
}

.search-main {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Основная поисковая форма */
.search-form-container {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.search-input-large {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 15px 25px;
  border: 2px solid #007bff;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #0056b3;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.search-btn-large {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.search-btn-large:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.clear-btn-large {
  background: #f8f9fa;
  color: #666;
  border: 2px solid #e9ecef;
  padding: 15px 20px;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn-large:hover {
  background: #e9ecef;
  color: #333;
}

/* Расширенные фильтры */
.advanced-filters {
  border-top: 2px solid #f0f0f0;
  padding-top: 20px;
}

.toggle-filters-btn {
  background: none;
  border: none;
  color: #007bff;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
}

.toggle-filters-btn:hover {
  color: #0056b3;
}

.filters-content {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
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

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.filter-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #007bff;
}

.tags-input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
}

.tag-input {
  width: 100%;
  border: none;
  padding: 5px 0;
  margin-bottom: 10px;
  outline: none;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  background: #e3f2fd;
  color: #1976d2;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 13px;
  gap: 5px;
}

.tag-remove {
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  font-size: 16px;
  padding: 0 5px;
}

.options {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.filters-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

/* Результаты поиска */
.search-results {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.results-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.results-stats {
  color: #666;
  font-size: 14px;
}

/* Состояния */
.loading-results {
  text-align: center;
  padding: 50px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-results {
  text-align: center;
  padding: 40px;
  background: #ffebee;
  border-radius: 10px;
  color: #c62828;
}

.no-results {
  text-align: center;
  padding: 60px 40px;
}

.no-results-icon {
  font-size: 60px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.no-results h3 {
  color: #666;
  margin-bottom: 10px;
}

.no-results p {
  color: #888;
  margin-bottom: 20px;
}

/* Сетка результатов */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

/* Пагинация */
.search-pagination {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #f0f0f0;
}

/* Популярные запросы */
.popular-searches {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.popular-searches h3 {
  margin: 0 0 20px;
  color: #333;
  font-size: 1.2rem;
}

.popular-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.popular-tag {
  background: #f8f9fa;
  color: #495057;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e9ecef;
}

.popular-tag:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .search-input-large {
    flex-direction: column;
  }
  
  .search-input,
  .search-btn-large,
  .clear-btn-large {
    width: 100%;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>