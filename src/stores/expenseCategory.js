import { defineStore } from 'pinia'
import axios from 'axios'

export const useExpenseCategoryStore = defineStore('expenseCategory', () => {
  const fetchExpenseIcon = async (name) => {
    try {
      const response = await axios.get(`/api/expenseCategory/`, { params: { name } })
      console.log(response)
      return response.data
    } catch (error) {}
  }
  return { fetchExpenseIcon }
})
