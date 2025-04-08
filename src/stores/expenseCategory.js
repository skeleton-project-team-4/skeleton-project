import { defineStore } from 'pinia'
import axios from 'axios'

export const useExpenseCategoryStore = defineStore('expenseCategory', () => {
  const fetchExpenseIcon = async (name) => {
    try {
      const response = await axios.get(`/api/expenseCategory/`, { params: { name } })
      return response.data
    } catch (error) {
      console.error('아이콘 로드 실패')
    }
  }
  return { fetchExpenseIcon }
})
