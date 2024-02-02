import { toast } from "../../utils/EventBus"
import { deviceFetch } from "./DeviceFetch"

const GET_INFO = 'getInfo'
const GET_CALLBACKS = 'getCallbacks'
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
const GET_ALL_CALLBACKS = 'getAllCallbacks'
const GET_CALLBACK_BY_ID = 'getCallbackById'
const GET_CALLBACKS_TEMPLATES = 'getCallbacksTemplates'
const CREATE_CALLBACK = 'createCallback'
const UPDATE_CALLBACK = 'updateCallback'
const DELETE_CALLBACK = 'deleteCallback'
const GET_METRICS = 'getMetrics'
const EXPORT_SETTINGS = 'exportSettings'
const IMPORT_SETTINGS = 'importSettings'

async function extractDataFromError(error) {
  const { response } = error || {}
  return await response.data || {}
}

export const DeviceApi = {
  async getDeviceInfo(device, gateway) {
    try {
      const response = await deviceFetch({ device, method: GET_INFO, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: "Failed to fetch device info"
      })
    }
  },
  async getDeviceActionsInfo(device, gateway) {
    try {
      const response = await deviceFetch({ device, method: GET_ACTIONS, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: "Failed to fetch device actions"
      })
    }
  },
  async getDeviceConfigInfo(device, gateway) {
    try {
      const response = await deviceFetch({ device, method: GET_CONFIG_INFO, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: "Failed to fetch device configuration information"
      })
    }
  },
  async saveName(device, name, gateway) {
    try {
      const result = await deviceFetch({ device, gateway, 
        method: SAVE_NAME,
        params: {
          name
        },
      })
      if (!result || result.status !== 200) {
        throw new Error({ result });
      }
      toast.success({
        caption: "Device name updated!"
      })
      return true
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: "Failed to save device name",
        description
      })
    }
  },
  async getConfig(device, gateway) {
    try {
      const response = await deviceFetch({ device, method: GET_CONFIG_VALUES, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: "Failed to fetch device configuration values"
      })
    }
  },
  async saveConfigValues(device, values, gateway) {
    try {
      const result = await deviceFetch({
        device,
        method: SAVE_CONFIG_VALUES,
        params: { values },
        gateway
      })

      if (!result || result.status !== 200) {
        throw new Error({ result });
      }
      toast.success({
        caption: "Config updated"
      })
      return true
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: "Failed to save configuration values",
        description
      })
    }
  },
  async deleteConfigValue(device, key, gateway) {
    try {
      const result = await deviceFetch({
        device,
        method: DELETE_CONFIG_VALUE,
        params: {
          name: key
        },
        gateway
      })

      if (!result || result.status !== 200) {
        throw new Error({ result });
      }
      toast.success({
        caption: "Config value deleted"
      })
      return true
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: "Failed to delete device config value",
        description
      })
    }

  },
  async deleteAllConfigValues(device, gateway) {
    try {
      const result = await deviceFetch({
        device,
        method: DELETE_ALL_CONFIG_VALUES,
        gateway
      })

      if (!result || result.status !== 200) {
        throw new Error({ result });
      }
      toast.success({
        caption: "Config deleted"
      })
      return true
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: "Failed to delete all config values",
        description
      })
    }
  },
  async executeDeviceAcion(device, action, gateway) {
    try {
      const result = await deviceFetch({
        device,
        method: CALL_ACTION,
        params: {
          action
        },
        gateway
      })
      if (!result || result.status !== 200) {
        throw new Error({ result });
      }
      toast.success({
        caption: "Done"
      })
      return true
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: "Failed to execute action " + action,
        description
      })
    }

  },
  async getDeviceSensors(device, gateway) {
    try {
      const response = await deviceFetch({ device, method: GET_SENSORS, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: "Failed to fetch sensors values"
      })
    }
  },
  async getDeviceStates(device, gateway) {
    try {
      const response = await deviceFetch({ device, method: GET_STATES, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        type: "error",
        caption: "Failed to fetch device states"
      })
    }
  },
  async getAllCallbacks(device, gateway) {
    try {
      const response = await deviceFetch({ device, method: GET_ALL_CALLBACKS, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: "Failed to fetch callbacks"
      })
    }
  },
  async getCallbacks(device, observable, gateway) {
    try {
      const response = await deviceFetch({
        device,
        method: GET_CALLBACKS,
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
        caption: `Failed to fetch callbacks for [${observable.type}]${observable.name}`,
        description
      })
    }
  },
  async getCallbackById(device, observable, id, gateway) {
    try {
      const response = await deviceFetch({
        device,
        method: GET_CALLBACK_BY_ID,
        params: { observable, id },
        gateway
      })
      return response.data
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: `Failed to fetch callback by id=${id}`,
        description
      })
    }

  },
  async getCallbacksTemplates(device, gateway) {
    try {
      const response = await deviceFetch({ device, method: GET_CALLBACKS_TEMPLATES, gateway })
      return response.data
    } catch (error) {
      console.error(error)
      toast.error({
        caption: "Failed to fetch callbacks templates"
      })
    }

  },
  async createCallback(device, observable, callback, gateway) {
    try {
      const result = await deviceFetch({
        device,
        method: CREATE_CALLBACK,
        params: {
          observable,
          callback
        },
        gateway
      })
      if (!result || result.status !== 201) {
        throw new Error({ result });
      }
      toast.success({
        caption: "Callback created"
      })
      return true
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: "Failed to create callback",
        description
      })
    }

  },
  async updateCallback(device, observable, callback, gateway) {
    try {
      const result = await deviceFetch({
        device,
        method: UPDATE_CALLBACK,
        params: {
          observable,
          callback
        },
        gateway
      })

      if (!result || result.status !== 200) {
        throw new Error({ result });
      }
      toast.success({
        caption: "Callback updated"
      })
      return true
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        type: "error",
        caption: `Failed to update callback id=${callback.id}`,
        description
      })
    }

  },
  async deleteCallback(device, observable, id, gateway) {
    try {
      const result = await deviceFetch({
        device,
        method: DELETE_CALLBACK,
        params: { observable, id },
        gateway
      })

      if (!result || result.status !== 200) {
        throw new Error({ result });
      }
      toast.success({
        caption: "Callback deleted"
      })
      return true
    } catch (error) {
      console.error(error)
      const { error: description } = await extractDataFromError(error)
      toast.error({
        caption: `Failed to delete callback by id=${id}`,
        description
      })
    }
  },
  async metrics(device, gateway) {
    try {
      const result = await deviceFetch({
        device,
        gateway,
        method: GET_METRICS
      })
      if (!result || result.status !== 200) {
        throw new Error({ result });
      }
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
        method: EXPORT_SETTINGS
      })
      if (!result || result.status !== 200) {
        throw new Error({ result });
      }
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
        method: IMPORT_SETTINGS,
        params: {
          settings
        },
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