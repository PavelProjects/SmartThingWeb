import axios from 'axios'

const { protocol, host, pathname } = document.location;

const CLOUD_API_PATH = import.meta.env.VITE_CLOUD_API_PATH
const CLOUD_ADRESS = import.meta.env.VITE_CLOUD_ADRESS ?? `${host}${pathname}${CLOUD_API_PATH}`
const CLOUD_WS_URL = `${protocol === 'https:' ? 'wss' : 'ws'}://${CLOUD_ADRESS}/smt-ws`
const CLOUD_API_URL = `${protocol}//${CLOUD_ADRESS}`

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

const axiosConfig = {
  baseURL: CLOUD_API_URL,
  timeout: 5000,
  withCredentials: true,
}
const axiosInstance = axios.create(axiosConfig)

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
      if (error?.config?.retry) {
        console.debug("Failed to retry request")
        return error
      }
      if (await refreshToken()) {
        console.debug("Trying to send request again")
        return axiosInstance.request({ ...error.config, retry: true })
      }
    }
    return Promise.reject(error);
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
export { CloudApi, CLOUD_WS_URL, CLOUD_API_URL }
