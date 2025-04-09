import { defineStore } from 'pinia'
import axios from 'axios'

export const useCategoryStore = defineStore('category', () => {
  const category = {
    expense: 'expenseCategory',
    income: 'incomeCategory',
  }

  const fetchIcon = async (type, name) => {
    const requestCategory = category[type]
    if (!requestCategory) {
      alert('지원하지 않는 형식입니다!')
      return
    }
    try {
      const response = await axios.get(`/api/${requestCategory}`, { params: { name } })
      return response.data
    } catch (error) {
      console.error('아이콘 로드 실패')
    }
  }
  return { fetchIcon }
})
