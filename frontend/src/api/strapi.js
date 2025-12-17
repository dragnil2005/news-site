import axios from 'axios'

const strapi = axios.create({
  baseURL: import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Интерцептор для JWT токена
strapi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Интерцептор для обработки ошибок
strapi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Очищаем токен при 401 ошибке
      localStorage.removeItem('jwt')
      
      // Перенаправляем на страницу входа
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    return Promise.reject(error)
  }
)

// API методы для авторизации
export const authAPI = {
  login: (identifier, password) =>
    strapi.post('/api/auth/local', { identifier, password }),
  
  register: (username, email, password) =>
    strapi.post('/api/auth/local/register', { username, email, password }),
  
  me: () => strapi.get('/api/users/me?populate=role'),
  
  forgotPassword: (email) =>
    strapi.post('/api/auth/forgot-password', { email }),
  
  resetPassword: (code, password, passwordConfirmation) =>
    strapi.post('/api/auth/reset-password', { code, password, passwordConfirmation }),
}

// API методы для статей
export const articlesAPI = {
  // Стандартные CRUD операции
  getArticles: (params) => strapi.get('/api/articles', { params }),
  
  getArticle: (id) =>
    strapi.get(`/api/articles/${id}?populate=coverImage,category,author,tags`),
  
  createArticle: (data) => strapi.post('/api/articles', { data }),
  
  updateArticle: (id, data) => strapi.put(`/api/articles/${id}`, { data }),
  
  deleteArticle: (id) => strapi.delete(`/api/articles/${id}`),
  
  // Кастомные эндпоинты (из ТЗ)
  getFeatured: () => strapi.get('/api/articles?filters[isFeatured][$eq]=true&populate=*&sort=publishedAt:desc&pagination[pageSize]=5'),
  
  publishArticle: (id) => strapi.post(`/api/articles/${id}/publish`),
  
  incrementViews: (id) => strapi.post(`/api/articles/${id}/views`),
  
  // Дополнительные методы
  getByCategory: (categorySlug) =>
    strapi.get(`/api/articles?filters[category][slug][$eq]=${categorySlug}&populate=*`),
  
  searchArticles: (query) =>
    strapi.get(`/api/articles?filters[title][$containsi]=${query}&populate=*`),
}

// API методы для категорий
export const categoriesAPI = {
  getCategories: () => strapi.get('/api/categories?populate=*'),
  
  getCategory: (id) => strapi.get(`/api/categories/${id}?populate=*`),
  
  createCategory: (data) => strapi.post('/api/categories', { data }),
  
  updateCategory: (id, data) => strapi.put(`/api/categories/${id}`, { data }),
  
  deleteCategory: (id) => strapi.delete(`/api/categories/${id}`),
}

// API методы для загрузки файлов
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('files', file)
    return strapi.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  
  uploadMultiple: (files) => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    return strapi.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

// API методы для пользователей
export const usersAPI = {
  getUsers: () => strapi.get('/api/users?populate=role'),
  
  getUser: (id) => strapi.get(`/api/users/${id}?populate=role`),
  
  updateUser: (id, data) => strapi.put(`/api/users/${id}`, { data }),
  
  deleteUser: (id) => strapi.delete(`/api/users/${id}`),
}

export default strapi