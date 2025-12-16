<template>
  <div class="about">
    <div class="container">
      <h1 class="text-center my-4">О проекте</h1>
      <div class="card">
        <div class="card-body">
          <h3>Новостной портал</h3>
          <p>Проект разработан в рамках курса "Back-end разработка на Node.js" (4 курс, специальность ПОИТ).</p>
          
          <h4 class="mt-4">Технологии:</h4>
          <ul>
            <li><strong>Backend:</strong> Strapi (Node.js) + PostgreSQL</li>
            <li><strong>Frontend:</strong> Vue 3 + TypeScript + Bootstrap</li>
            <li><strong>Аутентификация:</strong> JWT</li>
          </ul>
          
          <h4 class="mt-4">Функционал:</h4>
          <ul>
            <li>CRUD операции с новостями</li>
            <li>Категории и фильтрация</li>
            <li>Пагинация</li>
            <li>Ролевой доступ (RBAC)</li>
            <li>Кастомные поля и эндпоинты</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Страница "О проекте"
</script>

<style scoped>
.about {
  min-height: 70vh;
}
</style>