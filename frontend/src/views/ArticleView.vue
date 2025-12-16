<template>
  <div class="article-view" v-if="article">
    <div class="container py-5">
      <!-- Хлебные крошки -->
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/">Главная</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ article.attributes.title }}</li>
        </ol>
      </nav>

      <!-- Заголовок статьи -->
      <div class="row">
        <div class="col-lg-8 offset-lg-2">
          <div class="card border-0">
            <div class="card-body p-0">
              <h1 class="display-5 fw-bold mb-3">{{ article.attributes.title }}</h1>
              
              <div class="d-flex flex-wrap gap-2 mb-4">
                <span class="badge bg-primary">
                  <i class="bi bi-calendar"></i> {{ formatDate(article.attributes.publishedAt) }}
                </span>
                <span class="badge bg-secondary">
                  <i class="bi bi-clock"></i> {{ article.attributes.readingTime }} мин чтения
                </span>
                <span class="badge bg-info">
                  <i class="bi bi-eye"></i> {{ article.attributes.views }} просмотров
                </span>
                <span v-if="article.attributes.isFeatured" class="badge bg-warning">
                  <i class="bi bi-star"></i> Избранная статья
                </span>
              </div>

              <!-- Краткое описание -->
              <div class="lead mb-4 p-3 bg-light rounded">
                {{ article.attributes.excerpt }}
              </div>

              <!-- Контент статьи -->
              <div class="article-content mb-5">
                <div v-for="(block, index) in article.attributes.content" :key="index">
                  <p v-if="block.type === 'paragraph'" class="mb-3">
                    <span v-for="(child, childIndex) in block.children" :key="childIndex">
                      {{ child.text }}
                    </span>
                  </p>
                </div>
              </div>

              <!-- Теги -->
              <div v-if="article.attributes.tags && article.attributes.tags.length" class="mb-4">
                <h6 class="mb-2"><i class="bi bi-tags"></i> Теги:</h6>
                <div>
                  <span v-for="tag in article.attributes.tags" :key="tag" class="badge bg-light text-dark me-2 mb-2">
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Кнопки действий -->
              <div class="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
                <button class="btn btn-outline-secondary" @click="$router.go(-1)">
                  <i class="bi bi-arrow-left"></i> Назад
                </button>
                
                <div v-if="isEditor" class="btn-group">
                  <button class="btn btn-outline-primary">
                    <i class="bi bi-pencil"></i> Редактировать
                  </button>
                  <button class="btn btn-outline-danger">
                    <i class="bi bi-trash"></i> Удалить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Загрузка...</span>
    </div>
    <p class="mt-3">Загрузка статьи...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()
const article = ref<any>(null)

const isEditor = computed(() => userStore.isEditor)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(async () => {
  const articleId = route.params.id
  try {
    const response = await fetch(`http://localhost:1337/api/articles/${articleId}`)
    const data = await response.json()
    article.value = data.data
  } catch (error) {
    console.error('Ошибка загрузки статьи:', error)
  }
})
</script>

<style scoped>
.article-view {
  min-height: 70vh;
}

.article-content {
  font-size: 1.1rem;
  line-height: 1.8;
}

.article-content p {
  text-align: justify;
}
</style>