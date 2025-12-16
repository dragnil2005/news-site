<template>
  <div class="article-card" :class="{ 'featured': article.attributes.isFeatured }">
    <!-- Обложка -->
    <div v-if="article.attributes.coverImage?.data" class="article-cover">
      <img 
        :src="getImageUrl(article.attributes.coverImage.data.attributes.url)" 
        :alt="article.attributes.title"
        @click="$router.push(`/article/${article.id}`)"
      />
      <div v-if="article.attributes.isFeatured" class="featured-badge">⭐ Избранное</div>
    </div>

    <!-- Контент -->
    <div class="article-content">
      <!-- Категория -->
      <div class="article-category" v-if="article.attributes.category?.data">
        <router-link :to="`/?category=${article.attributes.category.data.attributes.slug}`">
          {{ article.attributes.category.data.attributes.name }}
        </router-link>
      </div>

      <!-- Заголовок -->
      <h3 class="article-title" @click="$router.push(`/article/${article.id}`)">
        {{ article.attributes.title }}
      </h3>

      <!-- Краткое описание -->
      <p class="article-excerpt">{{ article.attributes.excerpt }}</p>

      <!-- Метаданные -->
      <div class="article-meta">
        <span class="article-date">
          {{ formatDate(article.attributes.publishedAt) }}
        </span>
        
        <span v-if="article.attributes.readingTime" class="reading-time">
          ⏱️ {{ article.attributes.readingTime }} мин
        </span>
        
        <span v-if="article.attributes.views" class="article-views">
          👁️ {{ article.attributes.views }}
        </span>
      </div>

      <!-- Теги -->
      <div v-if="article.attributes.tags?.length" class="article-tags">
        <span 
          v-for="tag in article.attributes.tags.slice(0, 3)" 
          :key="tag"
          class="tag"
          @click="searchByTag(tag)"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Действия для редактора -->
      <div class="article-actions" v-if="authStore.isEditor">
        <button 
          @click="handleDelete" 
          class="btn-delete"
          title="Удалить статью"
        >
          🗑️ Удалить
        </button>
        <router-link 
          :to="`/editor/${article.id}`"
          class="btn-edit"
        >
          ✏️ Редактировать
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format } from 'date-fns'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useArticlesStore } from '@/stores/articles'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const authStore = useAuthStore()
const articlesStore = useArticlesStore()

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

const searchByTag = (tag) => {
  router.push(`/?search=${encodeURIComponent(tag)}`)
}

const handleDelete = async () => {
  if (!confirm('Вы уверены, что хотите удалить эту статью?')) return
  
  try {
    await articlesStore.deleteArticle(props.article.id)
    // Уведомление об успешном удалении
    if (window.showToast) {
      window.showToast('success', 'Статья удалена', 'Статья была успешно удалена')
    }
  } catch (error) {
    console.error('Failed to delete article:', error)
    if (window.showToast) {
      window.showToast('error', 'Ошибка', 'Не удалось удалить статью')
    }
  }
}
</script>

<style scoped>
.article-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.article-card.featured {
  border: 2px solid #ffc107;
}

.article-cover {
  position: relative;
  height: 180px;
  overflow: hidden;
  cursor: pointer;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-cover img {
  transform: scale(1.05);
}

.featured-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ffc107;
  color: #333;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.article-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-category {
  margin-bottom: 10px;
}

.article-category a {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 10px;
  background: #e3f2fd;
  border-radius: 4px;
  display: inline-block;
}

.article-category a:hover {
  background: #bbdefb;
}

.article-title {
  margin: 0 0 12px;
  font-size: 1.25rem;
  line-height: 1.3;
  cursor: pointer;
  color: #333;
  transition: color 0.2s ease;
}

.article-title:hover {
  color: #007bff;
}

.article-excerpt {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
  flex: 1;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #888;
}

.article-date {
  color: #666;
}

.reading-time {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 3px 8px;
  border-radius: 12px;
}

.article-views {
  background: #f3e5f5;
  color: #7b1fa2;
  padding: 3px 8px;
  border-radius: 12px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag:hover {
  background: #bbdefb;
  transform: translateY(-1px);
}

.article-actions {
  display: flex;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  margin-top: auto;
}

.btn-delete {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background: #ffcdd2;
}

.btn-edit {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-edit:hover {
  background: #c8e6c9;
}

@media (max-width: 768px) {
  .article-cover {
    height: 150px;
  }
  
  .article-meta {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .article-actions {
    flex-direction: column;
  }
}
</style>