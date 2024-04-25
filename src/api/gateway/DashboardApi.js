import axios from "axios"
import { GATEWAY_URL } from "./GatewayApi"
import { HTTP_METHOD, gatewayFetch } from "./GatewayFetch"


const axiosInstance = axios.create({
  baseURL: GATEWAY_URL,
  timeout: 5000
})

const DashboardApi = {
  async getGroups(gateway) {
    const response = await gatewayFetch({
      url: '/dashboard',
      method: HTTP_METHOD.GET,
      gateway
    })
    return response.data
  },
  async createGroup(group, gateway) {
    const response = await gatewayFetch({
      url: '/dashboard',
      method: HTTP_METHOD.POST,
      data: group,
      gateway
    })
    return response.status === 201
  },
  async updateGroup(group, gateway) {
    const response = await gatewayFetch({
      url: '/dashboard',
      method: HTTP_METHOD.PUT,
      data: group,
      gateway
    })
    return response.status === 200
  },
  async deleteGroup(groupId, gateway) {
    const response = await gatewayFetch({
      url: '/dashboard/' + groupId,
      method: HTTP_METHOD.DELETE,
      gateway
    })
    return response.status === 200
  }
}

export { DashboardApi }