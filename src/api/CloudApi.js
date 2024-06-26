import axios from 'axios'

export const CLOUD_IP = import.meta.env.VITE_CLOUD_IP || document.location.hostname
export const CLOUD_PORT = import.meta.env.VITE_CLOUD_PORT
export const CLOUD_BROKER_URL = `ws://${CLOUD_IP}:${CLOUD_PORT}/smt-ws`

const REFRESH_TOKEN_KEY = "refresh-token"

const URL_AUTH = '/auth'
const URL_AUTH_USER = '/auth/user'
const URL_REFRESH_USER = '/auth/user/refresh'
const URL_AUTH_GATEWAY = '/auth/gateway'
const URL_LOGOUT_USER = '/auth/user/logout'
const URL_LOGOUT_GATEWAY = '/auth/gateway/logout'
const URL_GATEWAY_BY_ID = '/gateway/management'
const URL_GATEWAYS_LIST = '/gateway/management/list'
const URL_GATEWAY_REQUEST = '/gateway/requests'
const URL_GATEWAY_CREATE = '/gateway/management/create'
const URL_GATEWAY_UPDATE = '/gateway/management/update'
const URL_GATEWAY_DELETE = '/gateway/management/delete'

const axiosInstance = axios.create({
  baseURL: `http://${CLOUD_IP}:${CLOUD_PORT}`,
  timeout: 5000,
  withCredentials: true,
})

// todo smh made this global for all requests
const refreshToken = async () => {
  console.debug("Token died, trying to refresh")
  const localRefresh = localStorage.getItem(REFRESH_TOKEN_KEY)
  if (!localRefresh) {
    console.debug("No refresh token")
    return
  }
  try {
    const { refresh } = (await axiosInstance.post(URL_REFRESH_USER, { refreshToken: localRefresh })).data
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
    console.debug("Token refreshed")
    return true
  } catch (error) {
    console.error("Failed to refresh token", error)
  }
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { status, url } = error?.response ?? {}
    if (status === 401 && ![URL_AUTH, URL_REFRESH_USER].includes(url)) {
      if (await refreshToken()) {
        console.debug("Trying to send request again")
        return axiosInstance.request(error.config)
      }
    }
    return Promise.reject(error);
  }
)

const CloudApi = {
  async authUser(login, password) {
    const { refresh } = (await axiosInstance.post(URL_AUTH_USER, { login, password })).data
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
  },
  async getAuthentication() {
    return (await axiosInstance.get(URL_AUTH)).data
  },
  async authGateway(gateway) {
    return (await axiosInstance.post(URL_AUTH_GATEWAY, {
      gatewayId: gateway.id,
      days: 0
    })).data
  },
  async logoutUser() {
    await axiosInstance.post(URL_LOGOUT_USER, {})
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
  async logoutGateway(gateway) {
    await axiosInstance.post(URL_LOGOUT_GATEWAY, {
      gatewayId: gateway.id
    })
  },
  async getGateway(id) {
    return (await axiosInstance.get(`${URL_GATEWAY_BY_ID}/${id}`)).data
  },
  async getGatewaysList() {
    return (await axiosInstance.get(URL_GATEWAYS_LIST)).data
  },
  async createGateway({ name, description }) {
    await axiosInstance.post(URL_GATEWAY_CREATE, { name, description })
  },
  async updateGateway({ id, name, description }) {
    await axiosInstance.put(URL_GATEWAY_UPDATE, { id, name, description })
  },
  async deleteGateway(gateway) {
    await axiosInstance.delete(URL_GATEWAY_DELETE + '/' + gateway.id)
  },
  async sendGatewayRequest(gateway, url, method, data) {
    return await axiosInstance.post(URL_GATEWAY_REQUEST + "/" + gateway.id, {
      url,
      method,
      data
    })
  },
  async sendGatewayCommand(gateway, command, parameters) {
    return await axiosInstance.post(URL_GATEWAY_REQUEST + '/command', {
      gatewayId: gateway.id,
      command,
      parameters
    })
  },
  async sendDeviceRequest({ gateway, device, command, params }) {
    return await axiosInstance.post(URL_GATEWAY_REQUEST + '/device', {
      gatewayId: gateway.id,
      device,
      command,
      params,
    })
  }
}
export { CloudApi }
