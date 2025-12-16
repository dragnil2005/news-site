import { defineStore } from 'pinia'
import { authAPI } from '@/api/strapi'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('jwt') || null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isEditor: (state) => state.user?.role?.name === 'editor',
    isAdmin: (state) => state.user?.role?.name === 'admin',
    userName: (state) => state.user?.username || state.user?.email,
  },

  actions: {
    async login(identifier, password) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await authAPI.login(identifier, password)
        this.token = data.jwt
        this.user = data.user
        localStorage.setItem('jwt', data.jwt)
        router.push('/')
        return data
      } catch (error) {
        this.error = error.response?.data?.error?.message || 'Ошибка входа'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async register(userData) {
      this.isLoading = true
      this.error = null
      try {
        const { data } = await authAPI.register(
          userData.username,
          userData.email,
          userData.password
        )
        this.token = data.jwt
        this.user = data.user
        localStorage.setItem('jwt', data.jwt)
        router.push('/')
        return data
      } catch (error) {
        this.error = error.response?.data?.error?.message || 'Ошибка регистрации'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchUser() {
      if (!this.token) return
      try {
        const { data } = await authAPI.me()
        this.user = data
      } catch (error) {
        console.error('Failed to fetch user:', error)
        this.logout()
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('jwt')
      router.push('/login')
    },

    clearError() {
      this.error = null
    },
  },
})