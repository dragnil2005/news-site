import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { 
        title: 'Главная',
        requiresAuth: false 
      }
    },
    {
      path: '/article/:id',
      name: 'article',
      component: () => import('@/views/ArticleView.vue'),
      props: true,
      meta: { 
        title: 'Статья',
        requiresAuth: false 
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { 
        title: 'Вход',
        guestOnly: true 
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { 
        title: 'Регистрация',
        guestOnly: true 
      }
    },
    {
      path: '/editor',
      name: 'editor-create',
      component: () => import('@/views/EditorView.vue'),
      meta: { 
        title: 'Создание статьи',
        requiresAuth: true,
        requiresEditor: true 
      }
    },
    {
      path: '/editor/:id',
      name: 'editor-edit',
      component: () => import('@/views/EditorView.vue'),
      props: true,
      meta: { 
        title: 'Редактирование статьи',
        requiresAuth: true,
        requiresEditor: true 
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { 
        title: 'Профиль',
        requiresAuth: true 
      }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/CategoriesView.vue'),
      meta: { 
        title: 'Категории',
        requiresAuth: true,
        requiresEditor: true 
      }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
      meta: { 
        title: 'Поиск',
        requiresAuth: false 
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { 
        title: 'О проекте',
        requiresAuth: false 
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactView.vue'),
      meta: { 
        title: 'Контакты',
        requiresAuth: false 
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { 
        title: 'Страница не найдена',
        requiresAuth: false 
      }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Глобальная навигационная охрана
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Загружаем информацию о пользователе если токен есть
  if (!authStore.user && localStorage.getItem('jwt')) {
    try {
      await authStore.fetchUser()
    } catch (error) {
      localStorage.removeItem('jwt')
    }
  }
  
  // Установка заголовка страницы
  const pageTitle = to.meta.title || 'Новостной портал'
  document.title = `${pageTitle} | Новостной портал`
  
  // Проверка на авторизацию
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }
  
  // Проверка роли редактора
  if (to.meta.requiresEditor && !authStore.isEditor) {
    // Показываем уведомление
    if (window.showToast) {
      window.showToast('error', 'Доступ запрещен', 'Требуются права редактора')
    }
    return next('/')
  }
  
  // Гости не могут заходить на авторизованные страницы
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next('/')
  }
  
  next()
})

// Глобальная обработка ошибок маршрутизации
router.onError((error) => {
  console.error('Router error:', error)
  
  if (window.showToast) {
    window.showToast('error', 'Ошибка маршрутизации', 'Произошла ошибка при загрузке страницы')
  }
})

export default router