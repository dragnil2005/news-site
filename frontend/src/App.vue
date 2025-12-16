<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" href="/">News Portal</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">Главная</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/about">О проекте</router-link>
            </li>
          </ul>
          <div class="navbar-nav">
            <router-link class="nav-link" to="/login">Вход</router-link>
            <router-link class="nav-link" to="/register">Регистрация</router-link>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="container mt-4">
      <router-view />
    </main>
    
    <footer class="bg-dark text-white mt-5 py-4">
      <div class="container text-center">
        <p>&copy; 2024 News Portal. Все права защищены.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Базовый компонент приложения
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>