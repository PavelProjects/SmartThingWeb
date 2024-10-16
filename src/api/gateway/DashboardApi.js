import { HTTP_METHOD, gatewayFetch } from './GatewayFetch'

const DashboardApi = {
  async getGroups(gateway) {
    const response = await gatewayFetch({
      url: '/api/dashboard',
      method: HTTP_METHOD.GET,
      gateway
    })
    return response.data
  },
  async createGroup(group, gateway) {
    const response = await gatewayFetch({
      url: '/api/dashboard',
      method: HTTP_METHOD.POST,
      data: group,
      gateway
    })
    return response.status === 201
  },
  async updateGroup(group, gateway) {
    const response = await gatewayFetch({
      url: '/api/dashboard',
      method: HTTP_METHOD.PUT,
      data: group,
      gateway
    })
    return response.status === 200
  },
  async deleteGroup(groupId, gateway) {
    const response = await gatewayFetch({
      url: '/api/dashboard/' + groupId,
      method: HTTP_METHOD.DELETE,
      gateway
    })
    return response.status === 200
  },
  async getGroupValues(groupId, gateway) {
    return (
      await gatewayFetch({
        url: `/api/dashboard/values/${groupId}`,
        method: HTTP_METHOD.GET,
        gateway
      })
    ).data
  },
  async updateValues(groupId, gateway) {
    await gatewayFetch({
      url: `/api/dashboard/values/${groupId}/update`,
      method: HTTP_METHOD.PUT,
      gateway
    })
  }
}

export { DashboardApi }
