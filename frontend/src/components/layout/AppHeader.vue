<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <!-- Логотип и название -->
        <router-link to="/" class="logo">
          <div class="logo-icon">📰</div>
          <div class="logo-text">
            <h1>Новостной портал</h1>
            <p class="logo-subtitle">Курсовой проект Node.js</p>
          </div>
        </router-link>

        <!-- Основная навигация -->
        <nav class="main-nav" :class="{ open: isMobileMenuOpen }">
          <button class="mobile-close" @click="closeMobileMenu" v-if="isMobileMenuOpen">
            ×
          </button>
          
          <router-link to="/" class="nav-link" @click="closeMobileMenu">
            🏠 Главная
          </router-link>
          
          <!-- Категории dropdown -->
          <div class="nav-dropdown" v-if="categories?.length">
            <button class="nav-link">
              📂 Категории
              <span class="dropdown-arrow">▼</span>
            </button>
            <div class="dropdown-menu">
              <router-link 
                v-for="category in categories.slice(0, 8)" 
                :key="category.id"
                :to="`/?category=${category?.attributes?.slug || category.id}`"
                class="dropdown-item"
                @click="closeMobileMenu"
              >
                {{ category?.attributes?.name || 'Категория' }}
              </router-link>
              <router-link 
                v-if="categories?.length > 8"
                to="/categories"
                class="dropdown-item all-categories"
                @click="closeMobileMenu"
              >
                Все категории →
              </router-link>
            </div>
          </div>
          
          <router-link to="/?featured=true" class="nav-link" @click="closeMobileMenu">
            ⭐ Избранное
          </router-link>
          
          <router-link to="/search" class="nav-link" @click="closeMobileMenu">
            🔍 Поиск
          </router-link>
          
          <!-- Для авторизованных пользователей -->
          <template v-if="authStore.isAuthenticated">
            <router-link 
              v-if="authStore.isEditor" 
              to="/editor" 
              class="nav-link"
              @click="closeMobileMenu"
            >
              ✏️ Редактор
            </router-link>
            
            <router-link to="/profile" class="nav-link" @click="closeMobileMenu">
              👤 Профиль
            </router-link>
          </template>
        </nav>

        <!-- Блок авторизации -->
        <div class="auth-section">
          <template v-if="authStore.isAuthenticated">
            <div class="user-menu">
              <div class="user-info" @click="toggleUserMenu">
                <div class="user-avatar">
                  {{ getUserInitials }}
                </div>
                <div class="user-details">
                  <span class="user-name">{{ authStore.userName }}</span>
                  <span class="user-role">{{ getUserRole }}</span>
                </div>
                <span class="user-arrow">▼</span>
              </div>
              
              <div class="user-dropdown" v-if="isUserMenuOpen" v-click-outside="closeUserMenu">
                <div class="dropdown-header">
                  <div class="dropdown-user">
                    <div class="dropdown-avatar">{{ getUserInitials }}</div>
                    <div>
                      <div class="dropdown-name">{{ authStore.userName }}</div>
                      <div class="dropdown-email">{{ authStore.user?.email }}</div>
                    </div>
                  </div>
                </div>
                
                <router-link to="/profile" class="dropdown-item" @click="closeAllMenus">
                  👤 Мой профиль
                </router-link>
                
                <router-link 
                  v-if="authStore.isEditor" 
                  to="/editor" 
                  class="dropdown-item"
                  @click="closeAllMenus"
                >
                  ✏️ Создать статью
                </router-link>
                
                <router-link 
                  v-if="authStore.isEditor" 
                  to="/categories" 
                  class="dropdown-item"
                  @click="closeAllMenus"
                >
                  📂 Управление категориями
                </router-link>
                
                <div class="dropdown-divider"></div>
                
                <button @click="logout" class="dropdown-item logout">
                  🚪 Выйти
                </button>
              </div>
            </div>
          </template>
          
          <template v-else>
            <div class="auth-buttons">
              <router-link to="/login" class="btn btn-outline">
                Войти
              </router-link>
              <router-link to="/register" class="btn btn-primary">
                Регистрация
              </router-link>
            </div>
          </template>
          
          <!-- Кнопка мобильного меню -->
          <button class="mobile-menu-btn" @click="toggleMobileMenu">
            <span class="menu-icon">☰</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useArticlesStore } from '@/stores/articles'

const router = useRouter()
const authStore = useAuthStore()
const articlesStore = useArticlesStore()

// Состояния меню
const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)

// Категории для навигации
const categories = computed(() => articlesStore.categories || [])

// Получение инициалов пользователя
const getUserInitials = computed(() => {
  if (!authStore.user?.username) return 'U'
  return authStore.user.username
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
})

// Получение роли пользователя
const getUserRole = computed(() => {
  if (authStore.isAdmin) return 'Администратор'
  if (authStore.isEditor) return 'Редактор'
  return 'Пользователь'
})

// Методы управления меню
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    isUserMenuOpen.value = false
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
  if (isUserMenuOpen.value) {
    isMobileMenuOpen.value = false
  }
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const closeAllMenus = () => {
  isMobileMenuOpen.value = false
  isUserMenuOpen.value = false
}

// Выход из системы
const logout = () => {
  authStore.logout()
  closeAllMenus()
  router.push('/')
}

// Директива для клика вне элемента
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Загрузка категорий при монтировании
onMounted(async () => {
  if (!categories.value || categories.value.length === 0) {
    await articlesStore.fetchCategories()
  }
  
  // Закрытие меню при изменении размера окна
  window.addEventListener('resize', closeAllMenus)
})

onUnmounted(() => {
  window.removeEventListener('resize', closeAllMenus)
})
</script>

<style scoped>
.app-header {
  background: white;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 70px;
  gap: 30px;
}

/* Логотип */
.logo {
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 32px;
}

.logo-text h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  line-height: 1.2;
}

.logo-subtitle {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
  font-weight: 400;
}

/* Основная навигация */
.main-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  text-decoration: none;
  color: #555;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  background: #f8f9fa;
  color: #007bff;
}

.nav-link.router-link-active {
  background: #007bff;
  color: white;
}

/* Dropdown для категорий */
.nav-dropdown {
  position: relative;
}

.nav-dropdown .nav-link {
  cursor: pointer;
}

.dropdown-arrow {
  font-size: 10px;
  margin-left: 5px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 10px 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.nav-dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 10px 20px;
  text-decoration: none;
  color: #333;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #007bff;
}

.all-categories {
  border-top: 1px solid #eee;
  margin-top: 10px;
  padding-top: 15px;
  color: #007bff;
  font-weight: 500;
}

/* Блок авторизации */
.auth-section {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
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

.btn-primary {
  background: #007bff;
  color: white;
  border: 1px solid #007bff;
}

.btn-primary:hover {
  background: #0056b3;
}

/* Меню пользователя */
.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.user-info:hover {
  background: #f8f9fa;
  border-color: #e9ecef;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.user-role {
  font-size: 12px;
  color: #666;
}

.user-arrow {
  font-size: 10px;
  color: #666;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 280px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  margin-top: 10px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.user-menu:hover .user-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.dropdown-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.dropdown-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  flex-shrink: 0;
}

.dropdown-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.dropdown-email {
  font-size: 12px;
  color: #666;
}

.dropdown-divider {
  height: 1px;
  background: #eee;
  margin: 10px 0;
}

.user-dropdown .dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  text-decoration: none;
  color: #333;
  transition: all 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
}

.user-dropdown .dropdown-item:hover {
  background: #f8f9fa;
  color: #007bff;
}

.user-dropdown .logout {
  color: #dc3545;
}

.user-dropdown .logout:hover {
  color: #dc3545;
  background: #ffebee;
}

/* Мобильное меню */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  color: #333;
}

.mobile-close {
  display: none;
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #333;
  z-index: 1001;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .main-nav {
    gap: 10px;
  }
  
  .nav-link {
    padding: 8px 12px;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .header-content {
    min-height: 60px;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .mobile-close {
    display: block;
  }
  
  .main-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    flex-direction: column;
    align-items: stretch;
    padding: 80px 20px 20px;
    gap: 10px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    overflow-y: auto;
  }
  
  .main-nav.open {
    transform: translateX(0);
  }
  
  .nav-link {
    padding: 15px;
    border-radius: 8px;
    font-size: 16px;
    border: 1px solid #eee;
  }
  
  .nav-dropdown .dropdown-menu {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    background: #f8f9fa;
    margin: 10px 0;
    padding: 0;
  }
  
  .dropdown-item {
    padding: 12px 20px;
    border-bottom: 1px solid #eee;
  }
  
  .auth-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    width: 100%;
    text-align: center;
  }
  
  .user-dropdown {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    border-radius: 0;
  }
  
  .logo-text h1 {
    font-size: 1.2rem;
  }
  
  .logo-subtitle {
    font-size: 0.7rem;
  }
}
</style>