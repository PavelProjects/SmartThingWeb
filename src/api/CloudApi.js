import axios from 'axios'

const REFRESH_TOKEN_KEY = 'refresh-token'

const URL_AUTH = '/api/auth'
const URL_AUTH_USER = '/api/auth/user'
const URL_REFRESH_USER = '/api/auth/user/refresh'
const URL_AUTH_GATEWAY = '/api/auth/gateway'
const URL_LOGOUT_USER = '/api/auth/user/logout'
const URL_LOGOUT_GATEWAY = '/api/auth/gateway/logout'
const URL_GATEWAY_BY_ID = '/api/gateway/management'
const URL_GATEWAYS_LIST = '/api/gateway/management/list'
const URL_GATEWAY_REQUEST = '/api/gateway/requests'
const URL_GATEWAY_CREATE = '/api/gateway/management/create'
const URL_GATEWAY_UPDATE = '/api/gateway/management/update'
const URL_GATEWAY_DELETE = '/api/gateway/management/delete'

const { pathname } = window.location
const axiosConfig = {
  baseURL: pathname,
  timeout: 5000,
  withCredentials: true
}
const axiosInstance = axios.create(axiosConfig)

let tokenRefreshPromise = undefined

const refreshToken = async () => {
  if (tokenRefreshPromise != undefined) {
    await tokenRefreshPromise
    return true
  }

  const localRefresh = localStorage.getItem(REFRESH_TOKEN_KEY)
  if (!localRefresh) {
    console.debug('No refresh token')
    return
  }
  console.debug('Token died, trying to refresh')
  try {
    tokenRefreshPromise = axios
      .create({ baseURL: pathname })
      .post(URL_REFRESH_USER, { refreshToken: localRefresh })
    const { refresh } = (await tokenRefreshPromise).data
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
    console.debug('Token refreshed')
    return true
  } catch (error) {
    console.error('Failed to refresh token', error)
  }
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { status, config } = error?.response ?? { status: 401, config: {} }
    if (status === 401) {
      if (config?.retry == true) {
        console.debug('Failed to retry request')
        return error
      }
      if (await refreshToken()) {
        console.debug('Trying to send request again')
        return axiosInstance.request({ ...config, retry: true })
      }
    }
    return Promise.reject(error)
  }
)

const CloudApi = {
  async authUser(login, password) {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    const { refresh } = (await axios.post(URL_AUTH_USER, { login, password }, axiosConfig)).data
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
  },
  async getAuthentication() {
    return (await axiosInstance.get(URL_AUTH)).data
  },
  async authGateway(gateway) {
    return (await axiosInstance.post(`${URL_AUTH_GATEWAY}/${gateway.id}`)).data
  },
  async logoutUser() {
    await axiosInstance.post(URL_LOGOUT_USER, {})
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
  async logoutGateway(gateway) {
    await axiosInstance.post(`${URL_LOGOUT_GATEWAY}/${gateway.id}`)
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
    return await axiosInstance.post(URL_GATEWAY_REQUEST + '/' + gateway.name, {
      url,
      method,
      data
    })
  },
  async sendGatewayCommand(gateway, command, parameters) {
    return await axiosInstance.post(URL_GATEWAY_REQUEST + '/command', {
      gatewayName: gateway.name,
      command,
      parameters
    })
  },
  async sendDeviceRequest({ gateway, device, command, params }) {
    return await axiosInstance.post(URL_GATEWAY_REQUEST + '/device', {
      gatewayName: gateway.name,
      device: device.ip,
      command,
      params
    })
  }
}
export { CloudApi }
