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
  async updateGroupObservables(groupId, observables) {
    const response = await axiosInstance.put('/dashboard/' + groupId, observables)
    return response.status === 200
  },
  async deleteGroup(groupId) {
    const response = await axiosInstance.delete('/dashboard/' + groupId)
    return response.status === 200
  }
}

export { DashboardApi }