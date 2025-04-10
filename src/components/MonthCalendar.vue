<template>
  <div>
    <VCalendar
      title-position="center"
      mode="date"
      v-model="calendarDate"
      @did-move="handleMonthChanged"
      class="calendar-component"
    >
      <template #day-content="{ day }">
        <div class="vc-day-content">
          <div>{{ day.day }}</div>
          <div class="amount income" v-if="getIncome(day.date)" style="color: green">
            +{{ getIncome(day.date).toLocaleString() }}원
          </div>
          <div class="amount expense" v-if="getExpense(day.date)" style="color: red">
            -{{ getExpense(day.date).toLocaleString() }}원
          </div>
        </div>
      </template>
    </VCalendar>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    // 현재 선택된 날짜
    type: Date,
    required: true,
  },
  transactions: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const calendarDate = computed({
  get: () => props.modelValue,
  set: (val) => {
    console.log('📅 달 변경:', val)
    emit('update:modelValue', val)
  },
})

const formatDate = (date) => {
  return (
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0')
  )
}

const getIncome = (date) => {
  const str = formatDate(date)
  return props.transactions
    .filter((t) => t.date === str && t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
}

const getExpense = (date) => {
  const str = formatDate(date)
  return props.transactions
    .filter((t) => t.date === str && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
}

const handleMonthChanged = (page) => {
  const newDate = new Date(page[0].year, page[0].month - 1, 1) // Date의 month는 0부터
  calendarDate.value = newDate
}
</script>

<style scoped>
:deep(.vc-container) {
  width: 630px;
  height: 490px;
}

:deep(.vc-header) {
  margin-bottom: 5px;
}

:deep(.vc-weeks) {
  display: flex;
  flex-direction: column;
  height: 445px; /* 달력 헤더와 요일 표시줄을 제외한 높이 */
}

:deep(.vc-week) {
  flex: 1;
  min-height: 0;
  display: flex;
}

:deep(.vc-day) {
  flex: 1;
  min-height: 0;
}
.vc-day-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 3px;
  font-size: 12px;
}
.amount {
  line-height: 1.2;
  font-size: 12px;
}
</style>
