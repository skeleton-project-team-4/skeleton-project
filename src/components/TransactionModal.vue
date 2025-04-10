<template>
  <div>
    <div v-if="modalCheck" class="modal-backdrop"></div>
    <div
      class="modal"
      :class="{ show: modalCheck }"
      :style="{ display: modalCheck ? 'block' : 'none' }"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header d-flex justify-content-between">
            <h5 class="modal-title">거래내역 {{ props.type === 'add' ? '추가' : '상세' }}</h5>
            <button class="border-0 bg-white" @click="$emit('close')">
              <span>&times;</span>
            </button>
          </div>
          <form>
            <div class="modal-body">
              <div class="form-group mb-3">
                <label class="row-title"
                  >날짜
                  <input
                    v-if="props.type === 'add'"
                    type="text"
                    readonly
                    :value="date.valueOf()"
                    class="form-control mt-1"
                  />
                  <input
                    v-else-if="props.type === 'detail'"
                    type="text"
                    readonly
                    :value="getTransaction.date"
                    class="form-control mt-1"
                  />
                </label>
              </div>
              <div class="form-group mb-3">
                <label class="row-title"
                  >제목
                  <div class="input-group mt-1">
                    <input
                      v-if="props.type === 'add'"
                      type="text"
                      v-model="newTransaction.detailCategory"
                      class="form-control"
                    />
                    <div
                      v-else-if="props.type === 'detail'"
                      class="input-group d-flex justify-content-center align-items-center"
                    >
                      <input
                        type="text"
                        v-model="transaction.detailCategory"
                        :disabled="!isEditable.detailCategory"
                        class="form-control"
                        :class="isEditable.detailCategory ? 'editable-input' : ''"
                      />
                      <div class="input-group-prepend" :hidden="isEditable.detailCategory">
                        <div
                          class="input-group-text"
                          @click="inputToEdit('detailCategory')"
                          id="basic-addon1"
                        >
                          <font-awesome-icon :icon="['fas', 'pencil']" style="color: #2868b0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
              <div class="form-group mb-3">
                <label class="row-title"
                  >수입 / 지출
                  <div class="input-group mt-1">
                    <select
                      v-if="props.type === 'add'"
                      v-model="newTransaction.type"
                      class="form-control"
                    >
                      <option value="income">수입</option>
                      <option value="expense">지출</option>
                    </select>
                    <div
                      v-else-if="props.type === 'detail'"
                      class="input-group d-flex justify-content-center align-items-center"
                    >
                      <select
                        v-if="isEditable.type"
                        v-model="transaction.type"
                        class="form-control"
                      >
                        <option value="income">수입</option>
                        <option value="expense">지출</option>
                      </select>
                      <template v-else>
                        <input
                          type="text"
                          :value="typeToKorean(transaction.type)"
                          disabled
                          class="form-control"
                        />
                        <div class="input-group-prepend">
                          <div
                            class="input-group-text"
                            @click="inputToEdit('type')"
                            id="basic-addon1"
                          >
                            <font-awesome-icon :icon="['fas', 'pencil']" style="color: #2868b0" />
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </label>
              </div>
              <div class="form-group mb-3">
                <label class="row-title"
                  >카테고리
                  <div class="input-group mt-1">
                    <select
                      v-if="props.type === 'add'"
                      v-model="newTransaction.category"
                      class="form-control"
                    >
                      <option
                        v-for="option in categoryOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.text }}
                      </option>
                    </select>
                    <div
                      v-else-if="props.type === 'detail'"
                      class="input-group d-flex justify-content-center align-items-center"
                    >
                      <select
                        v-if="isEditable.category"
                        v-model="transaction.category"
                        class="form-control"
                      >
                        <option
                          v-for="option in detailCategoryOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.text }}
                        </option>
                      </select>
                      <template v-else>
                        <input
                          type="text"
                          :value="categoryToKorean(transaction.category)"
                          disabled
                          class="form-control"
                        />
                        <div class="input-group-prepend">
                          <div
                            class="input-group-text"
                            @click="inputToEdit('category')"
                            id="basic-addon1"
                          >
                            <font-awesome-icon :icon="['fas', 'pencil']" style="color: #2868b0" />
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </label>
              </div>
              <div class="form-group mb-3">
                <label class="row-title"
                  >금액
                  <div class="input-group mt-1">
                    <input
                      type="text"
                      v-if="props.type === 'add'"
                      v-model="amountText"
                      class="form-control"
                    />
                    <div
                      v-else-if="props.type === 'detail'"
                      class="input-group d-flex justify-content-center align-items-center"
                    >
                      <input
                        type="text"
                        v-model="transaction.amount"
                        :disabled="!isEditable.amount"
                        class="form-control"
                        :class="isEditable.amount ? 'editable-input' : ''"
                      />
                      <div class="input-group-prepend" :hidden="isEditable.amount">
                        <div
                          class="input-group-text"
                          @click="inputToEdit('amount')"
                          id="basic-addon1"
                        >
                          <font-awesome-icon :icon="['fas', 'pencil']" style="color: #2868b0" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <small v-if="errorMsg.amount" class="text-danger">{{ errorMsg.amount }}</small>
                </label>
              </div>
              <div class="form-group mb-3">
                <label class="row-title">
                  메모
                  <div class="input-group mt-1">
                    <input
                      type="text"
                      v-if="props.type === 'add'"
                      v-model="newTransaction.memo"
                      class="form-control"
                    />
                    <div
                      v-else-if="props.type === 'detail'"
                      class="input-group d-flex justify-content-center align-items-center"
                    >
                      <input
                        type="text"
                        v-model="transaction.memo"
                        :disabled="!isEditable.memo"
                        class="form-control"
                        :class="isEditable.memo ? 'editable-input' : ''"
                      />
                      <div class="input-group-prepend" :hidden="isEditable.memo">
                        <div
                          class="input-group-text"
                          @click="inputToEdit('memo')"
                          id="basic-addon1"
                        >
                          <font-awesome-icon :icon="['fas', 'pencil']" style="color: #2868b0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </form>
          <div class="modal-footer d-flex justify-content-center align-items-center">
            <button
              v-if="props.type === 'add'"
              type="button"
              class="btn create-btn"
              @click="create"
            >
              저장
            </button>
            <div
              v-else-if="props.type === 'detail'"
              class="detail-btn-box d-flex justify-content-between align-item-center"
            >
              <button type="button" class="btn edit-btn" @click="modify">수정</button>
              <button type="button" class="btn delete-btn" @click="deleteTransaction">삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTransactionsStore } from '@/stores/transactions'
import { storeToRefs } from 'pinia'
import { computed, watch, reactive, onMounted, ref } from 'vue'

// props 정의
const props = defineProps({
  modalCheck: { type: Boolean, required: true },
  id: { type: Number },
  type: { type: String },
})

const transaction = ref({
  date: '',
  detailCategory: '',
  type: '',
  category: '',
  amount: 0,
  memo: '',
})

const emit = defineEmits(['close'])

// 날짜 초기화
const date = ref('')

// 에러 메시지
const errorMsg = reactive({
  detailCategory: '',
  amount: '',
  memo: '',
})

// 새 거래 내역
const newTransaction = reactive({
  date: computed(() => date.value),
  detailCategory: '',
  type: 'income',
  category: 'salary',
  amount: 0,
  memo: '',
})

// 카테고리 목록
const incomeCategories = [
  { value: 'salary', text: '월급' },
  { value: 'pinMoney', text: '용돈' },
  { value: 'interest', text: '이자' },
]
const expenseCategories = [
  { value: 'learning', text: '학비' },
  { value: 'food', text: '식비' },
  { value: 'transportation', text: '교통비' },
  { value: 'pleasure', text: '유흥' },
  { value: 'utilityBills', text: '공과금' },
]

// 카테고리 옵션: add 모드용
const categoryOptions = computed(() =>
  newTransaction.type === 'income' ? incomeCategories : expenseCategories,
)
// 카테고리 옵션: detail 모드용
const detailCategoryOptions = computed(() =>
  transaction.value.type === 'income' ? incomeCategories : expenseCategories,
)
// 금액 입력
const amountText = computed({
  get() {
    return newTransaction.amount ? newTransaction.amount.toLocaleString() : ''
  },
  set(val) {
    const raw = val.replace(/,/g, '')

    if (/^[1-9]\d*$/.test(raw)) {
      if (raw.length > 15) {
        errorMsg.amount = '금액은 15자리 이하만 입력 가능합니다.'
      } else {
        newTransaction.amount = parseInt(raw)
        errorMsg.amount = ''
      }
    } else if (raw === '') {
      errorMsg.amount = ''
    } else {
      newTransaction.amount = null
      errorMsg.amount = '금액은 0으로 시작하지 않는 숫자만 입력 가능합니다.'
    }
  },
})

// 거래 스토어
const transactionStore = useTransactionsStore()
const { getTransaction } = storeToRefs(transactionStore)
const { fetchTransaction, createTransactions, modifyTransactions, deleteTransactions } =
  transactionStore

// mounted 시 동작
onMounted(async () => {
  today()
  if (props.type === 'detail' && props.id) {
    await fetchTransaction(props.id)
    transaction.value = { ...getTransaction.value }
  }
  if (newTransaction.amount) {
    amountText.value = newTransaction.amount.toLocaleString()
  }
})

// 날짜 포맷
const today = () => {
  const now = new Date()
  date.value = now.toISOString().slice(0, 10)
}

// input 유효성 검사
const validationInput = (mode = 'create') => {
  const target = mode === 'create' ? newTransaction : transaction.value

  const requiredFields = ['date', 'detailCategory', 'category', 'type', 'amount', 'memo']
  const isValid = requiredFields.every((field) => !!target[field])

  if (!isValid) {
    alert('모든 내용은 빈칸 없이 형식에 맞게 작성되어야 합니다!')
    return false
  }

  return true
}

// 생성
const create = async () => {
  if (!validationInput()) return
  await createTransactions(newTransaction)
  emit('close')
}

// 수정 가능 여부
const isEditable = reactive({
  detailCategory: false,
  type: false,
  category: false,
  amount: false,
  memo: false,
})

// 연필 버튼 클릭 시
const inputToEdit = (field) => {
  if (field === 'type') {
    isEditable['category'] = true
  }
  isEditable[field] = true
}

//수정
const modify = async () => {
  if (!validationInput('modify')) return
  await modifyTransactions(props.id, transaction.value)
  emit('close')
}

//삭제
const deleteTransaction = async () => {
  if (confirm('삭제하시겠습니까?')) {
    await deleteTransactions(props.id)
    emit('close')
  }
  return
}

//가져온 타입 한글로 변환
const typeToKorean = (type) => {
  return type === 'income' ? '수입' : '지출'
}
//가져온 카테고리 한글로 변환
const categoryToKorean = (category) => {
  console.log(category)
  switch (category) {
    case 'salary':
      return '월급'
    case 'pinMoney':
      return '용돈'
    case 'interest':
      return '이자'
    case 'learning':
      return '학비'
    case 'food':
      return '식비'
    case 'transportation':
      return '교통비'
    case 'pleasure':
      return '유흥'
    case 'utilityBills':
      return '공과금'
  }
}
//add일때 카테고리 감시
watch(
  () => newTransaction.type,
  (newType) => {
    if (newType === 'income') {
      newTransaction.category = incomeCategories[0].value
    } else if (newType === 'expense') {
      newTransaction.category = expenseCategories[0].value
    }
  },
)
// detail일때 연필버튼 클릭 한 후 카테고리 감시
watch(
  () => transaction.value.type,
  (newType) => {
    if (!isEditable.type) return
    if (newType === 'income') {
      transaction.value.category = incomeCategories[0].value
    } else if (newType === 'expense') {
      transaction.value.category = expenseCategories[0].value
    }
  },
)
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
.row-title {
  font-weight: bold;
}
label {
  width: 100%;
}
select {
  appearance: auto;
}
.btn {
  border-radius: 15px;
}
.create-btn,
.edit-btn {
  background-color: #2868b0;
  color: white;
  font-weight: bold;
}
.detail-btn-box {
  width: 30%;
}
.delete-btn {
  background-color: #b0282a;
  color: white;
}
.input-group-text {
  height: 2.375rem;
  border-start-start-radius: 0;
  border-end-start-radius: 0;
  cursor: pointer;
}
.editable-input {
  border-radius: 6px !important;
}
</style>
