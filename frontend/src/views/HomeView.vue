<template>
  <div class="home">
    <h1 class="text-center my-4">Новостной портал</h1>
    
    <div class="container">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <div class="card">
            <div class="card-header bg-primary text-white">
              <h2 class="mb-0">Отладка подключения</h2>
            </div>
            <div class="card-body">
              <div v-if="loading">Загрузка данных...</div>
              <div v-else>
                <p><strong>Статус:</strong> {{ status }}</p>
                <p><strong>Статей получено:</strong> {{ articles.length }}</p>
                <p><strong>Ошибка:</strong> {{ error || 'Нет' }}</p>
                
                <button @click="testDirect" class="btn btn-info mt-3">
                  Тест прямого запроса
                </button>
                
                <div v-if="rawData" class="mt-3">
                  <h5>Сырой ответ API:</h5>
                  <pre class="bg-dark text-light p-3 rounded">{{ rawData }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const articles = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const status = ref('')
const rawData = ref<string>('')

const loadArticles = async () => {
  loading.value = true
  error.value = ''
  status.value = ''
  rawData.value = ''
  
  try {
    status.value = 'Отправка запроса...'
    console.log('Отправляю запрос к Strapi...')
    
    const response = await fetch('http://localhost:1337/api/articles')
    
    status.value = `Получен ответ: ${response.status} ${response.statusText}`
    console.log('Ответ:', response.status, response.statusText)
    
    const text = await response.text()
    console.log('Сырой текст ответа:', text)
    rawData.value = text
    
    if (!response.ok) {
      throw new Error(`HTTP ошибка: ${response.status}`)
    }
    
    const data = JSON.parse(text)
    console.log('Парсинг JSON:', data)
    
    articles.value = data.data || []
    status.value = `Успех! Статей: ${articles.value.length}`
    
  } catch (err: any) {
    error.value = `Ошибка: ${err.message}`
    console.error('Полная ошибка:', err)
    status.value = 'Ошибка'
  } finally {
    loading.value = false
  }
}

const testDirect = async () => {
  try {
    loading.value = true
    const response = await fetch('http://localhost:1337/api/articles')
    const text = await response.text()
    rawData.value = text
    
    // Попробуем разные варианты парсинга
    console.log('Прямой тест - текст:', text.substring(0, 200))
    
    try {
      const data = JSON.parse(text)
      console.log('Прямой тест - JSON:', data)
      articles.value = data.data || []
      status.value = `Прямой тест: ${articles.value.length} статей`
    } catch (parseError) {
      console.error('Ошибка парсинга JSON:', parseError)
      error.value = 'Невалидный JSON'
    }
    
  } catch (err) {
    console.error('Ошибка запроса:', err)
    error.value = `Запрос не удался: ${err}`
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
pre {
  max-height: 300px;
  overflow-y: auto;
  font-size: 12px;
}
</style>