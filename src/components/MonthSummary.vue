<template>
  <div class="summary-box">
    <div>
      <div>총 수입</div>
      <div class="amount">{{ totalIncome.toLocaleString() }} 원</div>
    </div>
    <div>
      <div>총 지출</div>
      <div class="amount">{{ totalExpense.toLocaleString() }} 원</div>
    </div>
    <div>
      <div>순이익</div>
      <div class="amount" :style="{ color: '#f33f31' }">{{ netAmount.toLocaleString() }} 원</div>
    </div>
  </div>

  <div class="emoji">
    <div v-if="netAmount < 0">
      <div>분발하세요 ㅠㅅㅠ</div>
      <font-awesome-icon
        :icon="['fas', 'face-sad-tear']"
        style="color: #f33f31"
        class="emoji-icon"
      />
    </div>
    <div v-else>
      <div>부자 되겠어요~🤑</div>
      <font-awesome-icon
        :icon="['fas', 'face-laugh-squint']"
        style="color: #20a316"
        class="emoji-icon"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
  currentDate: {
    type: Date,
    required: true,
  },
})

const totalIncome = computed(() => {
  if (!props.currentDate) return 0
  return props.transactions
    .filter(
      (t) =>
        t.type === 'income' &&
        new Date(t.date).getMonth() === props.currentDate.getMonth() &&
        new Date(t.date).getFullYear() === props.currentDate.getFullYear(),
    )
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalExpense = computed(() => {
  if (!props.currentDate) return 0
  return props.transactions
    .filter(
      (t) =>
        t.type === 'expense' &&
        new Date(t.date).getMonth() === props.currentDate.getMonth() &&
        new Date(t.date).getFullYear() === props.currentDate.getFullYear(),
    )
    .reduce((sum, t) => sum + t.amount, 0)
})

const netAmount = computed(() => (props.currentDate ? totalIncome.value - totalExpense.value : 0))
</script>

<style scoped>
.summary-box {
  padding: 10px;
  border-radius: 10px;
  background: #ffbdbd;
  width: 210px;
  height: 240px;
  min-width: 210px;
  min-height: 240px;
  font-size: 20px;
  text-align: center;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.amount {
  font-weight: bold;
}

.emoji {
  margin-top: 75px;
  font-size: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.emoji-icon {
  margin-top: 30px;
  width: 70px;
  height: 70px;
}
</style>
