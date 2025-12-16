<template>
  <div class="home">
    <div class="container py-5">
      <h1 class="text-center mb-4">Новостной портал</h1>
      
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Загрузка...</span>
        </div>
        <p class="mt-2">Загрузка новостей...</p>
      </div>
      
      <div v-else>
        <div class="row">
          <div class="col-md-4 mb-3" v-for="article in articles" :key="article.id">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">{{ article.attributes?.title || 'Без названия' }}</h5>
                <p class="card-text">{{ article.attributes?.excerpt || 'Нет описания' }}</p>
                
                <div class="mt-3">
                  <p class="mb-1">
                    <small class="text-muted">
                      <strong>ID:</strong> {{ article.id }}
                    </small>
                  </p>
                  <p class="mb-1">
                    <small class="text-muted">
                      <strong>Просмотры:</strong> {{ article.attributes?.views || 0 }}
                    </small>
                  </p>
                  <p class="mb-0">
                    <small class="text-muted">
                      <strong>Теги:</strong> {{ article.attributes?.tags?.join(', ') || 'нет' }}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-4">
          <p>Всего статей: {{ articles.length }}</p>
          <button @click="loadArticles" class="btn btn-primary">Обновить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const articles = ref<any[]>([])
const loading = ref(true)

const loadArticles = async () => {
  loading.value = true
  
  try {
    console.log('Загружаю статьи...')
    const response = await fetch('http://localhost:1337/api/articles')
    
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Данные от API:', data)
    
    // Просто принимаем данные как есть
    articles.value = data.data || []
    
    console.log('Статьи в массиве:', articles.value)
    
  } catch (err) {
    console.error('Ошибка:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArticles()
})
</script>

<style scoped>
.home {
  min-height: 70vh;
}
.card {
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
</style>