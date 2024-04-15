import axios from 'axios'
import { toast } from '../utils/EventBus'

const GATEWAY_PATH = import.meta.env.VITE_GATEWAY_IP || document.location.hostname
const GATEWAY_PORT = import.meta.env.VITE_GATEWAY_PORT
const GATEWAY_WS = import.meta.env.VITE_GATEWAY_WS
export const GATEWAY_BROKER_URL = `ws://${GATEWAY_PATH}${GATEWAY_PORT ? ':' + GATEWAY_PORT : ''}/${GATEWAY_WS}`

const PATH_AUTHENTICATION = '/cloud/identity'
const PATH_LOGIN = '/cloud/login'
const PATH_LOGOUT = '/cloud/logout'
const PATH_CLOUD_CONFIG = '/cloud/config'
const PATH_CLOUD_CONNECTED = '/cloud/connection/status'
const PATH_CLOUD_CONNECT = '/cloud/connection/connect'
const PATH_CLOUD_DISCONNECT = '/cloud/connection/disconnect'
const PATH_DEVICES_FOUND = '/device/found'
const PATH_DEVICE_API = '/device/api'
const PATH_DEVICE_LOGS = '/device/logs'
const PATH_DEVICE_SETTINGS = '/device/settings'

const axiosInstance = axios.create({
  baseURL: `http://${GATEWAY_PATH}${GATEWAY_PORT ? ':' + GATEWAY_PORT : ''}`,
  timeout: 5000
})

async function extractDataFromError(error) {
  const { response } = error || {}
  return (await response.data) || {}
}

const GatewayApi = {
  async callDeviceApi({ device, command, params }) {
    return await axiosInstance.post(PATH_DEVICE_API, {
      command,
      device,
      params
    })
  },
  async getCloudAuthentication() {
    try {
      const response = await axiosInstance.get(PATH_AUTHENTICATION)
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to fetch cloud authentication info'
      })
    }
  },
  async cloudLogin(payload) {
    try {
      const response = await axiosInstance.post(PATH_LOGIN, payload)
      toast.success({
        caption: 'Successfuly authenticated in cloud'
      })
      return response.data
    } catch (error) {
      console.error(error)
      const { response } = error || {}
      const { status } = response
      let description = ''
      if (status == 403) {
        description = 'Access denied. Wrong token?'
      } else if (status == 503) {
        description = 'Cloud is unavailable'
      }
      toast.error({
        caption: 'Failed to authenticate in cloud',
        description
      })
    }
  },
  async cloudLogout() {
    try {
      await axiosInstance.delete(PATH_LOGOUT)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  },
  async getCloudConfig() {
    try {
      const response = await axiosInstance.get(PATH_CLOUD_CONFIG)
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to fetch cloud info'
      })
    }
  },
  async getConnectionStatus() {
    try {
      const response = await axiosInstance.get(PATH_CLOUD_CONNECTED)
      return response.data
    } catch (error) {
      console.error(error)
    }
  },
  async cloudConnect() {
    try {
      await axiosInstance.put(PATH_CLOUD_CONNECT)
      return true
    } catch (error) {
      console.error(error)
    }
  },
  async cloudDisconnect() {
    try {
      await axiosInstance.put(PATH_CLOUD_DISCONNECT)
      return true
    } catch (error) {
      console.error(error)
    }
  },
  async getLogs() {
    try {
      const response = await axiosInstance.get(PATH_DEVICE_LOGS)
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to load device logs'
      })
    }
  },
  async getDevicesSettings() {
    try {
      const response = await axiosInstance.get(PATH_DEVICE_SETTINGS)
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to load saved device settings'
      })
    }
  },
  async updateDeviceSettings({ oldName, name, value }) {
    try {
      const response = await axiosInstance.put(PATH_DEVICE_SETTINGS, { oldName, name, value })
      return response.status == 200
    } catch (error) {
      console.error(error)
      const { message: description } = await extractDataFromError(error)
      toast.error({
        caption: 'Failed to update device settings',
        description
      })
    }
  },
  async createDeviceSettings({ name, value }) {
    try {
      const response = await axiosInstance.post(PATH_DEVICE_SETTINGS, { name, value })
      return response.status == 200
    } catch (error) {
      console.error(error)
      const { message: description } = await extractDataFromError(error)
      toast.error({
        caption: 'Failed to create device settings',
        description
      })
    }
  },
  async deleteDeviceSettings(name) {
    try {
      const response = await axiosInstance.delete(`${PATH_DEVICE_SETTINGS}/${name}`)
      return response.status == 200
    } catch (error) {
      console.error(error)
      const { message: description } = await extractDataFromError(error)
      toast.error({
        caption: 'Failed to delete device settings',
        description
      })
    }
  },
  async getFoundDevices() {
    try {
      const response = await axiosInstance.get(PATH_DEVICES_FOUND)
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to load recent found devices'
      })
    }
  }
}

export { GatewayApi }
