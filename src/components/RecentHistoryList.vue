<template>
  <div class="recentbox py-4">
    <div class="mt-4 fw-bold d-flex justify-content-center">최근 내역</div>
    <div class="mt-4 d-flex justify-content-around">
      <span
        class="btn custom-button ps-4"
        style="font-size: 20px"
        :class="ShowExpense ? 'fw-bold' : 'custom-button-muted'"
        @click="ShowExpense = true"
        >지출</span
      >
      <span
        class="btn custom-button pe-4"
        style="font-size: 20px"
        :class="!ShowExpense ? 'fw-bold' : 'custom-button-muted'"
        @click="ShowExpense = false"
        >수입</span
      >
    </div>
    <div class="d-flex">
      <div class="custom-line col-6" :class="{ 'custom-line-muted': !ShowExpense }"></div>
      <div class="custom-line col-6" :class="{ 'custom-line-muted': ShowExpense }"></div>
    </div>
    <br />

    <div class="row" v-if="ShowExpense">
      <div class="my-3 col-12 d-flex justify-content-around">
        <span class="fw-bold" style="color: red">{{ currentMonth }}월 총지출:</span>
        <span class="fw-bold">{{ expense.toLocaleString() }}원</span>
      </div>
      <hr class="mb-4" style="width: 100%" />
      <div v-if="expenseItem.length === 0">
        <span class="justify-content-center d-flex">이번달 지출 내역이 없습니다</span>
      </div>
      <div
        class="col-12 d-flex justify-content-around px-0 my-3"
        v-for="item in expenseItem"
        :key="item.id"
      >
        <span class="me-1">{{ item.detailCategory }}</span>
        <span class="ms-1">{{ item.amount.toLocaleString() }}원</span>
      </div>
    </div>

    <div class="row" v-else>
      <div class="my-3 col-12 d-flex justify-content-around">
        <span class="fw-bold" style="color: red">{{ currentMonth }}월 총수입:</span>
        <span class="fw-bold">{{ income.toLocaleString() }}원</span>
      </div>
      <hr style="width: 100%" />
      <div v-if="incomeItem.length === 0">
        <span class="justify-content-center d-flex">이번달 수입 내역이 없습니다</span>
      </div>
      <div
        class="col-12 d-flex justify-content-around px-0 my-3"
        v-for="item in incomeItem"
        :key="item.id"
      >
        <span class="fs-5 me-1">{{ item.detailCategory }}</span>
        <span class="fs-5 ms-1">{{ item.amount.toLocaleString() }}원</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTransactionsStore } from '@/stores/transactions'

const ShowExpense = ref(true)
const transactionStore = useTransactionsStore()
const transactions = computed(() => transactionStore.getTransactions)

// 현재 날짜 기준 연도, 월 계산
const currentDate = ref(new Date())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth() + 1)

// 해당 월의 거래 필터링
const filterByMonth = (type) => {
  return transactions.value.filter((t) => {
    const date = new Date(t.date)
    return (
      t.type === type &&
      date.getFullYear() === currentYear.value &&
      date.getMonth() + 1 === currentMonth.value
    )
  })
}

// 총 수입/지출 계산
const expense = computed(() => filterByMonth('expense').reduce((sum, t) => sum + t.amount, 0))
const income = computed(() => filterByMonth('income').reduce((sum, t) => sum + t.amount, 0))

// 최근 3개 내역 추출
const expenseItem = computed(() =>
  filterByMonth('expense')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3),
)
const incomeItem = computed(() =>
  filterByMonth('income')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3),
)

// 컴포넌트 마운트 시 해당 월 거래 내역 불러오기
onMounted(() => {
  transactionStore.fetchTransactionList()
})
</script>

<style scoped>
* {
  font-size: 20px;
}
.recentbox {
  width: 450px;
  height: 550px;
  overflow-x: hidden;
  background-color: #f5f5f5;
  box-shadow: 0px 5px 5px #c9c9c9;
}
.custom-button-muted {
  color: #b0b0b0;
}
.custom-button:hover {
  font-weight: bold;
}
.custom-line {
  width: 50%;
  height: 2px;
  background-color: black;
}
.custom-line-muted {
  background-color: #f5f5f5;
}
</style>
