import axios from 'axios'
import { HTTP_METHOD, gatewayFetch, GATEWAY_URL } from './GatewayFetch'

const PATH_BUILD_INFO = '/api/build'
const PATH_AUTHENTICATION = '/api/cloud/identity'
const PATH_LOGIN = '/api/cloud/login'
const PATH_LOGOUT = '/api/cloud/logout'
const PATH_CLOUD_CONFIG = '/api/cloud/config'
const PATH_CLOUD_CONNECTED = '/api/cloud/connection/status'
const PATH_CLOUD_CONNECT = '/api/cloud/connection/connect'
const PATH_CLOUD_DISCONNECT = '/api/cloud/connection/disconnect'
const PATH_SEARCH_ENABLED = '/api/devices/search/enabled'
const PATH_DEVICES_FOUND = '/api/devices/found'
const PATH_DEVICES_SAVED = '/api/devices/saved'
const PATH_DEVICE_API = '/api/device/api'
const PATH_DEVICE_LOGS = '/api/devices/logs'
const PATH_DEVICE_SETTINGS = '/api/devices/settings'

// todo move to different file
const axiosInstance = axios.create({
  baseURL: GATEWAY_URL,
  timeout: 5000
})

const GatewayApi = {
  // only local
  async callDeviceApi({ device, command, params }) {
    return await axiosInstance.post(PATH_DEVICE_API, {
      command,
      device,
      params
    })
  },
  async getCloudAuthentication() {
    const response = await axiosInstance.get(PATH_AUTHENTICATION)
    return response.data
  },
  async cloudLogin(payload) {
    const response = await axiosInstance.post(PATH_LOGIN, payload)
    return response.data
  },
  async cloudLogout() {
    const response = await axiosInstance.delete(PATH_LOGOUT)
    return response.status === 200
  },
  async getCloudConfig() {
    const response = await axiosInstance.get(PATH_CLOUD_CONFIG)
    return response.data
  },
  async getConnectionStatus() {
    const response = await axiosInstance.get(PATH_CLOUD_CONNECTED)
    return response.data
  },
  async cloudConnect() {
    const response = await axiosInstance.put(PATH_CLOUD_CONNECT)
    return response.status === 200
  },
  async cloudDisconnect() {
    const response = await axiosInstance.put(PATH_CLOUD_DISCONNECT)
    return response.status === 200
  },
  // Cloud supported methods
  async getBuildInfo(gateway) {
    return (
      await gatewayFetch({
        url: PATH_BUILD_INFO,
        method: HTTP_METHOD.GET,
        gateway
      })
    ).data
  },
  // todo move to device api (get methods)
  async getDeviceApiMethods({ device: { name, ip }, gateway }) {
    return (
      await gatewayFetch({
        url: `${PATH_DEVICE_API}/methods?name=${name}&ip=${ip}`,
        method: HTTP_METHOD.GET,
        gateway
      })
    ).data
  },
  async getLogs(gateway, filters = {}) {
    const params = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) {
        acc.push(`${key}=${value}`)
      }
      return acc
    }, [])
    const query = params.length === 0 ? '' : `?${params.join('&')}`

    const response = await gatewayFetch({
      url: `${PATH_DEVICE_LOGS}${query}`,
      method: HTTP_METHOD.GET,
      gateway
    })
    return response.data
  },
  async getDevicesSettings(gateway) {
    const response = await gatewayFetch({
      url: PATH_DEVICE_SETTINGS,
      method: HTTP_METHOD.GET,
      gateway
    })
    return response.data
  },
  async updateDeviceSettings({ id, name, value }, gateway) {
    const response = await gatewayFetch({
      url: PATH_DEVICE_SETTINGS,
      method: HTTP_METHOD.PUT,
      data: { id, name, value },
      gateway
    })
    return response.data
  },
  async createDeviceSettings({ name, value }, gateway) {
    const response = await gatewayFetch({
      url: PATH_DEVICE_SETTINGS,
      method: HTTP_METHOD.POST,
      data: { name, value },
      gateway
    })
    return response.data
  },
  async deleteDeviceSettings(id, gateway) {
    const response = await gatewayFetch({
      url: `${PATH_DEVICE_SETTINGS}/${id}`,
      method: HTTP_METHOD.DELETE,
      data: { name: id },
      gateway
    })
    return response.status === 200
  },
  async deviceSearchEnabled(gateway) {
    return (await gatewayFetch({ gateway, url: PATH_SEARCH_ENABLED, method: HTTP_METHOD.GET })).data
  },
  async getFoundDevices(gateway) {
    const response = await gatewayFetch({
      gateway,
      url: PATH_DEVICES_FOUND,
      method: HTTP_METHOD.GET
    })
    return response.data
  },
  async getSavedDevices(gateway) {
    return (await gatewayFetch({ gateway, url: PATH_DEVICES_SAVED, method: HTTP_METHOD.GET })).data
  },
  async addDevice(ip, gateway) {
    return (
      await gatewayFetch({
        gateway,
        url: PATH_DEVICES_SAVED + '?ip=' + ip,
        method: HTTP_METHOD.POST
      })
    ).data
  },
  async updateSavedDevice(ip, gateway) {
    return (
      await gatewayFetch({
        gateway,
        url: PATH_DEVICES_SAVED + '?ip=' + ip,
        method: HTTP_METHOD.PUT
      })
    ).data
  },
  async deleteSavedDevice(ip, gateway) {
    await gatewayFetch({
      gateway,
      url: PATH_DEVICES_SAVED + '?ip=' + ip,
      method: HTTP_METHOD.DELETE
    })
  }
}

export { GatewayApi }
