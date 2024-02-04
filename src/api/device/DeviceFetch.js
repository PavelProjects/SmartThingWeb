import { CloudApi } from '../CloudApi'
import { GatewayApi } from '../GatewayApi'

const mode = import.meta.env.VITE_MODE

async function deviceFetchLocal({ device, command, params }) {
  if (!device || !command) {
    throw new Error('Device and command is required in device api call!')
  }
  return GatewayApi.callDeviceApi({ device, command, params })
}

async function deviceFetchCloud({ gateway, device, command, params }) {
  if (!gateway || !device || !command) {
    throw new Error('Gateway, device and command is required in device api call!')
  }
  const { result } = await CloudApi.sendDeviceRequest({ gateway, device, command, params })
  const response = JSON.parse(result)
  return {
    status: response.code,
    data: JSON.parse(response.body)
  }
}

const deviceFetch = mode == 'cloud' ? deviceFetchCloud : deviceFetchLocal

export { deviceFetch }
