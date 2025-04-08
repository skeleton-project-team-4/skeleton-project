import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([])
  const filters = reactive({
    page: 1,
    limit: 10,
    sort: 'date',
    order: 'desc',
    date_gte: '2000-01-01',
    date_lte: '2099-12-31',
    category: '',
  })

  const getTransactions = computed(() => transactions.value)

  //params 생성 함수
  const buildParams = (sortBy = {}) => {
    //sortBy에 있으면 sortBy의 값으로, 없으면 default인 fiters의 값으로
    const {
      page = filters.page,
      limit = filters.limit,
      sort = filters.sort,
      order = filters.order,
      date_gte = filters.date_gte,
      date_lte = filters.date_lte,
      category = filters.category,
    } = sortBy

    const params = {
      _page: page,
      _limit: limit,
      _sort: sort,
      _order: order,
      date_gte,
      date_lte,
    }

    //category가 있다면 params에 추가
    if (category?.trim()) {
      params.category = category
    }

    return params
  }

  const fetchTransactionList = async (sortBy = {}) => {
    try {
      const params = buildParams(sortBy)
      const { data } = await axios.get('/api/transactions', { params })
      transactions.value = data
    } catch (error) {
      console.error('거래 내역을 가져오지 못했습니다.')
    }
  }

  //거래내역 생성함수
  const createTransactions = async (transaction) => {
    try {
      await axios.post('/api/transactions', transaction)
      alert('저장되었습니다!')
    } catch (error) {
      console.error('거래 저장 실패')
    }
  }

  //거래내역 수정함수
  const modifyTransactions = async (id, transaction) => {
    try {
      await axios.put(`/api/transactions/${id}`, transaction)
      alert('수정되었습니다!')
    } catch (error) {
      console.error('거래 수정 실패')
    }
  }

  //거래내역 삭제함수
  const deleteTransactions = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`)
      alert('삭제되었습니다!')
    } catch (error) {
      console.error('거래 삭제 실패')
    }
  }

  return {
    getTransactions,
    fetchTransactionList,
    createTransactions,
    modifyTransactions,
    deleteTransactions,
  }
})
