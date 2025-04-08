import { defineStore } from 'pinia'
import axios from 'axios'

export const useIncomeCategoryStore = defineStore('incomeCategory', () => {
  const fetchIncomeIcon = async (name) => {
    try {
      const response = await axios.get(`/api/incomeCategory/`, { params: { name } })
      console.log(response)
      return response.data
    } catch (error) {}
  }
  return { fetchIncomeIcon }
})
