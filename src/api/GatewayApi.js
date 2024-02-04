import axios from 'axios'
import { Client } from '@stomp/stompjs'
import { EventBus, STOMP_CONNECTED, toast } from '../utils/EventBus'

const GATEWAY_PATH = import.meta.env.VITE_GATEWAY_PATH || document.location.hostname
const GATEWAY_PORT = import.meta.env.VITE_GATEWAY_PORT

const GATEWAY_WS = import.meta.env.VITE_GATEWAY_WS
const GATEWAY_SEARCH_TOPIC = import.meta.env.VITE_GATEWAY_SEARCH_TOPIC
const GATEWAY_BROKER_URL = `ws://${GATEWAY_PATH}${GATEWAY_PORT ? ':' + GATEWAY_PORT : ''}/${GATEWAY_WS}`

const PATH_AUTHORIZATION = '/auth'
const PATH_CLOUD_INFO = '/auth/configuration'
const PATH_CLOUD_CONNECTED = '/connection/status'
const PATH_CLOUD_CONNECT = '/connection/connect'
const PATH_DEVICES_FOUND = '/device/found'
const PATH_DEVICE_API = '/device/api'
const PATH_DEVICE_LOGS = '/device/logs'
const PATH_DEVICE_SETTINGS = '/device/settings'

const GATEWAY_STOMP_CLIENT = new Client({ brokerURL: GATEWAY_BROKER_URL })
//todo rework bruhhh
if (import.meta.env.VITE_MODE == 'gateway') {
  console.debug('Connecting to message broker ' + GATEWAY_BROKER_URL)
  GATEWAY_STOMP_CLIENT.onConnect = async () => {
    console.debug('Connected to message broker ' + GATEWAY_STOMP_CLIENT.brokerURL)
    EventBus.emit(STOMP_CONNECTED, GATEWAY_STOMP_CLIENT)
  }
  GATEWAY_STOMP_CLIENT.activate()
}

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
  async getCloudAuthorization() {
    try {
      const response = axiosInstance.get(PATH_AUTHORIZATION)
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to fetch cloud authorization info'
      })
    }
  },
  async cloudAuthorize(payload) {
    try {
      const response = await axiosInstance.put(PATH_AUTHORIZATION, payload)
      if (response.status != 200) {
        throw new Error('Failed to auth in cloud')
      }
      toast.success({
        caption: 'Successfuly authorized in cloud'
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
        caption: 'Failed to authorize in cloud',
        description
      })
    }
  },
  async getCloudInfo() {
    try {
      const response = await axiosInstance.get(PATH_CLOUD_INFO)
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
      const response = await axiosInstance.put(PATH_CLOUD_CONNECT)
      if (response.status != 200) {
        throw new Error('Failed to auth in cloud')
      }
      toast.success({
        caption: 'Connected'
      })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to connect'
      })
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

export { GatewayApi, GATEWAY_SEARCH_TOPIC, GATEWAY_STOMP_CLIENT }
