<template>
  <div class="not-found-wrap">
    <div class="title-box">
      <font-awesome-icon :icon="['fas', 'ban']" style="color: #ff0000" />
      <h1>404 Not Found</h1>
      <font-awesome-icon :icon="['fas', 'ban']" style="color: #ff0000" />
    </div>
    <h2 class="mt-5">페이지를 찾을 수 없음</h2>
    <div class="btn-box">
      <button class="btn to-main text-white" @click="toMain">메인으로</button>
      <button class="btn to-before text-white" @click="toBefore">이전 페이지로</button>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const toMain = () => {
  router.push('/') // 메인 페이지로 이동
}

const toBefore = () => {
  router.back() // 이전 페이지로 이동
}
</script>
<style scoped>
.not-found-wrap {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 100%;
  position: absolute;
  top: 30%;
}
.not-found-wrap h1 {
  font-size: 7rem;
}
.title-box {
  font-size: 5rem;
  display: flex;
  align-items: center;
}
h2 {
  font-weight: bold;
}
.btn-box {
  width: 25rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.to-main {
  background-color: rgb(178, 118, 27);
}
.btn {
  width: 10rem;
}
.to-before {
  background-color: rgb(57, 57, 197);
}
</style>
