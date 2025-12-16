<template>
  <div class="article-filters">
    <div class="filters-header">
      <h3>Фильтры и сортировка</h3>
      <button 
        v-if="hasActiveFilters" 
        @click="clearAllFilters"
        class="btn-clear-all"
      >
        Сбросить все
      </button>
    </div>
    
    <div class="filters-grid">
      <!-- Категории -->
      <div class="filter-group">
        <label>Категория</label>
        <select 
          v-model="localFilters.category" 
          @change="updateFilters"
          class="filter-select"
        >
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
      
      <!-- Сортировка -->
      <div class="filter-group">
        <label>Сортировка</label>
        <select 
          v-model="localFilters.sort" 
          @change="updateFilters"
          class="filter-select"
        >
          <option value="publishedAt:desc">Сначала новые</option>
          <option value="publishedAt:asc">Сначала старые</option>
          <option value="views:desc">По популярности</option>
          <option value="title:asc">По алфавиту (А-Я)</option>
          <option value="readingTime:asc">По времени чтения</option>
        </select>
      </div>
      
      <!-- Избранное -->
      <div class="filter-group">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="localFilters.isFeatured" 
            @change="updateFilters"
          />
          <span>Только избранные</span>
        </label>
      </div>
      
      <!-- Теги (если есть) -->
      <div v-if="availableTags.length > 0" class="filter-group">
        <label>Теги</label>
        <select 
          v-model="localFilters.tag" 
          @change="updateFilters"
          class="filter-select"
        >
          <option value="">Все теги</option>
          <option 
            v-for="tag in availableTags" 
            :key="tag"
            :value="tag"
          >
            {{ tag }}
          </option>
        </select>
      </div>
    </div>
    
    <!-- Активные фильтры -->
    <div v-if="hasActiveFilters" class="active-filters">
      <div class="active-filters-list">
        <span 
          v-for="filter in activeFiltersList" 
          :key="filter.key"
          class="active-filter"
        >
          {{ filter.label }}
          <button @click="removeFilter(filter.key)" class="remove-filter">×</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useArticlesStore } from '@/stores/articles'

const articlesStore = useArticlesStore()

// Локальная копия фильтров
const localFilters = ref({
  category: '',
  sort: 'publishedAt:desc',
  isFeatured: false,
  tag: '',
  search: ''
})

const categories = computed(() => articlesStore.categories)

// Извлечение уникальных тегов из всех статей
const availableTags = computed(() => {
  const tags = new Set()
  articlesStore.articles.forEach(article => {
    if (article.attributes.tags) {
      article.attributes.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags).slice(0, 10) // Показываем только 10 тегов
})

// Проверка активных фильтров
const hasActiveFilters = computed(() => {
  return localFilters.value.category !== '' ||
         localFilters.value.isFeatured ||
         localFilters.value.tag !== '' ||
         localFilters.value.search !== '' ||
         localFilters.value.sort !== 'publishedAt:desc'
})

// Список активных фильтров для отображения
const activeFiltersList = computed(() => {
  const filters = []
  
  if (localFilters.value.category) {
    const category = categories.value.find(c => c.attributes.slug === localFilters.value.category)
    if (category) {
      filters.push({
        key: 'category',
        label: `Категория: ${category.attributes.name}`
      })
    }
  }
  
  if (localFilters.value.isFeatured) {
    filters.push({
      key: 'isFeatured',
      label: 'Только избранные'
    })
  }
  
  if (localFilters.value.tag) {
    filters.push({
      key: 'tag',
      label: `Тег: ${localFilters.value.tag}`
    })
  }
  
  if (localFilters.value.sort !== 'publishedAt:desc') {
    const sortLabels = {
      'publishedAt:asc': 'Старые первыми',
      'views:desc': 'По популярности',
      'title:asc': 'По алфавиту',
      'readingTime:asc': 'По времени чтения'
    }
    filters.push({
      key: 'sort',
      label: `Сортировка: ${sortLabels[localFilters.value.sort] || localFilters.value.sort}`
    })
  }
  
  if (localFilters.value.search) {
    filters.push({
      key: 'search',
      label: `Поиск: "${localFilters.value.search}"`
    })
  }
  
  return filters
})

// Методы
const updateFilters = () => {
  emit('update-filters', { ...localFilters.value })
}

const removeFilter = (filterKey) => {
  if (filterKey === 'category') {
    localFilters.value.category = ''
  } else if (filterKey === 'isFeatured') {
    localFilters.value.isFeatured = false
  } else if (filterKey === 'tag') {
    localFilters.value.tag = ''
  } else if (filterKey === 'sort') {
    localFilters.value.sort = 'publishedAt:desc'
  } else if (filterKey === 'search') {
    localFilters.value.search = ''
  }
  updateFilters()
}

const clearAllFilters = () => {
  localFilters.value = {
    category: '',
    sort: 'publishedAt:desc',
    isFeatured: false,
    tag: '',
    search: ''
  }
  updateFilters()
}

// Инициализация из пропсов
const props = defineProps({
  filters: {
    type: Object,
    default: () => ({})
  },
  searchQuery: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update-filters'])

// Синхронизация с внешними фильтрами
watch(() => props.filters, (newFilters) => {
  if (newFilters) {
    localFilters.value = { ...localFilters.value, ...newFilters }
  }
}, { deep: true })

watch(() => props.searchQuery, (newSearch) => {
  localFilters.value.search = newSearch
})

onMounted(() => {
  // Загружаем категории если их нет
  if (categories.value.length === 0) {
    articlesStore.fetchCategories()
  }
  
  // Инициализируем фильтры
  if (props.filters) {
    localFilters.value = { ...localFilters.value, ...props.filters }
  }
})
</script>

<style scoped>
.article-filters {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 25px;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.filters-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.btn-clear-all {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-clear-all:hover {
  background: #ffcdd2;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
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
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.checkbox-label:hover {
  background: #e9ecef;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.active-filters {
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.active-filters-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.active-filter {
  display: inline-flex;
  align-items: center;
  background: #e3f2fd;
  color: #1976d2;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  gap: 8px;
}

.remove-filter {
  background: none;
  border: none;
  color: #1976d2;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.remove-filter:hover {
  background: #bbdefb;
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>