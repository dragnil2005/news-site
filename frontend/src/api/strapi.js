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
      localStorage.removeItem('user')
      
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
  
  me: () => strapi.get('/api/users/me?populate=*'),
  
  forgotPassword: (email) =>
    strapi.post('/api/auth/forgot-password', { email }),
  
  resetPassword: (code, password, passwordConfirmation) =>
    strapi.post('/api/auth/reset-password', { code, password, passwordConfirmation }),
}

// API методы для статей
export const articlesAPI = {
  // Стандартные CRUD операции
  getArticles: (params = {}) => {
    const defaultParams = {
      populate: '*',
      sort: 'publishedAt:desc',
      'pagination[pageSize]': 12
    }
    
    return strapi.get('/api/articles', { params: { ...defaultParams, ...params } })
  },
  
  getArticle: (idOrDocumentId) =>
    strapi.get(`/api/articles/${idOrDocumentId}?populate=*`),
  
  createArticle: (data) => strapi.post('/api/articles', { data }),
  
  updateArticle: (idOrDocumentId, data) => strapi.put(`/api/articles/${idOrDocumentId}`, { data }),
  
  deleteArticle: (idOrDocumentId) => strapi.delete(`/api/articles/${idOrDocumentId}`),
  
  // Кастомные методы фильтрации
  getFeatured: () =>
    strapi.get('/api/articles', {
      params: {
        'filters[isFeatured][$eq]': true,
        populate: '*',
        sort: 'publishedAt:desc',
        'pagination[pageSize]': 5
      }
    }),
  
  publishArticle: (idOrDocumentId) => 
    strapi.put(`/api/articles/${idOrDocumentId}`, { 
      data: { 
        publishedAt: new Date().toISOString()
      }
    }),
  
  incrementViews: async (idOrDocumentId) => {
    try {
      console.log('Incrementing views for article:', idOrDocumentId)
      
      // 1. Сначала получаем статью
      const getResponse = await strapi.get(`/api/articles/${idOrDocumentId}`)
      console.log('Article response:', getResponse.data)
      
      const article = getResponse.data?.data || getResponse.data
      console.log('Current article:', article)
      
      const currentViews = article.views || 0
      console.log('Current views:', currentViews, 'New views:', currentViews + 1)
      
      // 2. Отправляем PUT запрос с правильной структурой
      const updateResponse = await strapi.put(`/api/articles/${idOrDocumentId}`, {
        data: {
          views: currentViews + 1
        }
      })
      
      console.log('Update successful:', updateResponse.data)
      return updateResponse
      
    } catch (error) {
      console.error('Views increment failed:', error.message)
      console.error('Error response:', error.response?.data)
      // Возвращаем фейковый ответ, чтобы не ломать цепочку
      return { data: {} }
    }
  },
}

// API методы для категорий
export const categoriesAPI = {
  getCategories: () => 
    strapi.get('/api/categories?populate=*'),
  
  getCategory: (idOrDocumentId) => 
    strapi.get(`/api/categories/${idOrDocumentId}?populate=*`),
  
  createCategory: (data) => strapi.post('/api/categories', { data }),
  
  updateCategory: (idOrDocumentId, data) => strapi.put(`/api/categories/${idOrDocumentId}`, { data }),
  
  deleteCategory: (idOrDocumentId) => strapi.delete(`/api/categories/${idOrDocumentId}`),
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
  getUsers: () => strapi.get('/api/users?populate=*'),
  
  getUser: (idOrDocumentId) => strapi.get(`/api/users/${idOrDocumentId}?populate=*`),
  
  updateUser: (idOrDocumentId, data) => strapi.put(`/api/users/${idOrDocumentId}`, { data }),
  
  deleteUser: (idOrDocumentId) => strapi.delete(`/api/users/${idOrDocumentId}`),
}

export default strapi