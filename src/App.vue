<template>
  <Header class="header" />
  <router-view />
</template>

<script setup>
import Header from '@/components/Header.vue'
</script>

<style scopted>
.header {
  width: 1440px;
  height: 105px;
  margin: 0 auto;
}
</style>
