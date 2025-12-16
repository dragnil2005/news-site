import { useAuthStore } from '@/stores/auth'

export const useAuth = () => {
  const authStore = useAuthStore()
  
  const login = async (identifier, password) => {
    return await authStore.login(identifier, password)
  }
  
  const register = async (userData) => {
    return await authStore.register(userData)
  }
  
  const logout = () => {
    authStore.logout()
  }
  
  const checkAuth = () => {
    return authStore.isAuthenticated
  }
  
  const checkRole = (role) => {
    if (role === 'editor') return authStore.isEditor
    if (role === 'admin') return authStore.isAdmin
    return false
  }
  
  return {
    // State
    user: authStore.user,
    isLoading: authStore.isLoading,
    error: authStore.error,
    isAuthenticated: authStore.isAuthenticated,
    isEditor: authStore.isEditor,
    isAdmin: authStore.isAdmin,
    
    // Actions
    login,
    register,
    logout,
    checkAuth,
    checkRole,
    clearError: authStore.clearError,
    fetchUser: authStore.fetchUser
  }
}