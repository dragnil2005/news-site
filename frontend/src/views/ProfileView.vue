<template>
  <div class="profile-view">
    <div class="container">
      <div class="profile-header">
        <div class="user-avatar-large">
          {{ userInitials }}
        </div>
        <div class="user-info">
          <h1>{{ user.username }}</h1>
          <p class="user-email">{{ user.email }}</p>
          <div class="user-role">
            <span class="role-badge">{{ roleName }}</span>
          </div>
          <p class="member-since">Участник с {{ formatDate(user.createdAt) }}</p>
        </div>
      </div>

      <div class="profile-content">
        <div class="profile-sidebar">
          <nav class="profile-nav">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="['nav-btn', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <div class="profile-main">
          <!-- Мои статьи -->
          <div v-if="activeTab === 'articles'" class="tab-content">
            <div class="tab-header">
              <h2>Мои статьи</h2>
              <router-link v-if="authStore.isEditor" to="/editor" class="btn btn-primary">
                + Создать статью
              </router-link>
            </div>

            <div v-if="userArticlesLoading" class="loading">
              <div class="spinner"></div>
              <p>Загрузка статей...</p>
            </div>

            <div v-else-if="userArticles.length === 0" class="empty-state">
              <p>У вас еще нет статей</p>
              <router-link v-if="authStore.isEditor" to="/editor" class="btn btn-primary">
                Создать первую статью
              </router-link>
            </div>

            <div v-else class="articles-list">
              <div v-for="article in userArticles" :key="article.id" class="profile-article-card">
                <div class="article-status">
                  <span
                    :class="[
                      'status-badge',
                      article.attributes.publishedAt ? 'published' : 'draft',
                    ]"
                  >
                    {{ article.attributes.publishedAt ? 'Опубликовано' : 'Черновик' }}
                  </span>
                  <span v-if="article.attributes.isFeatured" class="featured-badge"
                    >★ Избранное</span
                  >
                </div>

                <h3>{{ article.attributes.title }}</h3>

                <div class="article-meta">
                  <span class="date">{{
                    formatDate(article.attributes.publishedAt || article.attributes.createdAt)
                  }}</span>
                  <span class="category" v-if="article.attributes.category?.data">
                    {{ article.attributes.category.data.attributes.name }}
                  </span>
                  <span class="views">👁️ {{ article.attributes.views || 0 }}</span>
                </div>

                <p class="excerpt">{{ article.attributes.excerpt }}</p>

                <div class="article-actions">
                  <router-link :to="`/article/${article.id}`" class="btn btn-sm btn-outline">
                    Просмотр
                  </router-link>
                  <router-link
                    v-if="authStore.isEditor"
                    :to="`/editor/${article.id}`"
                    class="btn btn-sm btn-primary"
                  >
                    Редактировать
                  </router-link>
                  <button
                    v-if="authStore.isEditor && !article.attributes.publishedAt"
                    @click="publishArticle(article.id)"
                    class="btn btn-sm btn-success"
                  >
                    Опубликовать
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Статистика -->
          <div v-else-if="activeTab === 'stats'" class="tab-content">
            <h2>Статистика</h2>

            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">📝</div>
                <div class="stat-value">{{ userArticles.length }}</div>
                <div class="stat-label">Всего статей</div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">👁️</div>
                <div class="stat-value">{{ totalViews }}</div>
                <div class="stat-label">Всего просмотров</div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-value">{{ featuredArticlesCount }}</div>
                <div class="stat-label">Избранных статей</div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">📈</div>
                <div class="stat-value">{{ averageViews.toFixed(1) }}</div>
                <div class="stat-label">Средний просмотров/статья</div>
              </div>
            </div>

            <div v-if="userArticles.length > 0" class="charts-section">
              <div class="chart-container">
                <h3>Распределение по статусам</h3>
                <canvas ref="statusChart"></canvas>
              </div>

              <div class="chart-container">
                <h3>Топ статей по просмотрам</h3>
                <div class="top-articles">
                  <div
                    v-for="(article, index) in topArticles"
                    :key="article.id"
                    class="top-article-item"
                  >
                    <span class="rank">{{ index + 1 }}</span>
                    <router-link :to="`/article/${article.id}`" class="title">
                      {{ article.attributes.title }}
                    </router-link>
                    <span class="views">{{ article.attributes.views || 0 }} 👁️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Настройки -->
          <div v-else-if="activeTab === 'settings'" class="tab-content">
            <h2>Настройки профиля</h2>

            <form @submit.prevent="updateProfile" class="settings-form">
              <div class="form-section">
                <h3>Основная информация</h3>

                <div class="form-group">
                  <label for="username">Имя пользователя</label>
                  <input
                    id="username"
                    v-model="settingsForm.username"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    id="email"
                    v-model="settingsForm.email"
                    type="email"
                    class="form-control"
                    required
                  />
                </div>
              </div>

              <div class="form-section">
                <h3>Смена пароля</h3>

                <div class="form-group">
                  <label for="currentPassword">Текущий пароль</label>
                  <input
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    type="password"
                    class="form-control"
                    placeholder="Для смены пароля"
                  />
                </div>

                <div class="form-group">
                  <label for="newPassword">Новый пароль</label>
                  <input
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    type="password"
                    class="form-control"
                    placeholder="Минимум 6 символов"
                  />
                </div>

                <div class="form-group">
                  <label for="confirmPassword">Подтверждение пароля</label>
                  <input
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    class="form-control"
                  />
                </div>
              </div>

              <div class="form-section">
                <h3>Настройки уведомлений</h3>

                <div class="form-group">
                  <label class="checkbox-label">
                    <input v-model="notificationSettings.emailNotifications" type="checkbox" />
                    <span>Email уведомления о новых статьях</span>
                  </label>
                </div>

                <div class="form-group">
                  <label class="checkbox-label">
                    <input v-model="notificationSettings.commentNotifications" type="checkbox" />
                    <span>Уведомления о комментариях</span>
                  </label>
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" :disabled="updating">
                  {{ updating ? 'Сохранение...' : 'Сохранить изменения' }}
                </button>
                <button type="button" @click="logout" class="btn btn-outline">Выйти</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useArticlesStore } from '@/stores/articles'
import Chart from 'chart.js/auto'

const router = useRouter()
const authStore = useAuthStore()
const articlesStore = useArticlesStore()

const user = computed(() => authStore.user || {})
const userInitials = computed(() => {
  if (!user.value.username) return 'U'
  return user.value.username.charAt(0).toUpperCase()
})

const roleName = computed(() => {
  if (authStore.isAdmin) return 'Администратор'
  if (authStore.isEditor) return 'Редактор'
  return 'Пользователь'
})

const tabs = [
  { id: 'articles', label: 'Мои статьи' },
  { id: 'stats', label: 'Статистика' },
  { id: 'settings', label: 'Настройки' },
]

const activeTab = ref('articles')
const userArticles = ref([])
const userArticlesLoading = ref(false)
const updating = ref(false)

// Формы
const settingsForm = reactive({
  username: '',
  email: '',
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const notificationSettings = reactive({
  emailNotifications: true,
  commentNotifications: true,
})

// Загрузка статей пользователя
const loadUserArticles = async () => {
  if (!authStore.isAuthenticated) return

  userArticlesLoading.value = true
  try {
    const response = await articlesStore.fetchArticles({
      'filters[author][id][$eq]': user.value.id,
      sort: 'createdAt:desc',
      'pagination[pageSize]': 50,
    })
    userArticles.value = response.data
  } catch (error) {
    console.error('Failed to load user articles:', error)
  } finally {
    userArticlesLoading.value = false
  }
}

// Статистика
const totalViews = computed(() => {
  return userArticles.value.reduce((sum, article) => {
    return sum + (article.attributes.views || 0)
  }, 0)
})

const featuredArticlesCount = computed(() => {
  return userArticles.value.filter((article) => article.attributes.isFeatured).length
})

const averageViews = computed(() => {
  if (userArticles.value.length === 0) return 0
  return totalViews.value / userArticles.value.length
})

const publishedArticles = computed(() => {
  return userArticles.value.filter((article) => article.attributes.publishedAt)
})

const topArticles = computed(() => {
  return [...userArticles.value]
    .sort((a, b) => (b.attributes.views || 0) - (a.attributes.views || 0))
    .slice(0, 5)
})

// Методы
const formatDate = (dateString) => {
  if (!dateString) return 'Не опубликовано'
  try {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

const publishArticle = async (id) => {
  try {
    await articlesStore.publishArticle(id)
    await loadUserArticles()
    alert('Статья опубликована!')
  } catch (error) {
    alert('Ошибка публикации статьи')
  }
}

const updateProfile = async () => {
  updating.value = true
  // Здесь будет логика обновления профиля
  setTimeout(() => {
    alert('Профиль обновлен!')
    updating.value = false
  }, 1000)
}

const logout = () => {
  authStore.logout()
}

// Инициализация
onMounted(() => {
  if (authStore.user) {
    settingsForm.username = authStore.user.username
    settingsForm.email = authStore.user.email

    if (activeTab.value === 'articles') {
      loadUserArticles()
    }
  }
})

watch(
  () => activeTab.value,
  (newTab) => {
    if (newTab === 'articles') {
      loadUserArticles()
    }
  },
)

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      settingsForm.username = newUser.username
      settingsForm.email = newUser.email
    }
  },
)
</script>

<style scoped>
.profile-view {
  padding: 20px 0;
  background: #f8f9fa;
  min-height: calc(100vh - 200px);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 40px;
  padding: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.user-avatar-large {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  flex-shrink: 0;
}

.user-info h1 {
  margin: 0 0 5px;
  color: #333;
  font-size: 2.5rem;
}

.user-email {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.user-role {
  margin-bottom: 10px;
}

.role-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #007bff;
  color: white;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.member-since {
  color: #888;
  font-size: 0.9rem;
}

.profile-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }
}

.profile-sidebar {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

.profile-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-btn {
  padding: 12px 20px;
  border: none;
  background: none;
  text-align: left;
  border-radius: 8px;
  color: #555;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: #f8f9fa;
  color: #333;
}

.nav-btn.active {
  background: #007bff;
  color: white;
  font-weight: 500;
}

.profile-main {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.tab-header h2 {
  margin: 0;
  color: #333;
}

.loading {
  text-align: center;
  padding: 40px;
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
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.articles-list {
  display: grid;
  gap: 20px;
}

.profile-article-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
}

.profile-article-card:hover {
  border-color: #007bff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.article-status {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.published {
  background: #28a745;
  color: white;
}

.status-badge.draft {
  background: #6c757d;
  color: white;
}

.featured-badge {
  background: #ffc107;
  color: #333;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.profile-article-card h3 {
  margin: 0 0 10px;
  color: #333;
  font-size: 1.2rem;
}

.article-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  color: #666;
  font-size: 14px;
}

.excerpt {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.article-actions {
  display: flex;
  gap: 10px;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
}

/* Статистика */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: #007bff;
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 30px;
}

@media (max-width: 992px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}

.chart-container {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
}

.chart-container h3 {
  margin: 0 0 20px;
  color: #333;
}

.top-articles {
  display: grid;
  gap: 10px;
}

.top-article-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.rank {
  width: 30px;
  height: 30px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.top-article-item .title {
  flex: 1;
  color: #333;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.top-article-item .title:hover {
  color: #007bff;
  text-decoration: underline;
}

.top-article-item .views {
  color: #666;
  font-size: 14px;
  flex-shrink: 0;
}

/* Настройки */
.settings-form {
  max-width: 600px;
}

.settings-form .form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.settings-form .form-section:last-child {
  border-bottom: none;
}

.settings-form h3 {
  margin: 0 0 20px;
  color: #333;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}
</style>
