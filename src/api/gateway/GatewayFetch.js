import axios from 'axios'
import { CloudApi } from '../CloudApi'
import { toast } from '../../utils/EventBus'

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

const mode = import.meta.env.VITE_MODE

const gatewayAxiosInstance = axios.create({
  timeout: 5000
})

async function gatewayFetchLocal({ url, method, data }) {
  if (!url || !method) {
    throw new Error('Url and method is required in api call via gateway!')
  }
  return gatewayAxiosInstance.request({ url, method, data })
}

async function gatewayFetchCloud({ gateway, url, method, data }) {
  if (!gateway || !url || !method) {
    throw new Error('Gateway, url and method is required in api call vie cloud!')
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

export { gatewayFetch, gatewayAxiosInstance }
