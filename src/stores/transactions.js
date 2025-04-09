import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref([])
  const transaction = ref({}) //단일조회
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
  const getTransaction = computed(() => transaction.value)
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

  //거래내역 전체조회
  const fetchTransactionList = async (sortBy = {}) => {
    try {
      const params = buildParams(sortBy)
      const { data } = await axios.get('/api/transactions', { params })
      transactions.value = data
    } catch (error) {
      alert('거래 내역을 불러올 수 없습니다!')
    }
  }
  const fetchTransaction = async (id) => {
    try {
      if (id === null || id === undefined) {
        alert('거래 내역을 불러올 수 없습니다!')
        return
      }
      const { data } = await axios.get(`/api/transactions/${id}`)
      transaction.value = data
    } catch (error) {
      alert('거래 내역을 불러올 수 없습니다!')
    }
  }

  //거래내역 생성함수
  const createTransactions = async (transaction) => {
    try {
      await axios.post('/api/transactions', transaction)
      alert('저장되었습니다!')
    } catch (error) {
      alert('거래 내역을 저장할 수 없습니다!')
    }
  }

  //거래내역 수정함수
  const modifyTransactions = async (id, transaction) => {
    try {
      await axios.put(`/api/transactions/${id}`, transaction)
      alert('수정되었습니다!')
    } catch (error) {
      alert('거래 내역을 수정할 수 없습니다!')
    }
  }

  //거래내역 삭제함수
  const deleteTransactions = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`)
      alert('삭제되었습니다!')
    } catch (error) {
      alert('거래 내역을 삭제할 수 없습니다!')
    }
  }

  return {
    getTransactions,
    getTransaction,
    fetchTransactionList,
    fetchTransaction,
    createTransactions,
    modifyTransactions,
    deleteTransactions,
  }
})
