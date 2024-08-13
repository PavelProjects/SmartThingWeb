import axios from 'axios'
import { CloudApi } from '../CloudApi'
import { toast } from '../../utils/EventBus'

const GATEWAY_PATH = import.meta.env.VITE_GATEWAY_IP || document.location.hostname
const GATEWAY_PORT = import.meta.env.VITE_GATEWAY_PORT
export const GATEWAY_URL = `http://${GATEWAY_PATH}${GATEWAY_PORT ? ':' + GATEWAY_PORT : ''}`

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

const mode = import.meta.env.VITE_MODE

const axiosInstance = axios.create({
  baseURL: GATEWAY_URL,
  timeout: 5000
})

async function gatewayFetchLocal({ url, method, data }) {
  if (!url || !method) {
    throw new Error('Url and method is required in api call!')
  }
  return axiosInstance.request({ url, method, data })
}

async function gatewayFetchCloud({ gateway, url, method, data }) {
  if (!gateway || !url || !method) {
    throw new Error('Gateway, url and method is required in api call!')
  }
  if (!gateway?.online) {
    toast.error({
      caption: 'Gateway is offline!'
    })
    return
  }
  return await CloudApi.sendGatewayRequest(gateway, url, method, data)
}

const gatewayFetch = mode === 'gateway' ? gatewayFetchLocal : gatewayFetchCloud

export { gatewayFetch }
