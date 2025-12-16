<template>
  <div class="pagination" v-if="totalPages > 1">
    <div class="pagination-info">
      Страница {{ currentPage }} из {{ totalPages }}
      ({{ totalItems }} всего)
    </div>
    
    <div class="pagination-controls">
      <button 
        :disabled="currentPage === 1" 
        @click="$emit('page-change', currentPage - 1)"
        class="pagination-btn prev"
        aria-label="Предыдущая страница"
      >
        ←
      </button>
      
      <div class="page-numbers">
        <template v-for="(page, index) in visiblePages" :key="index">
          <button 
            v-if="page !== '...'"
            :class="['page-btn', { active: page === currentPage }]"
            @click="$emit('page-change', page)"
            :aria-label="`Страница ${page}`"
            :aria-current="page === currentPage ? 'page' : null"
          >
            {{ page }}
          </button>
          <span v-else class="page-dots">
            ...
          </span>
        </template>
      </div>
      
      <button 
        :disabled="currentPage === totalPages" 
        @click="$emit('page-change', currentPage + 1)"
        class="pagination-btn next"
        aria-label="Следующая страница"
      >
        →
      </button>
    </div>
    
    <div class="pagination-size" v-if="showSizeSelector">
      <label for="page-size">Показывать по:</label>
      <select 
        id="page-size"
        :value="pageSize"
        @change="$emit('size-change', parseInt($event.target.value))"
        class="size-select"
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    validator: value => value > 0
  },
  totalPages: {
    type: Number,
    required: true,
    validator: value => value > 0
  },
  totalItems: {
    type: Number,
    required: true,
    validator: value => value >= 0
  },
  pageSize: {
    type: Number,
    default: 10
  },
  showSizeSelector: {
    type: Boolean,
    default: false
  },
  maxVisiblePages: {
    type: Number,
    default: 7,
    validator: value => value >= 5
  }
})

const emit = defineEmits(['page-change', 'size-change'])

const visiblePages = computed(() => {
  const pages = []
  const current = props.currentPage
  const total = props.totalPages
  const maxVisible = props.maxVisiblePages
  
  if (total <= maxVisible) {
    // Показать все страницы
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Всегда показываем первую страницу
    pages.push(1)
    
    // Вычисляем диапазон страниц вокруг текущей
    let start = Math.max(2, current - Math.floor(maxVisible / 2))
    let end = Math.min(total - 1, current + Math.floor(maxVisible / 2))
    
    // Корректируем если мы у краев
    if (current <= Math.floor(maxVisible / 2) + 1) {
      end = maxVisible - 1
    }
    
    if (current >= total - Math.floor(maxVisible / 2)) {
      start = total - maxVisible + 2
    }
    
    // Добавляем многоточие если нужно
    if (start > 2) {
      pages.push('...')
    }
    
    // Добавляем страницы диапазона
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Добавляем многоточие если нужно
    if (end < total - 1) {
      pages.push('...')
    }
    
    // Всегда показываем последнюю страницу
    pages.push(total)
  }
  
  return pages
})
</script>

<style scoped>
.pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 30px 0;
}

.pagination-info {
  color: #666;
  font-size: 14px;
  text-align: center;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #007bff;
  color: #007bff;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-btn:hover:not(.active) {
  background: #f8f9fa;
  border-color: #007bff;
  color: #007bff;
}

.page-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.page-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  color: #666;
  font-size: 14px;
}

.pagination-size {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.size-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  cursor: pointer;
}

.size-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

@media (max-width: 768px) {
  .pagination-controls {
    gap: 5px;
  }
  
  .pagination-btn,
  .page-btn {
    width: 35px;
    height: 35px;
    min-width: 35px;
  }
  
  .page-dots {
    min-width: 35px;
    height: 35px;
  }
  
  .pagination-size {
    flex-direction: column;
    gap: 5px;
  }
}
</style>