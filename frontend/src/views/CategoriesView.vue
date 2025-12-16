<template>
  <div class="categories-view">
    <div class="container">
      <div class="header">
        <h1>Управление категориями</h1>
        <p>Создание, редактирование и удаление категорий</p>
      </div>

      <div v-if="!authStore.isEditor" class="access-denied">
        <h2>⚠️ Доступ запрещен</h2>
        <p>У вас недостаточно прав для управления категориями.</p>
        <router-link to="/" class="btn btn-primary">Вернуться на главную</router-link>
      </div>

      <div v-else class="categories-container">
        <!-- Форма создания категории -->
        <div class="create-category">
          <h2>Создать новую категорию</h2>
          <form @submit.prevent="createCategory" class="category-form">
            <div class="form-group">
              <label for="name">Название категории *</label>
              <input
                id="name"
                v-model="newCategory.name"
                type="text"
                :class="['form-control', { 'is-invalid': errors.name }]"
                placeholder="Введите название категории"
                required
              />
              <div v-if="errors.name" class="invalid-feedback">
                {{ errors.name }}
              </div>
            </div>

            <div class="form-group">
              <label for="slug">URL категории</label>
              <div class="slug-input">
                <span class="slug-prefix">/category/</span>
                <input
                  id="slug"
                  v-model="newCategory.slug"
                  type="text"
                  :class="['form-control', { 'is-invalid': errors.slug }]"
                  placeholder="url-kategorii"
                />
              </div>
              <div v-if="errors.slug" class="invalid-feedback">
                {{ errors.slug }}
              </div>
              <small class="form-text">Оставьте пустым для автогенерации</small>
            </div>

            <div class="form-group">
              <label for="description">Описание</label>
              <textarea
                id="description"
                v-model="newCategory.description"
                class="form-control"
                placeholder="Краткое описание категории"
                rows="3"
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary" :disabled="creating">
              {{ creating ? 'Создание...' : 'Создать категорию' }}
            </button>
          </form>
        </div>

        <!-- Список категорий -->
        <div class="categories-list">
          <h2>Существующие категории</h2>
          
          <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>Загрузка категорий...</p>
          </div>

          <div v-else-if="error" class="error">
            <p>{{ error }}</p>
            <button @click="fetchCategories" class="btn btn-outline">Повторить</button>
          </div>

          <div v-else-if="categories.length === 0" class="no-categories">
            <p>Категории не найдены</p>
          </div>

          <div v-else class="categories-grid">
            <div 
              v-for="category in categories" 
              :key="category.id"
              class="category-card"
            >
              <div class="category-header">
                <h3>{{ category.attributes.name }}</h3>
                <span class="articles-count">
                  {{ category.attributes.articles?.data?.length || 0 }} статей
                </span>
              </div>
              
              <div class="category-body">
                <p v-if="category.attributes.description" class="category-description">
                  {{ category.attributes.description }}
                </p>
                <div class="category-meta">
                  <span class="slug">URL: {{ category.attributes.slug }}</span>
                  <span class="created">
                    Создана: {{ formatDate(category.attributes.createdAt) }}
                  </span>
                </div>
              </div>

              <div class="category-actions">
                <button 
                  @click="editCategory(category)"
                  class="btn btn-sm btn-outline"
                >
                  Редактировать
                </button>
                <button 
                  @click="deleteCategory(category.id)"
                  class="btn btn-sm btn-danger"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Модальное окно редактирования -->
        <div v-if="editingCategory" class="modal-overlay" @click="closeModal">
          <div class="modal" @click.stop>
            <div class="modal-header">
              <h2>Редактирование категории</h2>
              <button @click="closeModal" class="modal-close">×</button>
            </div>
            <form @submit.prevent="updateCategory" class="modal-form">
              <div class="form-group">
                <label for="edit-name">Название категории</label>
                <input
                  id="edit-name"
                  v-model="editingCategory.attributes.name"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="form-group">
                <label for="edit-slug">URL категории</label>
                <input
                  id="edit-slug"
                  v-model="editingCategory.attributes.slug"
                  type="text"
                  class="form-control"
                  required
                />
              </div>
              <div class="form-group">
                <label for="edit-description">Описание</label>
                <textarea
                  id="edit-description"
                  v-model="editingCategory.attributes.description"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>
              <div class="modal-actions">
                <button type="button" @click="closeModal" class="btn btn-outline">
                  Отмена
                </button>
                <button type="submit" class="btn btn-primary" :disabled="updating">
                  {{ updating ? 'Сохранение...' : 'Сохранить' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/auth'
import { categoriesAPI } from '@/api/strapi'

const authStore = useAuthStore()

const categories = ref([])
const loading = ref(false)
const error = ref('')
const creating = ref(false)
const updating = ref(false)
const editingCategory = ref(null)

const newCategory = reactive({
  name: '',
  slug: '',
  description: ''
})

const errors = reactive({
  name: '',
  slug: ''
})

const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'dd.MM.yyyy')
  } catch {
    return dateString
  }
}

const validateCategory = () => {
  let isValid = true
  errors.name = ''
  errors.slug = ''

  if (!newCategory.name.trim()) {
    errors.name = 'Введите название категории'
    isValid = false
  }

  if (newCategory.slug && !/^[a-z0-9-]+$/.test(newCategory.slug)) {
    errors.slug = 'URL может содержать только латинские буквы, цифры и дефисы'
    isValid = false
  }

  return isValid
}

const fetchCategories = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await categoriesAPI.getCategories()
    categories.value = response.data.data
  } catch (err) {
    error.value = 'Ошибка загрузки категорий'
    console.error('Failed to fetch categories:', err)
  } finally {
    loading.value = false
  }
}

const createCategory = async () => {
  if (!validateCategory()) return

  creating.value = true
  try {
    const categoryData = {
      name: newCategory.name,
      description: newCategory.description
    }

    if (newCategory.slug) {
      categoryData.slug = newCategory.slug
    }

    await categoriesAPI.createCategory(categoryData)
    
    // Очищаем форму
    newCategory.name = ''
    newCategory.slug = ''
    newCategory.description = ''
    
    // Обновляем список
    await fetchCategories()
    
    if (window.showToast) {
      window.showToast('success', 'Категория создана', 'Новая категория успешно создана')
    }
  } catch (err) {
    if (window.showToast) {
      window.showToast('error', 'Ошибка', 'Не удалось создать категорию')
    }
    console.error('Failed to create category:', err)
  } finally {
    creating.value = false
  }
}

const editCategory = (category) => {
  editingCategory.value = JSON.parse(JSON.stringify(category))
}

const updateCategory = async () => {
  if (!editingCategory.value) return

  updating.value = true
  try {
    const categoryData = {
      name: editingCategory.value.attributes.name,
      slug: editingCategory.value.attributes.slug,
      description: editingCategory.value.attributes.description || ''
    }

    await categoriesAPI.updateCategory(editingCategory.value.id, categoryData)
    
    // Обновляем список
    await fetchCategories()
    
    // Закрываем модальное окно
    closeModal()
    
    if (window.showToast) {
      window.showToast('success', 'Сохранено', 'Категория успешно обновлена')
    }
  } catch (err) {
    if (window.showToast) {
      window.showToast('error', 'Ошибка', 'Не удалось обновить категорию')
    }
    console.error('Failed to update category:', err)
  } finally {
    updating.value = false
  }
}

const deleteCategory = async (id) => {
  if (!confirm('Вы уверены, что хотите удалить эту категорию? Статьи в этой категории не будут удалены.')) {
    return
  }

  try {
    await categoriesAPI.deleteCategory(id)
    
    // Обновляем список
    await fetchCategories()
    
    if (window.showToast) {
      window.showToast('success', 'Удалено', 'Категория успешно удалена')
    }
  } catch (err) {
    if (window.showToast) {
      window.showToast('error', 'Ошибка', 'Не удалось удалить категорию')
    }
    console.error('Failed to delete category:', err)
  }
}

const closeModal = () => {
  editingCategory.value = null
}

onMounted(() => {
  if (authStore.isEditor) {
    fetchCategories()
  }
})
</script>

<style scoped>
.categories-view {
  padding: 30px 0;
  background: #f8f9fa;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.header h1 {
  color: #333;
  margin-bottom: 10px;
}

.header p {
  color: #666;
  font-size: 1.1rem;
}

.access-denied {
  text-align: center;
  padding: 50px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.access-denied h2 {
  color: #ffc107;
  margin-bottom: 15px;
}

.access-denied p {
  color: #666;
  margin-bottom: 20px;
}

.categories-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
}

@media (max-width: 992px) {
  .categories-container {
    grid-template-columns: 1fr;
  }
}

.create-category {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.create-category h2 {
  margin: 0 0 20px;
  color: #333;
  font-size: 1.3rem;
}

.category-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.form-control {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 12px;
}

.form-text {
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
  border-radius: 6px 0 0 6px;
  color: #666;
  font-size: 14px;
}

.slug-input .form-control {
  border-radius: 0 6px 6px 0;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-outline {
  background: white;
  color: #007bff;
  border: 1px solid #007bff;
}

.btn-outline:hover {
  background: #007bff;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.categories-list {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.categories-list h2 {
  margin: 0 0 20px;
  color: #333;
  font-size: 1.3rem;
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

.no-categories {
  text-align: center;
  padding: 40px;
  background: #f5f5f5;
  border-radius: 8px;
  color: #666;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.category-card {
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: #007bff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.category-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.articles-count {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.category-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
  font-size: 14px;
}

.category-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 15px;
  font-size: 12px;
  color: #888;
}

.slug {
  font-family: monospace;
  background: #f8f9fa;
  padding: 3px 6px;
  border-radius: 4px;
}

.category-actions {
  display: flex;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal {
  background: white;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #f8f9fa;
  color: #333;
}

.modal-form {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}
</style>