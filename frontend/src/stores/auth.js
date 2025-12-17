import { defineStore } from 'pinia'
import { authAPI } from '@/api/strapi'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('jwt') || null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isEditor: (state) => {
      // Проверяем разные возможные варианты структуры роли
      const role = state.user?.role?.name || 
                   state.user?.role?.type || 
                   state.user?.role
      return role === 'editor' || role === 'Editor' || role === 'authenticated'
    },
    isAdmin: (state) => {
      const role = state.user?.role?.name || 
                   state.user?.role?.type || 
                   state.user?.role
      return role === 'admin' || role === 'Admin' || role === 'administrator'
    },
    userName: (state) => state.user?.username || state.user?.email?.split('@')[0],
  },

  actions: {
    async login(identifier, password) {
      this.isLoading = true
      this.error = null
      try {
        const response = await authAPI.login(identifier, password)
        const { jwt, user } = response.data
        
        this.token = jwt
        this.user = user
        
        // Сохраняем в localStorage
        localStorage.setItem('jwt', jwt)
        localStorage.setItem('user', JSON.stringify(user))
        
        router.push('/')
        return response.data
      } catch (error) {
        console.error('Login error:', error)
        this.error = error.response?.data?.error?.message || 
                    error.response?.data?.message || 
                    'Ошибка входа. Проверьте данные.'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async register(userData) {
      this.isLoading = true
      this.error = null
      try {
        const response = await authAPI.register(
          userData.username,
          userData.email,
          userData.password
        )
        const { jwt, user } = response.data
        
        this.token = jwt
        this.user = user
        
        localStorage.setItem('jwt', jwt)
        localStorage.setItem('user', JSON.stringify(user))
        
        router.push('/')
        return response.data
      } catch (error) {
        console.error('Register error:', error)
        this.error = error.response?.data?.error?.message || 
                    error.response?.data?.message || 
                    'Ошибка регистрации. Возможно, email уже занят.'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchUser() {
      if (!this.token) {
        this.logout()
        return
      }
      
      try {
        const response = await authAPI.me()
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
      } catch (error) {
        console.error('Failed to fetch user:', error)
        this.logout()
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('jwt')
      localStorage.removeItem('user')
      router.push('/login')
    },

    clearError() {
      this.error = null
    },
  },
})