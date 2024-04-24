import axios from "axios"
import { GATEWAY_URL } from "./GatewayApi"


const axiosInstance = axios.create({
  baseURL: GATEWAY_URL,
  timeout: 5000
})

const DashboardApi = {
  async getGroups() {
    const response = await axiosInstance.get('/dashboard')
    return response.data
  },
  async createGroup(group) {
    const response = await axiosInstance.post('/dashboard', group)
    return response.data
  },
  async updateGroup(groupId, group) {
    const response = await axiosInstance.put('/dashboard', group)
    return response.status === 200
  },
  async deleteGroup(groupId) {
    const response = await axiosInstance.delete('/dashboard/' + groupId)
    return response.status === 200
  }
}

export { DashboardApi }