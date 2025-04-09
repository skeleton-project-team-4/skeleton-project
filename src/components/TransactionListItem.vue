<template>
  <!-- :class=[transaction.type]로 income/expense를동적으로 지정하여,
     전체 배경색을 녹색/분홍색으로 구분.
-->
  <li class="transaction-item" :class="[transaction.type]" @click="openModal">
    <!-- 왼쪽 섹션: 아이콘 -->
    <div class="left-section">
      <div class="icon">
        <font-awesome-icon :icon="['fas', iconClass]" />
      </div>
    </div>

    <!-- 중앙 섹션: 날짜(위) + detailCategory (아래) -->
    <div class="center-section">
      <div class="date">{{ transaction.date }}</div>
      <div class="detailCategory">{{ transaction.detailCategory }}</div>
    </div>

    <!-- 오른쪽 섹션: 금액 표시 -->
    <div class="right-section">
      <div
        class="amount"
        :class="[transaction.type === 'income' ? 'income-amount' : 'expense-amount']"
      >
        {{ sign }}{{ formattedAmount }}
      </div>
    </div>
  </li>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
/* 
  incomeCategory, expenseCategory 배열도 prop으로 받아와,
  transaction.category(예: '월급', '유흥')에 맞는 아이콘을 검색할 수 있습니다.
  필요에 따라 store나 상위 컴포넌트에서 이 배열들을 전달.
*/
const props = defineProps({
  transaction: { type: Object, required: true },
  incomeCategory: { type: Array, required: false, default: () => [] },
  expenseCategory: { type: Array, required: false, default: () => [] },
})

const emit = defineEmits(['open'])
// 클릭 시 부모 컴포넌트에 'open' 이벤트를 보내고, 선택된 transaction 데이터를 전달
const openModal = () => {
  emit('open', props.transaction)
}
// 수입/지출 기호 설정
const sign = computed(() => (props.transaction.type === 'expense' ? '-' : '+'))

// 금액 포맷 (3자리 콤마 등)
const formattedAmount = computed(() => props.transaction.amount.toLocaleString() + '원')

/**
 * 아이콘 HTML을 계산해 반환:
 * 1) 수입이면 incomeCategory 배열에서 해당 category(예: '월급')를 찾는다.
 * 2) 지출이면 expenseCategory 배열에서 해당 category(예: '식비')를 찾는다.
 * 없는 경우 물음표 아이콘 등 대체 아이콘 사용 가능
 */
const iconClass = computed(() => {
  if (props.transaction.type === 'income') {
    const cat = props.incomeCategory.find((c) => c.name === props.transaction.category)
    return cat?.icon || 'question'
  } else {
    const cat = props.expenseCategory.find((c) => c.name === props.transaction.category)
    return cat?.icon || 'question'
  }
})
</script>

<!-- 스타일은 임시로 했습니다 -->
<style scoped>
.transaction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

/* 금액 영역에 조건에 따라 수입/지출 색상 적용 */
.transaction-item.income {
  background-color: #e8fff1;
}
.transaction-item.expense {
  background-color: #fff0f0;
}

/* 왼쪽 섹션: 아이콘 + 카테고리명을 가로로 배치 */
.left-section {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

/* 아이콘(HTML string) */
.icon {
  font-size: 1.5rem; /* 아이콘 크기 조절 */
  margin-right: 8px;
}

/* 카테고리 텍스트 (예: '월급', '학습', '유흥' 등) */
.category {
  font-size: 1.1rem;
  font-weight: 600;
}

/* 중앙 섹션: 날짜(위) + detailCategory(아래)를 세로로 배치 */
.center-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: auto; /* 오른쪽 섹션을 끝으로 밀기 위해 사용 */
}

/* 날짜 텍스트 */
.date {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 4px;
}

/* detailCategory */
.detailCategory {
  font-size: 1rem;
  font-weight: normal;
  color: #333;
}

/* 오른쪽 섹션: 금액 */
.right-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* 금액 문구 */
.amount {
  font-size: 1.1rem;
  font-weight: bold;
}
</style>
