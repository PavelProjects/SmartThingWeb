import axios from 'axios'
import { toast } from '../../utils/EventBus'
import { HTTP_METHOD, gatewayFetch } from './GatewayFetch';

const GATEWAY_PATH = import.meta.env.VITE_GATEWAY_IP || document.location.hostname
const GATEWAY_PORT = import.meta.env.VITE_GATEWAY_PORT
export const GATEWAY_URL = `http://${GATEWAY_PATH}${GATEWAY_PORT ? ':' + GATEWAY_PORT : ''}`;
export const GATEWAY_BROKER_URL = `ws://${GATEWAY_PATH}${GATEWAY_PORT ? ':' + GATEWAY_PORT : ''}/smt-ws`

const PATH_AUTHENTICATION = '/cloud/identity'
const PATH_LOGIN = '/cloud/login'
const PATH_LOGOUT = '/cloud/logout'
const PATH_CLOUD_CONFIG = '/cloud/config'
const PATH_CLOUD_CONNECTED = '/cloud/connection/status'
const PATH_CLOUD_CONNECT = '/cloud/connection/connect'
const PATH_CLOUD_DISCONNECT = '/cloud/connection/disconnect'
const PATH_DEVICES_FOUND = '/devices/found'
const PATH_DEVICES_SAVED = '/devices/saved'
const PATH_DEVICE_API = '/device/api'
const PATH_DEVICE_LOGS = '/devices/logs'
const PATH_DEVICE_SETTINGS = '/devices/settings'

const axiosInstance = axios.create({
  baseURL: GATEWAY_URL,
  timeout: 5000
})

async function extractDataFromError(error) {
  const { response } = error || {}
  return (await response.data) || {}
}

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
  // todo move to device api (get methods)
  async getDeviceApiMethods({ device: { name, ip }, gateway }) {
    return (await gatewayFetch({
      url: `${PATH_DEVICE_API}/methods?name=${name}&ip=${ip}`,
      method: HTTP_METHOD.GET,
      gateway
    })).data
  },
  // Cloud supported methods
  async getLogs(gateway) {
    const response = await gatewayFetch({
      url: PATH_DEVICE_LOGS,
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
  async updateDeviceSettings({ oldName, name, value }, gateway) {
    const response = await gatewayFetch({
      url: PATH_DEVICE_SETTINGS,
      method: HTTP_METHOD.PUT,
      data: { oldName, name, value },
      gateway
    })
    return response.status == 200
  },
  async createDeviceSettings({ name, value }, gateway) {
    const response = await gatewayFetch({
      url: PATH_DEVICE_SETTINGS,
      method: HTTP_METHOD.POST,
      data: { name, value },
      gateway
    })
    return response.status === 200
  },
  async deleteDeviceSettings(name, gateway) {
    const response = await gatewayFetch({
      url: `${PATH_DEVICE_SETTINGS}/${name}`,
      method: HTTP_METHOD.DELETE,
      data: { name },
      gateway
    })
    return response.status === 200
  },
  async getFoundDevices(gateway) {
    const response = await gatewayFetch({ gateway, url: PATH_DEVICES_FOUND, method: "GET" })
    return response.data
  },
  async getSavedDevices(gateway) {
    return (await gatewayFetch({ gateway, url: PATH_DEVICES_SAVED, method: "GET" })).data
  },
  async addDevice(ip, gateway) {
    return (await gatewayFetch({
      gateway,
      url: PATH_DEVICES_SAVED + "?ip=" + ip,
      method: "POST"
    })).data
  },
  async updateSavedDevice(ip, gateway) {
    return (await gatewayFetch({
      gateway,
      url: PATH_DEVICES_SAVED + "?ip=" + ip,
      method: "PUT"
    })).data
  },
  async deleteSavedDevice(ip, gateway) {
    await gatewayFetch({
      gateway,
      url: PATH_DEVICES_SAVED + "?ip=" + ip,
      method: "DELETE"
    })
  }
}

export { GatewayApi }
