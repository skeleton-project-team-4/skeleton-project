<template>
  <div class="content">
    <div class="recent-monthly">
      <div class="recent">
        <RecentHistoryList />
      </div>
      <div class="monthly">
        <MonthHistory />
      </div>
    </div>
    <div class="donut-chart">
      <MonthHistoryForCategory />
    </div>
  </div>
</template>

<script setup>
import RecentHistoryList from '@/components/RecentHistoryList.vue'
import MonthHistory from '@/components/MonthHistory.vue'
import MonthHistoryForCategory from '@/components/MonthHistoryForCategory.vue'
</script>

<style scoped>
.content {
  width: 1380px;
  height: 100%;
  margin: 0 auto 50px;
}

.recent-monthly {
  margin-top: 25px;
  width: 1380px;
  height: 550px;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.recent {
  width: 450px;
  height: 550px;
  background-color: #faabab;
}

.donut-chart {
  margin-top: 30px;
  width: 1380px;
  height: 823px;
  background-color: #faabab;
}
</style>
