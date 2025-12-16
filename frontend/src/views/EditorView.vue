<template>
  <div class="editor-view">
    <div class="container">
      <div class="editor-header">
        <h1>{{ isEditMode ? 'Редактирование статьи' : 'Создание новой статьи' }}</h1>
        <p>Заполните форму ниже для публикации статьи</p>
      </div>

      <div v-if="!authStore.isEditor" class="alert alert-warning">
        <h3>⚠️ Доступ запрещен</h3>
        <p>У вас недостаточно прав для создания или редактирования статей.</p>
        <p>Только пользователи с ролью "Редактор" или "Администратор" имеют доступ к редактору статей.</p>
        <router-link to="/" class="btn btn-primary">Вернуться на главную</router-link>
      </div>

      <div v-else class="editor-container">
        <!-- Форма статьи -->
        <form @submit.prevent="handleSubmit" class="article-form">
          <div class="form-section">
            <h3>Основная информация</h3>
            
            <div class="form-group">
              <label for="title">Заголовок статьи *</label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                :class="['form-control', { 'is-invalid': errors.title }]"
                placeholder="Введите заголовок статьи"
                required
              />
              <div v-if="errors.title" class="invalid-feedback">
                {{ errors.title }}
              </div>
              <small class="form-text">Максимум 200 символов</small>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="slug">URL статьи</label>
                <div class="slug-input">
                  <span class="slug-prefix">/article/</span>
                  <input
                    id="slug"
                    v-model="form.slug"
                    type="text"
                    :class="['form-control', { 'is-invalid': errors.slug }]"
                    placeholder="url-stati"
                  />
                </div>
                <div v-if="errors.slug" class="invalid-feedback">
                  {{ errors.slug }}
                </div>
                <small class="form-text">Оставьте пустым для автогенерации</small>
              </div>

              <div class="form-group">
                <label for="category">Категория *</label>
                <select
                  id="category"
                  v-model="form.category"
                  :class="['form-control', { 'is-invalid': errors.category }]"
                  required
                >
                  <option value="">Выберите категорию</option>
                  <option 
                    v-for="category in categories" 
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.attributes.name }}
                  </option>
                </select>
                <div v-if="errors.category" class="invalid-feedback">
                  {{ errors.category }}
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="excerpt">Краткое описание *</label>
              <textarea
                id="excerpt"
                v-model="form.excerpt"
                :class="['form-control', { 'is-invalid': errors.excerpt }]"
                placeholder="Краткое описание статьи, которое будет отображаться в списках"
                rows="3"
                required
                maxlength="300"
              ></textarea>
              <div v-if="errors.excerpt" class="invalid-feedback">
                {{ errors.excerpt }}
              </div>
              <small class="form-text">{{ form.excerpt.length }}/300 символов</small>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="readingTime">Время чтения (минуты)</label>
                <input
                  id="readingTime"
                  v-model.number="form.readingTime"
                  type="number"
                  min="1"
                  max="60"
                  class="form-control"
                  placeholder="5"
                />
                <small class="form-text">Примерное время чтения статьи</small>
              </div>

              <div class="form-group">
                <label class="checkbox-label">
                  <input v-model="form.isFeatured" type="checkbox" />
                  <span>Избранная статья</span>
                </label>
                <small class="form-text">Отображать в разделе "Избранное"</small>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Содержимое статьи</h3>
            
            <div class="form-group">
              <label for="content">Текст статьи *</label>
              <textarea
                id="content"
                v-model="form.content"
                :class="['form-control', 'content-editor', { 'is-invalid': errors.content }]"
                placeholder="Начните писать вашу статью здесь..."
                rows="15"
                required
              ></textarea>
              <div v-if="errors.content" class="invalid-feedback">
                {{ errors.content }}
              </div>
              <small class="form-text">Поддерживается Markdown разметка</small>
            </div>
          </div>

          <div class="form-section">
            <h3>Медиа и настройки</h3>
            
            <!-- Загрузка обложки -->
            <div class="form-group">
              <label>Обложка статьи</label>
              <div class="image-upload">
                <div v-if="coverImagePreview" class="image-preview">
                  <img :src="coverImagePreview" alt="Preview" />
                  <button 
                    type="button" 
                    class="remove-image"
                    @click="removeCoverImage"
                  >
                    ×
                  </button>
                </div>
                
                <div v-else class="upload-area" @click="triggerFileInput">
                  <div class="upload-icon">📷</div>
                  <p>Нажмите для загрузки обложки</p>
                  <small>Рекомендуемый размер: 1200×630px</small>
                </div>
                
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="file-input"
                />
              </div>
            </div>

            <!-- Теги -->
            <div class="form-group">
              <label for="tags">Теги</label>
              <div class="tags-input">
                <input
                  id="tags"
                  v-model="tagInput"
                  type="text"
                  class="form-control"
                  placeholder="Введите тег и нажмите Enter"
                  @keydown.enter.prevent="addTag"
                />
                <div class="tags-list">
                  <span 
                    v-for="(tag, index) in form.tags" 
                    :key="index"
                    class="tag"
                  >
                    {{ tag }}
                    <button 
                      type="button" 
                      class="tag-remove"
                      @click="removeTag(index)"
                    >
                      ×
                    </button>
                  </span>
                </div>
              </div>
              <small class="form-text">Добавьте до 10 тегов через Enter</small>
            </div>
          </div>

          <div class="form-section">
            <h3>SEO настройки</h3>
            
            <div class="form-group">
              <label for="seoTitle">SEO Title</label>
              <input
                id="seoTitle"
                v-model="form.seo.title"
                type="text"
                class="form-control"
                placeholder="SEO заголовок для поисковых систем"
                maxlength="60"
              />
              <small class="form-text">{{ form.seo.title.length }}/60 символов</small>
            </div>

            <div class="form-group">
              <label for="seoDescription">SEO Description</label>
              <textarea
                id="seoDescription"
                v-model="form.seo.description"
                class="form-control"
                placeholder="Мета-описание для поисковых систем"
                rows="3"
                maxlength="160"
              ></textarea>
              <small class="form-text">{{ form.seo.description.length }}/160 символов</small>
            </div>
          </div>

          <!-- Действия -->
          <div class="form-actions">
            <div class="action-buttons">
              <button 
                type="button" 
                @click="saveDraft"
                class="btn btn-outline"
                :disabled="saving"
              >
                {{ saving ? 'Сохранение...' : 'Сохранить черновик' }}
              </button>
              
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="saving"
              >
                {{ isEditMode ? 'Обновить статью' : 'Опубликовать статью' }}
              </button>
              
              <button 
                v-if="isEditMode && article?.attributes?.publishedAt"
                type="button" 
                @click="unpublishArticle"
                class="btn btn-warning"
                :disabled="saving"
              >
                Снять с публикации
              </button>
              
              <button 
                v-if="isEditMode"
                type="button" 
                @click="deleteArticle"
                class="btn btn-danger"
                :disabled="saving"
              >
                Удалить статью
              </button>
            </div>

            <div class="form-help">
              <p><strong>*</strong> — обязательные поля для заполнения</p>
              <p>Статья будет опубликована сразу после сохранения</p>
            </div>
          </div>
        </form>

        <!-- Предпросмотр -->
        <div class="preview-section" v-if="showPreview">
          <h3>Предпросмотр статьи</h3>
          <div class="preview-content">
            <div v-if="form.title" class="preview-title">
              <h2>{{ form.title }}</h2>
            </div>
            
            <div v-if="coverImagePreview" class="preview-image">
              <img :src="coverImagePreview" alt="Preview" />
            </div>
            
            <div v-if="form.excerpt" class="preview-excerpt">
              <p>{{ form.excerpt }}</p>
            </div>
            
            <div v-if="form.content" class="preview-content-text">
              <pre>{{ form.content }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useArticlesStore } from '@/stores/articles'
import { uploadAPI } from '@/api/strapi'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const articlesStore = useArticlesStore()

const isEditMode = computed(() => !!route.params.id)
const showPreview = ref(false)
const saving = ref(false)
const tagInput = ref('')
const fileInput = ref(null)
const coverImagePreview = ref('')
const coverImageFile = ref(null)
const article = ref(null)

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: '',
  readingTime: 5,
  isFeatured: false,
  tags: [],
  seo: {
    title: '',
    description: ''
  },
  publishedAt: new Date().toISOString()
})

const errors = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: ''
})

// Загрузка данных
const loadArticle = async () => {
  if (!isEditMode.value) return
  
  try {
    article.value = await articlesStore.fetchArticle(route.params.id)
    
    // Заполняем форму данными статьи
    form.title = article.value.attributes.title
    form.slug = article.value.attributes.slug
    form.excerpt = article.value.attributes.excerpt
    form.content = article.value.attributes.content
    form.category = article.value.attributes.category?.data?.id || ''
    form.readingTime = article.value.attributes.readingTime || 5
    form.isFeatured = article.value.attributes.isFeatured || false
    form.tags = article.value.attributes.tags || []
    form.seo = article.value.attributes.seo || { title: '', description: '' }
    
    // Загрузка изображения
    if (article.value.attributes.coverImage?.data) {
      coverImagePreview.value = `${import.meta.env.VITE_STRAPI_URL}${article.value.attributes.coverImage.data.attributes.url}`
    }
    
  } catch (error) {
    console.error('Failed to load article:', error)
    alert('Ошибка загрузки статьи')
    router.push('/editor')
  }
}

const categories = computed(() => articlesStore.categories)

// Валидация формы
const validateForm = () => {
  let isValid = true
  
  // Сброс ошибок
  Object.keys(errors).forEach(key => errors[key] = '')
  
  if (!form.title.trim()) {
    errors.title = 'Введите заголовок статьи'
    isValid = false
  } else if (form.title.length > 200) {
    errors.title = 'Заголовок не должен превышать 200 символов'
    isValid = false
  }
  
  if (form.slug && !/^[a-z0-9-]+$/.test(form.slug)) {
    errors.slug = 'URL может содержать только латинские буквы, цифры и дефисы'
    isValid = false
  }
  
  if (!form.excerpt.trim()) {
    errors.excerpt = 'Введите краткое описание'
    isValid = false
  } else if (form.excerpt.length > 300) {
    errors.excerpt = 'Описание не должно превышать 300 символов'
    isValid = false
  }
  
  if (!form.content.trim()) {
    errors.content = 'Введите текст статьи'
    isValid = false
  }
  
  if (!form.category) {
    errors.category = 'Выберите категорию'
    isValid = false
  }
  
  return isValid
}

// Работа с тегами
const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !form.tags.includes(tag) && form.tags.length < 10) {
    form.tags.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (index) => {
  form.tags.splice(index, 1)
}

// Работа с изображениями
const triggerFileInput = () => {
  fileInput.value.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    alert('Пожалуйста, выберите изображение')
    return
  }
  
  if (file.size > 5 * 1024 * 1024) {
    alert('Изображение должно быть меньше 5MB')
    return
  }
  
  coverImageFile.value = file
  
  const reader = new FileReader()
  reader.onload = (e) => {
    coverImagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeCoverImage = () => {
  coverImagePreview.value = ''
  coverImageFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Загрузка изображения на сервер
const uploadImage = async () => {
  if (!coverImageFile.value) return null
  
  try {
    const response = await uploadAPI.uploadImage(coverImageFile.value)
    return response.data[0].id
  } catch (error) {
    console.error('Image upload failed:', error)
    alert('Ошибка загрузки изображения')
    return null
  }
}

// Основные действия
const handleSubmit = async () => {
  if (!validateForm()) return
  
  saving.value = true
  
  try {
    // Подготовка данных
    const articleData = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      readingTime: form.readingTime,
      isFeatured: form.isFeatured,
      tags: form.tags,
      seo: form.seo,
      category: form.category,
      author: authStore.user.id
    }
    
    // Добавляем slug если указан
    if (form.slug) {
      articleData.slug = form.slug
    }
    
    // Загрузка изображения
    if (coverImageFile.value) {
      const imageId = await uploadImage()
      if (imageId) {
        articleData.coverImage = imageId
      }
    }
    
    // Сохранение статьи
    if (isEditMode.value) {
      await articlesStore.updateArticle(route.params.id, articleData)
      alert('Статья успешно обновлена!')
    } else {
      articleData.publishedAt = new Date().toISOString()
      await articlesStore.createArticle(articleData)
      alert('Статья успешно опубликована!')
    }
    
    // Перенаправление
    router.push('/')
    
  } catch (error) {
    console.error('Failed to save article:', error)
    alert('Ошибка сохранения статьи')
  } finally {
    saving.value = false
  }
}

const saveDraft = async () => {
  if (!validateForm()) return
  
  saving.value = true
  
  try {
    const articleData = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      readingTime: form.readingTime,
      isFeatured: form.isFeatured,
      tags: form.tags,
      seo: form.seo,
      category: form.category,
      author: authStore.user.id,
      publishedAt: null // Сохраняем как черновик
    }
    
    if (isEditMode.value) {
      await articlesStore.updateArticle(route.params.id, articleData)
      alert('Черновик сохранен!')
    } else {
      await articlesStore.createArticle(articleData)
      alert('Черновик сохранен!')
    }
    
  } catch (error) {
    console.error('Failed to save draft:', error)
    alert('Ошибка сохранения черновика')
  } finally {
    saving.value = false
  }
}

const unpublishArticle = async () => {
  if (!confirm('Снять статью с публикации?')) return
  
  try {
    await articlesStore.updateArticle(route.params.id, {
      publishedAt: null
    })
    alert('Статья снята с публикации')
    router.push('/editor')
  } catch (error) {
    alert('Ошибка')
  }
}

const deleteArticle = async () => {
  if (!confirm('Удалить статью? Это действие нельзя отменить.')) return
  
  try {
    await articlesStore.deleteArticle(route.params.id)
    alert('Статья удалена')
    router.push('/')
  } catch (error) {
    alert('Ошибка удаления статьи')
  }
}

// Инициализация
onMounted(async () => {
  // Загрузка категорий
  await articlesStore.fetchCategories()
  
  // Если режим редактирования - загружаем статью
  if (isEditMode.value) {
    await loadArticle()
  }
})
</script>

<style scoped>
.editor-view {
  padding: 20px 0;
  background: #f8f9fa;
  min-height: calc(100vh - 200px);
}

.editor-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.editor-header h1 {
  color: #333;
  margin-bottom: 10px;
}

.editor-header p {
  color: #666;
  font-size: 1.1rem;
}

.alert {
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
}

.alert-warning {
  background-color: #fff3cd;
  border-color: #ffeaa7;
  color: #856404;
}

.alert-warning h3 {
  margin-bottom: 10px;
}

.editor-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

@media (max-width: 992px) {
  .editor-container {
    grid-template-columns: 1fr;
  }
}

.article-form {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3rem;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.is-invalid {
  border-color: #dc3545;
}

.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.invalid-feedback {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
}

.form-text {
  display: block;
  margin-top: 5px;
  color: #6c757d;
  font-size: 12px;
}

.slug-input {
  display: flex;
}

.slug-prefix {
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-right: none;
  padding: 10px;
  border-radius: 4px 0 0 4px;
  color: #666;
}

.slug-input .form-control {
  border-radius: 0 4px 4px 0;
  flex: 1;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.content-editor {
  font-family: 'Courier New', monospace;
  line-height: 1.6;
  resize: vertical;
}

/* Стили для загрузки изображений */
.image-upload {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-upload:hover {
  border-color: #007bff;
  background: #f8f9fa;
}

.upload-area {
  padding: 20px;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.upload-area p {
  margin: 10px 0;
  color: #666;
}

.upload-area small {
  color: #999;
}

.file-input {
  display: none;
}

.image-preview {
  position: relative;
  max-width: 300px;
  margin: 0 auto;
}

.image-preview img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.remove-image {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-image:hover {
  background: #c82333;
  transform: scale(1.1);
}

/* Стили для тегов */
.tags-input {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}

.tags-input .form-control {
  border: none;
  padding: 5px 0;
  margin-bottom: 10px;
}

.tags-input .form-control:focus {
  box-shadow: none;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  display: inline-flex;
  align-items: center;
  background: #007bff;
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
}

.tag-remove {
  background: none;
  border: none;
  color: white;
  margin-left: 5px;
  cursor: pointer;
  font-size: 16px;
  padding: 0 5px;
}

.tag-remove:hover {
  color: #ffcccb;
}

/* Действия формы */
.form-actions {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-outline {
  background: white;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-warning {
  background: #ffc107;
  color: #333;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-help {
  color: #6c757d;
  font-size: 14px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.form-help p {
  margin: 5px 0;
}

/* Предпросмотр */
.preview-section {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
}

.preview-section h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.preview-content {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
}

.preview-title h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.preview-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 15px 0;
}

.preview-excerpt p {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 15px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 4px;
}

.preview-content-text pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;
}
</style>