import { defineStore } from 'pinia'
import { articlesAPI, categoriesAPI } from '@/api/strapi'

export const useArticlesStore = defineStore('articles', {
  state: () => ({
    articles: [],
    featuredArticles: [],
    categories: [],
    currentArticle: null,
    pagination: {
      page: 1,
      pageSize: 12,
      pageCount: 0,
      total: 0,
    },
    filters: {
      category: null,
      isFeatured: false,
      sort: 'publishedAt:desc',
      search: '',
      tag: '',
    },
    isLoading: false,
    error: null,
  }),

  getters: {
    hasMorePages: (state) => state.pagination.page < state.pagination.pageCount,
    activeFiltersCount: (state) => {
      let count = 0
      if (state.filters.category) count++
      if (state.filters.isFeatured) count++
      if (state.filters.search) count++
      if (state.filters.tag) count++
      if (state.filters.sort !== 'publishedAt:desc') count++
      return count
    },
  },

  actions: {
    async fetchArticles(params = {}) {
      this.isLoading = true
      this.error = null
      try {
        const response = await articlesAPI.getArticles({
          populate: 'category,author,coverImage',
          sort: this.filters.sort,
          'pagination[page]': this.pagination.page,
          'pagination[pageSize]': this.pagination.pageSize,
          ...this.buildFilters(),
          ...params,
        })
        
        this.articles = response.data.data
        this.pagination = response.data.meta.pagination
        
        // Проверяем наличие кастомного эндпоинта /featured
        if (!this.featuredArticles.length) {
          this.fetchFeaturedArticles()
        }
        
        return response.data
      } catch (error) {
        this.error = this.getErrorMessage(error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchFeaturedArticles() {
      try {
        // Пробуем получить избранные статьи через кастомный эндпоинт
        const response = await articlesAPI.getFeatured()
        this.featuredArticles = response.data.data
      } catch (error) {
        // Если кастомный эндпоинт не реализован, фильтруем локально
        console.warn('Featured endpoint not available, filtering locally')
        const allArticles = await articlesAPI.getArticles({
          'pagination[pageSize]': 100
        })
        this.featuredArticles = allArticles.data.data
          .filter(article => article.attributes.isFeatured)
          .slice(0, 5)
      }
    },

    async fetchCategories() {
      try {
        const response = await categoriesAPI.getCategories()
        this.categories = response.data.data
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        this.error = 'Ошибка загрузки категорий'
      }
    },

    async fetchArticle(id) {
      this.isLoading = true
      try {
        const response = await articlesAPI.getArticle(id)
        this.currentArticle = response.data.data
        
        // Инкрементируем просмотры через кастомный эндпоинт
        try {
          await articlesAPI.incrementViews(id)
        } catch (error) {
          console.warn('Views increment endpoint not available')
        }
        
        return response.data.data
      } catch (error) {
        this.error = this.getErrorMessage(error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createArticle(articleData) {
      this.isLoading = true
      try {
        const response = await articlesAPI.createArticle(articleData)
        
        // Показываем уведомление
        if (window.showToast) {
          window.showToast('success', 'Статья создана', 'Статья успешно создана и опубликована')
        }
        
        return response.data.data
      } catch (error) {
        this.error = this.getErrorMessage(error)
        
        if (window.showToast) {
          window.showToast('error', 'Ошибка', 'Не удалось создать статью')
        }
        
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateArticle(id, articleData) {
      this.isLoading = true
      try {
        const response = await articlesAPI.updateArticle(id, articleData)
        
        // Обновляем в локальном хранилище
        const index = this.articles.findIndex(article => article.id === id)
        if (index !== -1) {
          this.articles[index] = response.data.data
        }
        if (this.currentArticle?.id === id) {
          this.currentArticle = response.data.data
        }
        
        if (window.showToast) {
          window.showToast('success', 'Сохранено', 'Изменения успешно сохранены')
        }
        
        return response.data.data
      } catch (error) {
        this.error = this.getErrorMessage(error)
        
        if (window.showToast) {
          window.showToast('error', 'Ошибка', 'Не удалось сохранить изменения')
        }
        
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteArticle(id) {
      try {
        await articlesAPI.deleteArticle(id)
        
        // Удаляем из локального хранилища
        this.articles = this.articles.filter(article => article.id !== id)
        if (this.currentArticle?.id === id) {
          this.currentArticle = null
        }
        
        if (window.showToast) {
          window.showToast('success', 'Удалено', 'Статья успешно удалена')
        }
        
      } catch (error) {
        this.error = this.getErrorMessage(error)
        
        if (window.showToast) {
          window.showToast('error', 'Ошибка', 'Не удалось удалить статью')
        }
        
        throw error
      }
    },

    async publishArticle(id) {
      try {
        await articlesAPI.publishArticle(id)
        
        // Обновляем статус в локальном хранилище
        const index = this.articles.findIndex(article => article.id === id)
        if (index !== -1) {
          this.articles[index].attributes.publishedAt = new Date().toISOString()
        }
        
        if (window.showToast) {
          window.showToast('success', 'Опубликовано', 'Статья успешно опубликована')
        }
        
      } catch (error) {
        this.error = this.getErrorMessage(error)
        
        if (window.showToast) {
          window.showToast('error', 'Ошибка', 'Не удалось опубликовать статью')
        }
        
        throw error
      }
    },

    buildFilters() {
      const filters = {}
      
      if (this.filters.category) {
        filters['filters[category][slug][$eq]'] = this.filters.category
      }
      
      if (this.filters.isFeatured) {
        filters['filters[isFeatured][$eq]'] = true
      }
      
      if (this.filters.search) {
        filters['filters[title][$containsi]'] = this.filters.search
      }
      
      if (this.filters.tag) {
        filters['filters[tags][$containsi]'] = this.filters.tag
      }
      
      return filters
    },

    setPage(page) {
      this.pagination.page = page
      this.fetchArticles()
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
      this.pagination.page = 1
      this.fetchArticles()
    },

    clearFilters() {
      this.filters = {
        category: null,
        isFeatured: false,
        sort: 'publishedAt:desc',
        search: '',
        tag: '',
      }
      this.pagination.page = 1
      this.fetchArticles()
      
      if (window.showToast) {
        window.showToast('info', 'Фильтры сброшены', 'Все фильтры были сброшены')
      }
    },

    getErrorMessage(error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            return 'Некорректный запрос'
          case 401:
            return 'Требуется авторизация'
          case 403:
            return 'Доступ запрещен'
          case 404:
            return 'Статья не найдена'
          case 500:
            return 'Ошибка сервера'
          default:
            return error.response.data?.error?.message || 'Ошибка загрузки данных'
        }
      }
      return error.message || 'Неизвестная ошибка'
    },

    clearError() {
      this.error = null
    },
  },
})