import { useArticlesStore } from '@/stores/articles'

export const useArticles = () => {
  const articlesStore = useArticlesStore()
  
  const fetchArticles = async (params = {}) => {
    return await articlesStore.fetchArticles(params)
  }
  
  const fetchArticle = async (id) => {
    return await articlesStore.fetchArticle(id)
  }
  
  const createArticle = async (articleData) => {
    return await articlesStore.createArticle(articleData)
  }
  
  const updateArticle = async (id, articleData) => {
    return await articlesStore.updateArticle(id, articleData)
  }
  
  const deleteArticle = async (id) => {
    return await articlesStore.deleteArticle(id)
  }
  
  const publishArticle = async (id) => {
    return await articlesStore.publishArticle(id)
  }
  
  const setFilters = (filters) => {
    articlesStore.setFilters(filters)
  }
  
  const clearFilters = () => {
    articlesStore.clearFilters()
  }
  
  const setPage = (page) => {
    articlesStore.setPage(page)
  }
  
  return {
    // State
    articles: articlesStore.articles,
    featuredArticles: articlesStore.featuredArticles,
    categories: articlesStore.categories,
    currentArticle: articlesStore.currentArticle,
    pagination: articlesStore.pagination,
    filters: articlesStore.filters,
    isLoading: articlesStore.isLoading,
    error: articlesStore.error,
    hasMorePages: articlesStore.hasMorePages,
    
    // Actions
    fetchArticles,
    fetchArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    setFilters,
    clearFilters,
    setPage,
    fetchCategories: articlesStore.fetchCategories,
    fetchFeaturedArticles: articlesStore.fetchFeaturedArticles,
    incrementViews: articlesStore.incrementViews,
    clearError: articlesStore.clearError
  }
}