import { toast } from '../../utils/EventBus'
import { deviceFetch } from './DeviceFetch'

const CHECK_HEALTH = 'health'
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
const GET_FEATURES = 'getFeatures'
const GET_METRICS = 'getMetrics'
const EXPORT_SETTINGS = 'exportSettings'
const IMPORT_SETTINGS = 'importSettings'
const RESTART = 'restart'

export async function extractDataFromError(error) {
  const { response } = error || {}
  return (await response.data) || {}
}

export const DeviceApi = {
  async health(device, gateway) {
    return (await deviceFetch({ device, command: CHECK_HEALTH, gateway})).data
  },
  async getDeviceInfo(device, gateway) {
    return (await deviceFetch({ device, command: GET_INFO, gateway })).data
  },
  async getDeviceActionsInfo(device, gateway) {
    return (await deviceFetch({ device, command: GET_ACTIONS, gateway })).data
  },
  async getDeviceConfigInfo(device, gateway) {
    return (await deviceFetch({ device, command: GET_CONFIG_INFO, gateway })).data
  },
  async saveName(device, name, gateway) {
    await deviceFetch({
      device,
      gateway,
      command: SAVE_NAME,
      params: {
        name
      }
    })
  },
  async getConfig(device, gateway) {
    return (await deviceFetch({ device, command: GET_CONFIG_VALUES, gateway })).data
  },
  async saveConfigValues(device, values, gateway) {
    await deviceFetch({
      device,
      command: SAVE_CONFIG_VALUES,
      params: { values },
      gateway
    })
  },
  async deleteConfigValue(device, key, gateway) {
    await deviceFetch({
      device,
      command: DELETE_CONFIG_VALUE,
      params: {
        name: key
      },
      gateway
    })
  },
  async deleteAllConfigValues(device, gateway) {
    await deviceFetch({
      device,
      command: DELETE_ALL_CONFIG_VALUES,
      gateway
    })
  },
  async executeDeviceAcion(device, action, gateway) {
    await deviceFetch({
      device,
      command: CALL_ACTION,
      params: {
        action
      },
      gateway
    })
  },
  async getDeviceSensors(device, gateway) {
    return (await deviceFetch({ device, command: GET_SENSORS, gateway })).data
  },
  async getDeviceStates(device, gateway) {
    return (await deviceFetch({ device, command: GET_STATES, gateway })).data
  },
  async getAllHooks(device, gateway) {
    return (await deviceFetch({ device, command: GET_ALL_HOOKS, gateway })).data
  },
  async getHooks(device, observable, gateway) {
    return (await deviceFetch({
      device,
      command: GET_HOOKS,
      params: {
        observable
      },
      gateway
    })).data
  },
  async getHookById(device, observable, id, gateway) {
    return (await deviceFetch({
      device,
      command: GET_HOOK_BY_ID,
      params: { observable, id },
      gateway
    })).data
  },
  async getHooksTemplates(device, type, gateway) {
    return (await deviceFetch({
      device,
      command: GET_HOOKS_TEMPLATES,
      gateway,
      params: { type }
    })).data
  },
  async createHook(device, observable, hook, gateway) {
    await deviceFetch({
      device,
      command: CREATE_HOOK,
      params: {
        observable,
        hook
      },
      gateway
    })
  },
  async updateHook(device, observable, hook, gateway) {
    await deviceFetch({
      device,
      command: UPDATE_HOOK,
      params: {
        observable,
        hook
      },
      gateway
    })
  },
  async deleteHook(device, observable, id, gateway) {
    await deviceFetch({
      device,
      command: DELETE_HOOK,
      params: { observable, id },
      gateway
    })
  },
  async features(device, gateway) {
    return (await deviceFetch({
      device,
      gateway,
      command: GET_FEATURES
    })).data
  },
  async metrics(device, gateway) {
    return (await deviceFetch({
      device,
      gateway,
      command: GET_METRICS
    })).data
  },
  async exportSettings(device, gateway) {
    return (await deviceFetch({
      device,
      gateway,
      command: EXPORT_SETTINGS
    })).data
  },
  async importSettings(device, gateway, settings) {
    await deviceFetch({
        device,
        gateway,
        command: IMPORT_SETTINGS,
        params: {
          settings
        }
    })
  },
  async restartDevice(device, gateway) {
    await deviceFetch({
      device,
      gateway,
      command: RESTART
    })
  }
}
