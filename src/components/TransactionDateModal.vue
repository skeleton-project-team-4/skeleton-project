<template>
  <div v-if="modalCheck" class="modal-backdrop"></div>
  <div
    class="modal"
    :class="{ show: modalCheck }"
    :style="{ display: modalCheck ? 'block' : 'none' }"
    tabindex="-1"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header d-flex justify-content-between align-items-center">
          <span></span>
          <h5 class="modal-title">{{ selectDate }} 거래내역</h5>
          <button
            type="button"
            class="close border-0 bg-white"
            data-dismiss="modal"
            aria-label="Close"
            @click="$emit('close')"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
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
        <div class="modal-body">
          <div class="row" v-if="ShowExpense">
            <div class="my-3 col-12 d-flex justify-content-around px-4">
              <span class="fw-bold" style="color: red">총지출:</span>
              <span class="fw-bold">{{ expense.toLocaleString() }}원</span>
            </div>
            <hr class="mb-4" style="width: 100%" />
            <div v-if="expenseItem.length === 0">
              <span class="justify-content-center d-flex">지출 내역이 없습니다</span>
            </div>
            <div
              class="d-flex justify-content-between px-4 my-1 item-box mx-auto"
              v-for="item in expenseItem"
              :key="item.id"
            >
              <span class="me-1">{{ item.detailCategory }}</span>
              <span class="ms-1">{{ item.amount.toLocaleString() }}원</span>
            </div>
          </div>

          <div class="row" v-else>
            <div class="my-3 col-12 d-flex px-4 justify-content-around">
              <span class="fw-bold" style="color: red">총수입:</span>
              <span class="fw-bold">{{ income.toLocaleString() }}원</span>
            </div>
            <hr style="width: 100%" />
            <div v-if="incomeItem.length === 0">
              <span class="justify-content-center d-flex">수입 내역이 없습니다</span>
            </div>
            <div
              class="d-flex justify-content-between px-4 my-1 item-box mx-auto"
              v-for="item in incomeItem"
              :key="item.id"
            >
              <span class="me-1">{{ item.detailCategory }}</span>
              <span class="ms-1">{{ item.amount.toLocaleString() }}원</span>
            </div>
          </div>
        </div>
        <div class="modal-footer d-flex justify-content-center align-items-center">
          <button type="button" class="btn btn-danger" data-dismiss="modal" @click="$emit('close')">
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useTransactionsStore } from '@/stores/transactions'
import { storeToRefs } from 'pinia'
import { onMounted, ref, computed } from 'vue'

const props = defineProps({
  modalCheck: { type: Boolean, required: true },
  date: { type: Date, required: true },
})

const transactionStore = useTransactionsStore()
const { getTransactions } = storeToRefs(transactionStore)

const transactions = ref([{}])

const emit = defineEmits(['close'])

const selectDate = ref({})

onMounted(async () => {
  if (props.date) {
    selectDate.value = props.date.toLocaleDateString('sv-SE') // "YYYY-MM-DD"
    const filtered = getTransactions.value.filter((t) => t.date === selectDate.value)
    transactions.value = filtered
  }
})
const filterByDate = (type) => {
  return transactions.value.filter((t) => {
    return t.type === type && selectDate.value === t.date
  })
}

const ShowExpense = ref(true)
const expense = computed(() => filterByDate('expense').reduce((sum, t) => sum + t.amount, 0))
const income = computed(() => filterByDate('income').reduce((sum, t) => sum + t.amount, 0))
const incomeItem = computed(() =>
  transactions.value.filter((t) => t.type === 'income' && t.date === selectDate.value),
)
const expenseItem = computed(() => transactions.value.filter((t) => t.type === 'expense'))
</script>
<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 어두운 반투명 배경 */
  z-index: 1040; /* 모달보다 아래, 기본 z-index와 충돌 방지 */
}
.modal {
  z-index: 1050;
}
.modal-header {
  border-bottom: none;
}
.modal-body {
  max-height: 400px; /* or 50vh, 원하는 크기 조절 가능 */
  overflow-y: auto;
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
.item-box {
  width: 65%;
}
</style>
