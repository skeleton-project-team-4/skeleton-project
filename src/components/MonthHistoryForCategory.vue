<template>
  <div class="box">
    <div class="mt-4 mb-3 fw-bold d-flex justify-content-center">{{ currentMonth }}월 통계</div>
    <div class="d-flex justify-content-center align-items-center">
      <div class="me-2 mt-5 chart-wrapper">
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>
      <div class="ms-4 flex-column d-flex justify-content-between">
        <div
          class="mt-5 ms-5 d-flex justify-content-between align-items-center"
          v-for="(value, key) in amountForCatgory"
          :key="key"
        >
          <div class="ms-4 pe-3 d-flex align-items-center gap-2">
            <font-awesome-icon
              v-if="icons[key]"
              :icon="icons[key]"
              style="width: 40px; height: 40px"
            />
            <div class="ps-4">{{ key }}:</div>
          </div>
          <div class="ps-4">{{ value }}원</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { useTransactionsStore } from '@/stores/transactions'
import { useCategoryStore } from '@/stores/category'

const noDataPlugin = {
  id: 'noData',
  afterDraw(chart) {
    const { datasets } = chart.data
    const total = datasets[0].data.reduce((sum, val) => sum + val, 0)

    if (total === 0) {
      const ctx = chart.ctx
      const { width, height } = chart

      ctx.save()
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = '16px sans-serif'
      ctx.fillStyle = '#999'
      ctx.fillText('지출데이터가 없습니다', width / 2, height / 2)
      ctx.restore()
    }
  },
}

ChartJS.register(Title, Tooltip, Legend, ArcElement, noDataPlugin)

//날짜짜
const currentDate = ref(new Date())
const transactionStore = useTransactionsStore()
const categoryStore = useCategoryStore()

const transactions = computed(() => transactionStore.getTransactions)
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth() + 1)

const labels = ref([])
const icons = ref({})

const labelMap = {
  learning: '학습',
  food: '식비',
  transportation: '교통',
  pleasure: '유흥',
  utilityBills: '공과금',
}

const getLastDateOfMonth = (year, month) => {
  return new Date(year, month, 0).getDate()
}

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

const expenseItems = computed(() => {
  return filterByMonth('expense')
})

//카테고리별로 지출액 계산
const amountForCatgory = computed(() => {
  const result = {}
  labels.value.forEach((label) => {
    result[label] = 0
  })

  expenseItems.value.forEach((item) => {
    const label = labelMap[item.category] || item.category
    if (result[label] !== undefined) {
      result[label] += item.amount
    }
  })

  return result
})

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      data: labels.value.map((label) => amountForCatgory.value[label] || 0),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#AA66CC', '#AAAAAA'],
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: '카테고리별 지출내역',
      font: { size: 22 },
    },
    legend: {
      position: 'bottom',
    },
  },
}

onMounted(async () => {
  const lastDate = getLastDateOfMonth(currentYear.value, currentMonth.value)
  const formattedMonth = String(currentMonth.value).padStart(2, '0')
  await transactionStore.fetchTransactionList({
    date_gte: `${currentYear.value}-${formattedMonth}-01`,
    date_lte: `${currentYear.value}-${formattedMonth}-${lastDate}`,
  })

  const categoryData = await categoryStore.fetchCategory('expense')
  labels.value = categoryData.map((item) => labelMap[item.name] || item.name)

  for (const item of categoryData) {
    const label = labelMap[item.name] || item.name
    icons.value[label] = item.icon || ''
  }
})
</script>
<style scoped>
.box {
  width: 1380px;
  height: 823px;
  margin: 30px auto;
  padding: 2rem;
  overflow-x: hidden;
  background-color: #f5f5f5;
  font-size: 24px;
}
.chart-wrapper {
  height: 564px;
  width: 564px;
  margin-left: -10rem;
}
</style>
