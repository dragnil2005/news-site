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
        // Строим параметры запроса
        const queryParams = {
          'pagination[page]': this.pagination.page,
          'pagination[pageSize]': this.pagination.pageSize,
          sort: this.filters.sort,
          populate: '*',
          ...this.buildFilters(),
          ...params,
        }

        const response = await articlesAPI.getArticles(queryParams)
        
        // Обрабатываем ответ Strapi v4
        if (response.data && response.data.data) {
          this.articles = response.data.data
          this.pagination = response.data.meta?.pagination || {
            page: 1,
            pageSize: this.pagination.pageSize,
            pageCount: 1,
            total: response.data.data.length
          }
        } else {
          this.articles = response.data || []
          this.pagination = {
            page: 1,
            pageSize: this.pagination.pageSize,
            pageCount: 1,
            total: (response.data || []).length
          }
        }
        
        return response.data
      } catch (error) {
        console.error('Fetch articles error:', error)
        this.error = this.getErrorMessage(error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchFeaturedArticles() {
      try {
        const response = await articlesAPI.getFeatured()
        
        if (response.data && response.data.data) {
          this.featuredArticles = response.data.data
        } else {
          this.featuredArticles = response.data || []
        }
      } catch (error) {
        console.warn('Featured articles error, using fallback:', error.message)
        
        // Fallback: фильтруем локально из всех статей
        try {
          const allResponse = await articlesAPI.getArticles({
            'pagination[pageSize]': 20,
            sort: 'publishedAt:desc'
          })
          
          const allArticles = allResponse.data?.data || allResponse.data || []
          this.featuredArticles = allArticles.filter(article => 
            article.attributes?.isFeatured === true
          ).slice(0, 5)
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError)
          this.featuredArticles = []
        }
      }
    },

    async fetchCategories() {
      try {
        const response = await categoriesAPI.getCategories()
        
        if (response.data && response.data.data) {
          this.categories = response.data.data
        } else {
          this.categories = response.data || []
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        this.error = 'Ошибка загрузки категорий'
        this.categories = []
      }
    },

    async fetchArticle(documentId) {
      this.isLoading = true
      this.error = null
      try {
        const response = await articlesAPI.getArticle(documentId)
        
        if (response.data && response.data.data) {
          this.currentArticle = response.data.data
        } else {
          this.currentArticle = response.data
        }
        
        // Пытаемся увеличить просмотры
        try {
          await articlesAPI.incrementViews(documentId)
        } catch (viewsError) {
          console.warn('Could not increment views:', viewsError.message)
          // Игнорируем ошибку увеличения просмотров
        }
        
        return this.currentArticle
      } catch (error) {
        console.error('Fetch article error:', error)
        this.error = this.getErrorMessage(error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createArticle(articleData) {
      this.isLoading = true
      this.error = null
      try {
        const response = await articlesAPI.createArticle(articleData)
        
        const newArticle = response.data?.data || response.data
        
        // Добавляем в начало списка
        this.articles.unshift(newArticle)
        
        // Показываем уведомление
        if (window.showToast) {
          window.showToast('success', 'Статья создана', 'Статья успешно создана')
        }
        
        return newArticle
      } catch (error) {
        console.error('Create article error:', error)
        this.error = this.getErrorMessage(error)
        
        if (window.showToast) {
          window.showToast('error', 'Ошибка', 'Не удалось создать статью')
        }
        
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateArticle(documentId, articleData) {
      this.isLoading = true
      this.error = null
      try {
        const response = await articlesAPI.updateArticle(documentId, articleData)
        
        const updatedArticle = response.data?.data || response.data
        
        // Обновляем в локальном хранилище
        const index = this.articles.findIndex(article => 
          article.documentId === documentId || article.attributes?.documentId === documentId
        )
        if (index !== -1) {
          this.articles[index] = updatedArticle
        }
        
        if (this.currentArticle && 
            (this.currentArticle.documentId === documentId || this.currentArticle.attributes?.documentId === documentId)) {
          this.currentArticle = updatedArticle
        }
        
        if (window.showToast) {
          window.showToast('success', 'Сохранено', 'Изменения успешно сохранены')
        }
        
        return updatedArticle
      } catch (error) {
        console.error('Update article error:', error)
        this.error = this.getErrorMessage(error)
        
        if (window.showToast) {
          window.showToast('error', 'Ошибка', 'Не удалось сохранить изменения')
        }
        
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteArticle(documentId) {
      this.isLoading = true
      this.error = null
      try {
        await articlesAPI.deleteArticle(documentId)
        
        // Удаляем из локального хранилища
        this.articles = this.articles.filter(article => 
          article.documentId !== documentId
        )
        
        if (this.currentArticle && this.currentArticle.documentId === documentId) {
          this.currentArticle = null
        }
        
        if (window.showToast) {
          window.showToast('success', 'Удалено', 'Статья успешно удалена')
        }
        
      } catch (error) {
        console.error('Delete article error:', error)
        this.error = this.getErrorMessage(error)
        
        if (window.showToast) {
          window.showToast('error', 'Ошибка', 'Не удалось удалить статью')
        }
        
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async publishArticle(documentId) {
      this.isLoading = true
      this.error = null
      try {
        await articlesAPI.publishArticle(documentId)
        
        // Обновляем статус в локальном хранилище
        const index = this.articles.findIndex(article => 
          article.documentId === documentId || article.attributes?.documentId === documentId
        )
        if (index !== -1) {
          const now = new Date().toISOString()
          if (this.articles[index].attributes) {
            this.articles[index].attributes.publishedAt = now
            this.articles[index].attributes.isPublished = true
          } else {
            this.articles[index].publishedAt = now
            this.articles[index].isPublished = true
          }
        }
        
        if (window.showToast) {
          window.showToast('success', 'Опубликовано', 'Статья успешно опубликована')
        }
        
      } catch (error) {
        console.error('Publish article error:', error)
        this.error = this.getErrorMessage(error)
        
        if (window.showToast) {
          window.showToast('error', 'Ошибка', 'Не удалось опубликовать статью')
        }
        
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchCategories() {
      try {
        const response = await categoriesAPI.getCategories()
        
        console.log('Categories API response:', response)
        
        if (response.data && response.data.data) {
          this.categories = response.data.data
        } else if (response.data && Array.isArray(response.data)) {
          this.categories = response.data
        } else {
          this.categories = []
          console.warn('Unexpected categories response format:', response)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        console.error('Error details:', error.response?.data)
        
        // Если 404, возможно, коллекция не существует
        if (error.response?.status === 404) {
          this.error = 'Коллекция категорий не найдена в Strapi'
          console.warn('Categories collection might not exist in Strapi')
        } else {
          this.error = 'Ошибка загрузки категорий'
        }
        
        this.categories = []
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
        // Ищем в заголовке и содержании
        filters['filters[$or][0][title][$containsi]'] = this.filters.search
        filters['filters[$or][1][content][$containsi]'] = this.filters.search
        filters['filters[$or][2][excerpt][$containsi]'] = this.filters.search
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
      if (!error) return 'Неизвестная ошибка'
      
      if (error.response) {
        const status = error.response.status
        const data = error.response.data
        
        switch (status) {
          case 400:
            return data?.error?.message || data?.message || 'Некорректный запрос'
          case 401:
            return 'Требуется авторизация'
          case 403:
            return 'Доступ запрещен'
          case 404:
            return 'Ресурс не найден'
          case 422:
            return data?.error?.message || data?.message || 'Ошибка валидации данных'
          case 500:
            return 'Ошибка сервера. Попробуйте позже.'
          default:
            return data?.error?.message || data?.message || `Ошибка ${status}`
        }
      }
      
      return error.message || 'Неизвестная ошибка сети'
    },

    clearError() {
      this.error = null
    },
  },
})