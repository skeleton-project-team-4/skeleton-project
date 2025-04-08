import { defineStore } from 'pinia'
import axios from 'axios'

export const useIncomeCategoryStore = defineStore('incomeCategory', () => {
  const fetchIncomeIcon = async (name) => {
    try {
      const response = await axios.get(`/api/incomeCategory/`, { params: { name } })
      return response.data
    } catch (error) {
      console.error('아이콘 로드 실패')
    }
  }
  return { fetchIncomeIcon }
})
