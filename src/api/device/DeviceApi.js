import { toast } from '../../utils/EventBus'
import { deviceFetch } from './DeviceFetch'

const GET_INFO = 'getInfo'
const GET_HOOKS = 'getHooks'
const GET_ACTIONS = 'getActions'
const SAVE_NAME = 'saveName'
const CALL_ACTION = 'callAction'
const GET_CONFIG_INFO = 'getConfigInfo'
const GET_CONFIG_VALUES = 'getConfigValues'
const SAVE_CONFIG_VALUES = 'saveConfigValues'
const DELETE_CONFIG_VALUE = 'deleteConfigValue'
const DELETE_ALL_CONFIG_VALUES = 'deleteAllConfigValues'
const GET_SENSORS = 'getSensors'
const GET_STATES = 'getStates'
const GET_ALL_HOOKS = 'getAllHooks'
const GET_HOOK_BY_ID = 'getHookById'
const GET_HOOKS_TEMPLATES = 'getHooksTemplates'
const CREATE_HOOK = 'createHook'
const UPDATE_HOOK = 'updateHook'
const DELETE_HOOK = 'deleteHook'
const GET_METRICS = 'getMetrics'
const EXPORT_SETTINGS = 'exportSettings'
const IMPORT_SETTINGS = 'importSettings'
const RESTART = 'restart'

async function extractDataFromError(error) {
  const { response } = error || {}
  return (await response.data) || {}
}

export const DeviceApi = {
  async getDeviceInfo(device, gateway) {
    try {
      const response = await deviceFetch({ device, command: GET_INFO, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to fetch device info'
      })
    }
  },
  async getDeviceActionsInfo(device, gateway) {
    try {
      const response = await deviceFetch({ device, command: GET_ACTIONS, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to fetch device actions'
      })
    }
  },
  async getDeviceConfigInfo(device, gateway) {
    try {
      const response = await deviceFetch({ device, command: GET_CONFIG_INFO, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to fetch device configuration information'
      })
    }
  },
  async saveName(device, name, gateway) {
    try {
      const result = await deviceFetch({
        device,
        gateway,
        command: SAVE_NAME,
        params: {
          name
        }
      })
      toast.success({
        caption: 'Device name updated!'
      })
      return result.status === 200
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: 'Failed to save device name',
        description
      })
    }
  },
  async getConfig(device, gateway) {
    try {
      const response = await deviceFetch({ device, command: GET_CONFIG_VALUES, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to fetch device configuration values'
      })
    }
  },
  async saveConfigValues(device, values, gateway) {
    try {
      const result = await deviceFetch({
        device,
        command: SAVE_CONFIG_VALUES,
        params: { values },
        gateway
      })
      toast.success({
        caption: 'Config updated'
      })
      return result.status === 200
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: 'Failed to save configuration values',
        description
      })
    }
  },
  async deleteConfigValue(device, key, gateway) {
    try {
      const result = await deviceFetch({
        device,
        command: DELETE_CONFIG_VALUE,
        params: {
          name: key
        },
        gateway
      })
      toast.success({
        caption: 'Config value deleted'
      })
      return result.status === 200
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: 'Failed to delete device config value',
        description
      })
    }
  },
  async deleteAllConfigValues(device, gateway) {
    try {
      const result = await deviceFetch({
        device,
        command: DELETE_ALL_CONFIG_VALUES,
        gateway
      })
      toast.success({
        caption: 'Config deleted'
      })
      return result.status === 200
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: 'Failed to delete all config values',
        description
      })
    }
  },
  async executeDeviceAcion(device, action, gateway) {
    try {
      const result = await deviceFetch({
        device,
        command: CALL_ACTION,
        params: {
          action
        },
        gateway
      })
      toast.success({
        caption: 'Done'
      })
      return result.status === 200
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: 'Failed to execute action ' + action,
        description
      })
    }
  },
  async getDeviceSensors(device, gateway) {
    try {
      const response = await deviceFetch({ device, command: GET_SENSORS, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to fetch sensors values'
      })
    }
  },
  async getDeviceStates(device, gateway) {
    try {
      const response = await deviceFetch({ device, command: GET_STATES, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        type: 'error',
        caption: 'Failed to fetch device states'
      })
    }
  },
  async getAllHooks(device, gateway) {
    try {
      const response = await deviceFetch({ device, command: GET_ALL_HOOKS, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to fetch hooks'
      })
    }
  },
  async getHooks(device, observable, gateway) {
    try {
      const response = await deviceFetch({
        device,
        command: GET_HOOKS,
        params: {
          observable
        },
        gateway
      })
      return response.data
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: `Failed to fetch hooks for [${observable.type}]${observable.name}`,
        description
      })
    }
  },
  async getHookById(device, observable, id, gateway) {
    try {
      const response = await deviceFetch({
        device,
        command: GET_HOOK_BY_ID,
        params: { observable, id },
        gateway
      })
      return response.data
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: `Failed to fetch hook by id=${id}`,
        description
      })
    }
  },
  async getHooksTemplates(device, gateway) {
    try {
      const response = await deviceFetch({ device, command: GET_HOOKS_TEMPLATES, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to fetch hooks templates'
      })
    }
  },
  async createHook(device, observable, hook, gateway) {
    try {
      const result = await deviceFetch({
        device,
        command: CREATE_HOOK,
        params: {
          observable,
          hook
        },
        gateway
      })
      if (!result || result.status !== 201) {
        throw new Error({ result })
      }
      toast.success({
        caption: 'Hook created'
      })
      return true
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: 'Failed to create hook',
        description
      })
    }
  },
  async updateHook(device, observable, hook, gateway) {
    try {
      const result = await deviceFetch({
        device,
        command: UPDATE_HOOK,
        params: {
          observable,
          hook
        },
        gateway
      })
      toast.success({
        caption: 'Hook updated'
      })
      return result.status === 200
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        type: 'error',
        caption: `Failed to update hook id=${hook.id}`,
        description
      })
    }
  },
  async deleteHook(device, observable, id, gateway) {
    try {
      const result = await deviceFetch({
        device,
        command: DELETE_HOOK,
        params: { observable, id },
        gateway
      })
      toast.success({
        caption: 'Hook deleted'
      })
      return result.status === 200
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: `Failed to delete hook by id=${id}`,
        description
      })
    }
  },
  async metrics(device, gateway) {
    try {
      const result = await deviceFetch({
        device,
        gateway,
        command: GET_METRICS
      })
      return result.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: 'Failed to load device metrics'
      })
    }
  },
  async exportSettings(device, gateway) {
    try {
      const result = await deviceFetch({
        device,
        gateway,
        command: EXPORT_SETTINGS
      })
      return result.data
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: 'Failed to export device settings',
        description
      })
    }
  },
  async importSettings(device, gateway, settings) {
    try {
      const result = await deviceFetch({
        device,
        gateway,
        command: IMPORT_SETTINGS,
        params: {
          settings
        }
      })
      return result.status === 200
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: 'Failed to import settings',
        description
      })
    }
  },
  async restartDevice(device, gateway) {
    try {
      const result = await deviceFetch({
        device,
        gateway,
        command: RESTART
      })
      return result.status === 200
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: 'Failed to import settings',
        description
      })
    }
  }
}
