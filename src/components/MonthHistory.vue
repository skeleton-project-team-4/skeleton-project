<template>
  <div class="month-history">
    <div class="calendar-summary-wrapper">
      <MonthCalendar v-model="currentDate" :transactions="transactions" />
      <div class="summary-box-wrapper">
        <MonthSummary :currentDate="currentDate" :transactions="transactions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MonthCalendar from './MonthCalendar.vue'
import MonthSummary from './MonthSummary.vue'
import { useTransactionsStore } from '@/stores/transactions'

const currentDate = ref(new Date())

const transactionStore = useTransactionsStore()
const transactions = computed(() => transactionStore.getTransactions)

onMounted(() => {
  transactionStore.fetchTransactionList()
})
</script>

<style scoped>
.month-history {
  background-color: #f6f4f4;
  box-shadow: 0px 5px 5px #c9c9c9;
  width: 900px;
  height: 550px;
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0; /* 화면 작아져도 여백 크기 고정 */
}

.calendar-summary-wrapper {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  gap: 20px;
}
.summary-box-wrapper {
  margin-top: 40px;
}
</style>
