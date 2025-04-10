<template>
  <div class="transaction-list-wrapper">
    <!-- 상단 필터/정렬 영역 -->
    <div class="filter-bar">
      <!-- 카테고리 선택(expenseCategory 목록을 셀렉트 박스에 표시) -->
      <label for="categorySelect">카테고리: </label>
      <select id="categorySelect" v-model="selectedCategory">
        <option value="">전체</option>
        <option v-for="option in combinedCategoryOptions" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>

      <!-- 월별/기간별 체크박스 -->
      <div class="date-filter">
        <label>
          <input type="checkbox" v-model="isMonthly" value="isMonthly" @change="onMonthlyChange" />
          월별
        </label>
        <!-- 월별선택 UI -->
        <select v-model="selectedMonth" :disabled="!isMonthly">
          <option value="">월 선택</option>
          <option v-for="m in 12" :key="m" :value="m">{{ m }}월</option>
        </select>
        <!-- 기간별 체크박스 -->
        <label>
          <input type="checkbox" v-model="isRange" @change="onRangeChange" />
          기간별
        </label>
        <!-- 기간별 선택 UI -->
        <div class="range-filter">
          <input type="date" v-model="startDate" :disabled="!isRange" />
          <input type="date" v-model="endDate" :disabled="!isRange" />
        </div>
      </div>
      <!-- 거래 추가 버튼 (기능 X) -->
      <button class="btn-add" @click="handleAdd">추가</button>
    </div>

    <!-- 거래 내역 리스트 -->
    <ul class="transaction-list">
      <TransactionListItem
        v-for="transaction in transactions"
        :key="transaction.id"
        :transaction="transaction"
        :incomeCategory="incomeCategories"
        :expenseCategory="expenseCategories"
        @open="handleOpenModal"
      />
    </ul>

    <!-- 페이지 네이션 -->
    <div class="pagination">
      <button class="page-arrow" @click="prevPage" :disabled="currentPage === 1">&lt;</button>
      <span> {{ currentPage }} </span>
      <button class="page-arrow" @click="nextPage" :disabled="currentPage === totalPages">
        &gt;
      </button>
    </div>
  </div>
  <!-- 거래내역 modal -->
  <TransactionModal
    v-if="isModalOpen"
    :modalCheck="isModalOpen"
    :type="modalType"
    :id="modalTransactionId"
    @close="closeModal"
    @refresh="fetchTransactions"
  />
</template>

<script setup>
import { useTransactionsStore } from '@/stores/transactions'
import axios from 'axios'
import TransactionListItem from './TransactionListItem.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useCategoryStore } from '@/stores/category'
import TransactionModal from './TransactionModal.vue'

// 페이지 상태관리
const currentPage = ref(1)
const limit = 10 // 한 페이지에 표시할 항목 수
const totalCount = ref(0)
const totalPages = computed(() => Math.ceil(totalCount.value / limit))

// 카테고리 목록 (수입, 지출) -> 지금은 expenseCategories만 사용
const expenseCategories = ref([])
const incomeCategories = ref([])

const selectedCategory = ref('')

// 월별 / 기간별 체크박스, 관련 값
const isMonthly = ref(false) // 월별 체크박스
const isRange = ref(false) // 기간별 체크박스
const selectedMonth = ref('') // 1~12 선택
const startDate = ref('')
const endDate = ref('')

// Pinia store로 거래 내역 데이터 가져오기
const transactionStore = useTransactionsStore()
const transactions = computed(() => transactionStore.getTransactions)
const categoryStore = useCategoryStore()

// 컴포넌트 마운트 시 데이터 fetch
onMounted(async () => {
  await fetchCategoryData()
  await fetchTransactions()
})

// watch
watch(selectedCategory, async (newVal, oldval) => {
  // 카테고리가 선택되어 변경되면 페이지를 1로 초기화하고 다시 요청합니다.
  currentPage.value = 1
  await fetchTransactions()
})

watch([() => isMonthly.value, () => selectedMonth.value], () => {
  // 월별 필터 조건이 바뀌면 다시 첫 페이지부터 요청
  currentPage.value = 1
  fetchTransactions()
})

watch([() => isRange.value, () => startDate.value, () => endDate.value], () => {
  // 기간별 필터 조건 변경 시 다시 요청
  currentPage.value = 1
  fetchTransactions()
})

// 월별 체크박스가 바뀔 때, 기간별을 해제
function onMonthlyChange() {
  if (isMonthly.value) {
    isRange.value = false

    startDate.value = ''
    endDate.value = ''
  } else {
    // 월별 체크 해제 시 selectedMonth도 초기화
    selectedMonth.value = ''
  }
}

// 기간별 체크박스가 바뀔 때, 월별을 해제
function onRangeChange() {
  if (isRange.value) {
    isMonthly.value = false
    selectedMonth.value = ''
  } else {
    // 기간별 체크 해제 시 date 값 초기화
    startDate.value = ''
    endDate.value = ''
  }
}

// 서버 측 필터링 적용

const fetchTransactions = async () => {
  try {
    // extraParams 객체에 월별/기간별 필터 조건을 계산하여 저장
    const extraParams = {}
    if (isMonthly.value && selectedMonth.value) {
      const year = '2025'
      const month = Number(selectedMonth.value)
      const paddedMonth = month < 10 ? '0' + month : month
      const lastDay = new Date(year, month, 0).getDate() // 해당 월의 마지막 날 계산
      extraParams.date_gte = `${year}-${paddedMonth}-01`
      extraParams.date_lte = `${year}-${paddedMonth}-${lastDay}`
    } else if (isRange.value && startDate.value && endDate.value) {
      extraParams.date_gte = startDate.value
      extraParams.date_lte = endDate.value
    }
    // 기본 axios GET 요청 파라미터 구성
    const params = {
      _page: currentPage.value,
      _limit: limit,
    }
    // 카테고리 필터
    if (selectedCategory.value !== '') {
      params.category = selectedCategory.value
    }
    // extraParams를 기본 params에 병합 (날짜 필터 조건 포함)
    Object.assign(params, extraParams)

    const res = await axios.get('/api/transactions', { params })
    // 스토어 함수 호출로 거래 데이터 업데이트
    await transactionStore.fetchTransactionList({
      page: currentPage.value,
      limit,
      category: selectedCategory.value,
      ...extraParams,
    })
    // 응답 헤더에서 전체 거래 개수를 추출하여 totalCount 업데이트
    totalCount.value = parseInt(res.headers['x-total-count'] || '0', 10)
  } catch (e) {
    alert('거래 내역 로딩 오류: ' + e)
  }
}

/**
 * 카테고리 데이터 불러오기 함수
 * - 수입, 지출 카테고리 데이터를 동시에 호출하여 데이터를 받아옵니다.
 */
const fetchCategoryData = async () => {
  try {
    incomeCategories.value = await categoryStore.fetchCategory('income')
    expenseCategories.value = await categoryStore.fetchCategory('expense')
  } catch (e) {
    alert('카테고리 데이터 로딩 오류: ' + e)
  }
}

// 페이지네이션 함수

// 다음 페이지 이동
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchTransactions()
  }
}

// 이전 페이지 이동
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchTransactions()
  }
}

// 카테고리 영어 -> 한글 매핑
const expenseCategoryMapping = {
  learning: '학습비',
  food: '식비',
  transportation: '교통비',
  pleasure: '유흥비',
  utilityBills: '공과금',
}

const incomeCategoryMapping = {
  salary: '월급',
  pinMoney: '용돈',
  interest: '이자',
}

const combinedCategoryOptions = computed(() => {
  // Object.entries()를 사용해 각각의 매핑 객체를 [key, value] 배열로 변환한 후, 옵션 객체로 매핑
  const incomeOptions = Object.entries(incomeCategoryMapping).map(([key, value]) => ({
    value: key,
    text: value,
  }))
  const expenseOptions = Object.entries(expenseCategoryMapping).map(([key, value]) => ({
    value: key,
    text: value,
  }))
  const mergedOptions = [...incomeOptions, ...expenseOptions]
  // 중복 제거 (value 키를 기준으로 중복 제거)
  const uniqueOptionsMap = new Map()
  mergedOptions.forEach((option) => uniqueOptionsMap.set(option.value, option))
  const uniqueOptions = Array.from(uniqueOptionsMap.values())

  // 한글 텍스트(text)를 기준으로 오름차순 정렬
  uniqueOptions.sort((a, b) => a.text.localeCompare(b.text))

  return uniqueOptions
})

const isModalOpen = ref(false)
const modalType = ref('add')
const modalTransactionId = ref(null)
// TransactionListItem 컴포넌트에서 open 이벤트 발생 시 호출되는 핸들러
const handleOpenModal = (transaction) => {
  modalType.value = 'detail'
  modalTransactionId.value = transaction.id
  isModalOpen.value = true
}

// 거래 추가 버튼 클릭 핸들러
const handleAdd = () => {
  modalType.value = 'add'
  modalTransactionId.value = null
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}
</script>

<style scoped>
.transaction-list-wrapper {
  width: 90%;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-radius: 0.75rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.filter-bar {
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1rem;
  padding: 3rem 0;
}

.filter-bar label {
  font-weight: 600;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-add {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background-color: #2868b0;
  color: white;
}

.transaction-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background-color: transparent;
  margin-top: 1rem;
}
.page-arrow {
  background: none;
  border: none;
  outline: none;
  -webkit-appearance: none;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  transition: color 0.2s;
}

.page-arrow:hover:not(:disabled) {
  color: #000;
}

.page-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.current-page {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}
</style>
