<template>
  <div class="article-view">
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Загрузка статьи...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <h2>Ошибка</h2>
      <p>{{ error }}</p>
      <router-link to="/" class="btn btn-primary">Вернуться на главную</router-link>
    </div>

    <div v-else-if="article" class="article-container">
      <!-- Хлебные крошки -->
      <nav class="breadcrumbs">
        <router-link to="/">Главная</router-link> / 
        <router-link 
          v-if="article.attributes.category?.data"
          :to="`/?category=${article.attributes.category.data.attributes.slug}`"
        >
          {{ article.attributes.category.data.attributes.name }}
        </router-link>
        <span v-else>Без категории</span> / 
        <span>{{ article.attributes.title }}</span>
      </nav>

      <!-- Обложка -->
      <div v-if="article.attributes.coverImage?.data" class="article-cover">
        <img 
          :src="getImageUrl(article.attributes.coverImage.data.attributes.url)" 
          :alt="article.attributes.title"
        />
      </div>

      <!-- Заголовок и метаданные -->
      <header class="article-header">
        <div class="article-meta">
          <span v-if="article.attributes.category?.data" class="category">
            {{ article.attributes.category.data.attributes.name }}
          </span>
          <span class="date">{{ formatDate(article.attributes.publishedAt) }}</span>
          <span v-if="article.attributes.views" class="views">👁️ {{ article.attributes.views }} просмотров</span>
          <span v-if="article.attributes.readingTime" class="reading-time">⏱️ {{ article.attributes.readingTime }} мин чтения</span>
          <span v-if="article.attributes.isFeatured" class="featured-badge">★ Избранная статья</span>
        </div>

        <h1 class="article-title">{{ article.attributes.title }}</h1>

        <div v-if="article.attributes.author?.data" class="article-author">
          <div class="author-info">
            <div class="author-avatar">
              {{ article.attributes.author.data.attributes.username.charAt(0).toUpperCase() }}
            </div>
            <div class="author-details">
              <span class="author-name">{{ article.attributes.author.data.attributes.username }}</span>
              <span class="author-email">{{ article.attributes.author.data.attributes.email }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Краткое описание -->
      <div v-if="article.attributes.excerpt" class="article-excerpt">
        <p>{{ article.attributes.excerpt }}</p>
      </div>

      <!-- Содержимое -->
      <div class="article-content" v-html="formatContent(article.attributes.content)"></div>

      <!-- Теги -->
      <div v-if="article.attributes.tags && article.attributes.tags.length" class="article-tags">
        <h3>Теги:</h3>
        <div class="tags-list">
          <span 
            v-for="tag in article.attributes.tags" 
            :key="tag"
            class="tag"
            @click="searchByTag(tag)"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- SEO информация -->
      <div v-if="article.attributes.seo" class="article-seo">
        <div class="seo-title">
          <strong>SEO Title:</strong> {{ article.attributes.seo.title }}
        </div>
        <div class="seo-description">
          <strong>SEO Description:</strong> {{ article.attributes.seo.description }}
        </div>
      </div>

      <!-- Действия -->
      <div class="article-actions" v-if="authStore.isEditor">
        <button @click="handleEdit" class="btn btn-primary">Редактировать</button>
        <button @click="handleDelete" class="btn btn-danger">Удалить</button>
        <button 
          v-if="!article.attributes.publishedAt"
          @click="handlePublish"
          class="btn btn-success"
        >
          Опубликовать сейчас
        </button>
        <button 
          v-if="article.attributes.publishedAt"
          @click="handleUnpublish"
          class="btn btn-warning"
        >
          Снять с публикации
        </button>
      </div>

      <!-- Похожие статьи -->
      <section v-if="similarArticles.length" class="similar-articles">
        <h2>Похожие статьи</h2>
        <div class="similar-grid">
          <div 
            v-for="similar in similarArticles" 
            :key="similar.id"
            class="similar-card"
          >
            <router-link :to="`/article/${similar.id}`">
              <h4>{{ similar.attributes.title }}</h4>
              <p>{{ similar.attributes.excerpt }}</p>
            </router-link>
          </div>
        </div>
      </section>

      <!-- Навигация -->
      <div class="article-navigation">
        <router-link v-if="previousArticle" :to="`/article/${previousArticle.id}`" class="nav-link prev">
          ← {{ previousArticle.attributes.title }}
        </router-link>
        <router-link v-if="nextArticle" :to="`/article/${nextArticle.id}`" class="nav-link next">
          {{ nextArticle.attributes.title }} →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/auth'
import { useArticlesStore } from '@/stores/articles'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const articlesStore = useArticlesStore()

const loading = ref(true)
const error = ref(null)
const article = ref(null)
const similarArticles = ref([])
const previousArticle = ref(null)
const nextArticle = ref(null)

const getImageUrl = (path) => {
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_STRAPI_URL}${path}`
}

const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'dd MMMM yyyy, HH:mm')
  } catch {
    return dateString
  }
}

const formatContent = (content) => {
  if (!content) return ''
  return content.replace(/\n/g, '<br>')
}

const searchByTag = (tag) => {
  router.push(`/?search=${tag}`)
}

const handleEdit = () => {
  router.push(`/editor/${article.value.id}`)
}

const handleDelete = async () => {
  if (confirm('Вы уверены, что хотите удалить эту статью?')) {
    try {
      await articlesStore.deleteArticle(article.value.id)
      router.push('/')
    } catch (error) {
      alert('Ошибка при удалении статьи')
    }
  }
}

const handlePublish = async () => {
  try {
    await articlesStore.publishArticle(article.value.id)
    article.value.attributes.publishedAt = new Date().toISOString()
    alert('Статья опубликована успешно!')
  } catch (error) {
    alert('Ошибка при публикации статьи')
  }
}

const handleUnpublish = async () => {
  if (confirm('Снять статью с публикации?')) {
    try {
      await articlesStore.updateArticle(article.value.id, {
        publishedAt: null
      })
      article.value.attributes.publishedAt = null
      alert('Статья снята с публикации')
    } catch (error) {
      alert('Ошибка')
    }
  }
}

const loadArticle = async () => {
  loading.value = true
  error.value = null
  
  try {
    const articleId = route.params.id
    article.value = await articlesStore.fetchArticle(articleId)
    
    // Инкремент просмотров
    await articlesStore.incrementViews(articleId)
    
    // Загрузка похожих статей
    if (article.value.attributes.category?.data) {
      const response = await articlesStore.fetchArticles({
        'filters[category][slug][$eq]': article.value.attributes.category.data.attributes.slug,
        'filters[id][$ne]': articleId,
        'pagination[pageSize]': 3
      })
      similarArticles.value = response.data
    }
    
    // Загрузка предыдущей и следующей статьи
    const allArticles = await articlesStore.fetchArticles({
      sort: 'publishedAt:desc',
      'pagination[pageSize]': 100
    })
    
    const currentIndex = allArticles.data.findIndex(a => a.id === articleId)
    if (currentIndex > 0) {
      previousArticle.value = allArticles.data[currentIndex - 1]
    }
    if (currentIndex < allArticles.data.length - 1) {
      nextArticle.value = allArticles.data[currentIndex + 1]
    }
    
  } catch (err) {
    error.value = err.message || 'Ошибка загрузки статьи'
  } finally {
    loading.value = false
  }
}

// Обновление мета-тегов для SEO
const updateMetaTags = () => {
  if (!article.value) return
  
  const title = article.value.attributes.seo?.title || article.value.attributes.title
  const description = article.value.attributes.seo?.description || article.value.attributes.excerpt
  
  document.title = `${title} | Новостной портал`
  
  const metaTitle = document.querySelector('meta[name="title"]')
  const metaDescription = document.querySelector('meta[name="description"]')
  const ogTitle = document.querySelector('meta[property="og:title"]')
  const ogDescription = document.querySelector('meta[property="og:description"]')
  const ogImage = document.querySelector('meta[property="og:image"]')
  
  if (metaTitle) metaTitle.content = title
  if (metaDescription) metaDescription.content = description
  if (ogTitle) ogTitle.content = title
  if (ogDescription) ogDescription.content = description
  if (ogImage && article.value.attributes.coverImage?.data) {
    ogImage.content = getImageUrl(article.value.attributes.coverImage.data.attributes.url)
  }
}

onMounted(() => {
  loadArticle()
})

watch(() => route.params.id, () => {
  loadArticle()
})

watch(() => article.value, () => {
  updateMetaTags()
})
</script>

<style scoped>
.article-view {
  padding: 20px 0;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 50px 20px;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.breadcrumbs {
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

.breadcrumbs a {
  color: #007bff;
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.breadcrumbs span:last-child {
  color: #333;
  font-weight: 500;
}

.article-cover {
  margin-bottom: 30px;
  border-radius: 10px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
}

.article-header {
  margin-bottom: 30px;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #666;
}

.category {
  background: #007bff;
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 500;
}

.featured-badge {
  background: #ffc107;
  color: #333;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 500;
}

.article-title {
  font-size: 2.5rem;
  margin-bottom: 20px;
  line-height: 1.2;
  color: #333;
}

.article-author {
  margin-top: 20px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.author-avatar {
  width: 50px;
  height: 50px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 500;
  color: #333;
}

.author-email {
  font-size: 14px;
  color: #666;
}

.article-excerpt {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.article-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 40px;
}

.article-content >>> h2 {
  font-size: 1.8rem;
  margin: 30px 0 15px;
  color: #333;
}

.article-content >>> h3 {
  font-size: 1.5rem;
  margin: 25px 0 12px;
  color: #333;
}

.article-content >>> p {
  margin-bottom: 15px;
}

.article-content >>> a {
  color: #007bff;
  text-decoration: none;
}

.article-content >>> a:hover {
  text-decoration: underline;
}

.article-content >>> img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 20px 0;
}

.article-content >>> blockquote {
  border-left: 4px solid #007bff;
  padding-left: 20px;
  margin: 20px 0;
  font-style: italic;
  color: #666;
}

.article-content >>> code {
  background: #f4f4f4;
  padding: 2px 5px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.article-content >>> pre {
  background: #282c34;
  color: white;
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 20px 0;
}

.article-content >>> ul,
.article-content >>> ol {
  margin: 15px 0;
  padding-left: 20px;
}

.article-content >>> li {
  margin-bottom: 8px;
}

.article-tags {
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.article-tags h3 {
  margin-bottom: 10px;
  color: #333;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background: #e9ecef;
  color: #495057;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag:hover {
  background: #007bff;
  color: white;
}

.article-seo {
  background: #e8f4fd;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  font-size: 14px;
  color: #333;
}

.article-actions {
  display: flex;
  gap: 10px;
  margin: 30px 0;
  padding: 20px 0;
  border-top: 1px solid #eee;
}

.btn-warning {
  background: #ffc107;
  color: #333;
}

.similar-articles {
  margin: 40px 0;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.similar-articles h2 {
  margin-bottom: 20px;
  color: #333;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.similar-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.similar-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.similar-card a {
  text-decoration: none;
  color: inherit;
}

.similar-card h4 {
  margin-bottom: 10px;
  color: #333;
}

.similar-card p {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.article-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.nav-link {
  max-width: 45%;
  padding: 15px;
  text-decoration: none;
  color: #007bff;
  border: 1px solid #007bff;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: #007bff;
  color: white;
}

.nav-link.prev {
  text-align: left;
}

.nav-link.next {
  text-align: right;
}

@media (max-width: 768px) {
  .article-title {
    font-size: 1.8rem;
  }
  
  .article-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .article-actions {
    flex-wrap: wrap;
  }
  
  .article-navigation {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav-link {
    max-width: 100%;
  }
}
</style>