// Вспомогательные функции

// Форматирование даты
export const formatDate = (dateString, format = 'dd.MM.yyyy HH:mm') => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date)
  } catch {
    return dateString
  }
}

// Форматирование времени чтения
export const formatReadingTime = (minutes) => {
  if (minutes < 1) return 'Меньше минуты'
  if (minutes === 1) return '1 минута'
  if (minutes < 5) return `${minutes} минуты`
  return `${minutes} минут`
}

// Обрезка текста
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Генерация случайного цвета для аватара
export const getRandomColor = () => {
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#fa709a', '#fee140', '#a8edea', '#fed6e3'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Получение инициалов из имени
export const getInitials = (name) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2)
}

// Форматирование числа с разделителями
export const formatNumber = (number) => {
  return new Intl.NumberFormat('ru-RU').format(number)
}

// Создание URL для изображения Strapi
export const getStrapiImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_STRAPI_URL}${path}`
}

// Проверка роли пользователя
export const checkUserRole = (user, role) => {
  if (!user || !user.role) return false
  return user.role.name === role
}

// Генерация slug из заголовка
export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

// Подсчет времени чтения статьи
export const calculateReadingTime = (content) => {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Безопасный парсинг JSON
export const safeParseJSON = (jsonString, defaultValue = null) => {
  try {
    return JSON.parse(jsonString)
  } catch {
    return defaultValue
  }
}