// Утилиты для валидации форм

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateUsername = (username) => {
  return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username)
}

export const validateSlug = (slug) => {
  return /^[a-z0-9-]+$/.test(slug)
}

export const validateTitle = (title) => {
  return title.length >= 3 && title.length <= 200
}

export const validateExcerpt = (excerpt) => {
  return excerpt.length >= 10 && excerpt.length <= 300
}

export const validateContent = (content) => {
  return content.length >= 50
}

// Валидация формы статьи
export const validateArticleForm = (formData) => {
  const errors = {}
  
  if (!validateTitle(formData.title)) {
    errors.title = 'Заголовок должен содержать от 3 до 200 символов'
  }
  
  if (formData.slug && !validateSlug(formData.slug)) {
    errors.slug = 'URL может содержать только латинские буквы, цифры и дефисы'
  }
  
  if (!validateExcerpt(formData.excerpt)) {
    errors.excerpt = 'Краткое описание должно содержать от 10 до 300 символов'
  }
  
  if (!validateContent(formData.content)) {
    errors.content = 'Текст статьи должен содержать минимум 50 символов'
  }
  
  if (!formData.category) {
    errors.category = 'Выберите категорию'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Валидация формы регистрации
export const validateRegisterForm = (formData) => {
  const errors = {}
  
  if (!validateUsername(formData.username)) {
    errors.username = 'Имя пользователя должно содержать от 3 до 20 символов (только буквы, цифры и подчеркивания)'
  }
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Введите корректный email'
  }
  
  if (!validatePassword(formData.password)) {
    errors.password = 'Пароль должен содержать минимум 6 символов'
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Пароли не совпадают'
  }
  
  if (!formData.acceptTerms) {
    errors.acceptTerms = 'Необходимо принять условия использования'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Валидация формы входа
export const validateLoginForm = (formData) => {
  const errors = {}
  
  if (!formData.identifier.trim()) {
    errors.identifier = 'Введите email или имя пользователя'
  }
  
  if (!formData.password) {
    errors.password = 'Введите пароль'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}