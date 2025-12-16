<template>
  <div class="article-list">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка статей...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="$emit('retry')" class="btn-retry">Повторить попытку</button>
    </div>
    
    <div v-else-if="articles.length === 0" class="no-articles">
      <p>Статьи не найдены</p>
      <slot name="empty-state"></slot>
    </div>
    
    <div v-else class="articles-grid">
      <ArticleCard 
        v-for="article in articles" 
        :key="article.id"
        :article="article"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import ArticleCard from './ArticleCard.vue'

defineProps({
  articles: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['retry', 'delete'])
</script>

<style scoped>
.article-list {
  width: 100%;
}

.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 30px;
  background: #ffebee;
  border-radius: 8px;
  color: #c62828;
}

.btn-retry {
  margin-top: 15px;
  padding: 8px 20px;
  background: #c62828;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-retry:hover {
  background: #b71c1c;
}

.no-articles {
  text-align: center;
  padding: 40px;
  background: #f5f5f5;
  border-radius: 8px;
  color: #666;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>