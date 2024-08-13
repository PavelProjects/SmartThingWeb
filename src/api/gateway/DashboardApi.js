import { HTTP_METHOD, gatewayFetch } from './GatewayFetch'

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
  },
  async getGroupValues(groupId, gateway) {
    return (
      await gatewayFetch({
        url: '/dashboard/values/' + groupId,
        method: HTTP_METHOD.GET,
        gateway
      })
    ).data
  },
  async updateGroupValues(groupId, gateway) {
    return (
      await gatewayFetch({
        url: '/dashboard/values/' + groupId,
        method: HTTP_METHOD.PUT,
        gateway
      })
    ).data
  }
}

export { DashboardApi }
