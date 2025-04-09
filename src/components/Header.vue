
<template>
    <nav class="navbar navbar-expand-sm">
      <div class="container-fluid d-flex align-items-center justify-content-between">
        <!-- 왼쪽: 로고 -->
        <router-link
          class="navbar-brand d-flex align-items-center text-decoration-none"
          :to="{ name: 'home' }"
        >
          <font-awesome-icon style="font-size: 40px" :icon="['fas', 'piggy-bank']" />
          <span class="text-white fw-bold ms-2">돈셈이</span>
        </router-link>
  
        <!-- 중앙: 메뉴 -->
        <div class="flex-grow-1">
          <ul class="navbar-nav justify-content-center d-flex">
            <li class="nav-item px-3">
              <router-link
                class="nav-link"
                :class="$route.name === 'home' ? 'text-white fw-bold' : 'text-white text-opacity-50'"
                :to="{ name: 'home' }"
              >
                홈
              </router-link>
            </li>
            <li class="nav-item px-3">
              <router-link
                class="nav-link"
                :class="
                  $route.name === 'transaction-history'
                    ? 'text-white fw-bold'
                    : 'text-white text-opacity-50'
                "
                :to="{ name: 'transaction-history' }"
              >
                상세내역
              </router-link>
            </li>
          </ul>
        </div>
  
        <!-- 오른쪽: 사용자 아이콘 -->
        <div class="d-flex align-items-center">
          <font-awesome-icon class="me-2" style="font-size: 40px" :icon="['far', 'circle-user']" />
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  // 모바일 메뉴 관련 로직 제거
  </script>
  
  <style scoped>
  nav {
    background-color: #f44f42;
  }
  </style>