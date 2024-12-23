import { deviceFetch } from './DeviceFetch'

export const DeviceApiMethods = {
  CHECK_HEALTH: 'health',
  GET_WIFI: 'getWiFi',
  SET_WIFI: 'setWiFi',
  GET_INFO: 'getInfo',
  GET_HOOKS: 'getHooks',
  GET_ACTIONS: 'getActions',
  SAVE_NAME: 'saveName',
  CALL_ACTION: 'callAction',
  ACTION_SCHEDULE: 'actionSchedule',
  GET_CONFIG_VALUES: 'getConfigValues',
  SAVE_CONFIG_VALUES: 'saveConfigValues',
  DELETE_CONFIG_VALUE: 'deleteConfigValue',
  DELETE_ALL_CONFIG_VALUES: 'deleteAllConfigValues',
  GET_SENSORS: 'getSensors',
  GET_ALL_HOOKS: 'getAllHooks',
  GET_HOOK_BY_ID: 'getHookById',
  GET_HOOKS_TEMPLATES: 'getHooksTemplates',
  TEST_HOOK: 'testHook',
  CREATE_HOOK: 'createHook',
  UPDATE_HOOK: 'updateHook',
  DELETE_HOOK: 'deleteHook',
  GET_FEATURES: 'getFeatures',
  GET_METRICS: 'getMetrics',
  EXPORT_SETTINGS: 'exportSettings',
  IMPORT_SETTINGS: 'importSettings',
  RESTART: 'restart',
  WIPE: 'wipe'
}

export const DeviceApi = {
  async health(device, gateway) {
    return (await deviceFetch({ device, command: DeviceApiMethods.CHECK_HEALTH, gateway })).data
  },
  async getWiFi(device, gateway) {
    return (await deviceFetch({ device, command: DeviceApiMethods.GET_WIFI, gateway })).data
  },
  async setWiFi(device, { ssid, password, mode }, gateway) {
    await deviceFetch({
      device,
      gateway,
      command: DeviceApiMethods.SET_WIFI,
      params: { ssid, password, mode }
    })
  },
  async getDeviceInfo(device, gateway) {
    return (await deviceFetch({ device, command: DeviceApiMethods.GET_INFO, gateway })).data
  },
  async getDeviceActionsInfo(device, gateway) {
    return (await deviceFetch({ device, command: DeviceApiMethods.GET_ACTIONS, gateway })).data
  },
  async saveName(device, name, gateway) {
    await deviceFetch({
      device,
      gateway,
      command: DeviceApiMethods.SAVE_NAME,
      params: {
        name
      }
    })
  },
  async getConfig(device, gateway) {
    return (await deviceFetch({ device, command: DeviceApiMethods.GET_CONFIG_VALUES, gateway }))
      .data
  },
  async saveConfigValues(device, values, gateway) {
    await deviceFetch({
      device,
      command: DeviceApiMethods.SAVE_CONFIG_VALUES,
      params: { values },
      gateway
    })
  },
  async deleteConfigValue(device, key, gateway) {
    await deviceFetch({
      device,
      command: DeviceApiMethods.DELETE_CONFIG_VALUE,
      params: {
        name: key
      },
      gateway
    })
  },
  async deleteAllConfigValues(device, gateway) {
    await deviceFetch({
      device,
      command: DeviceApiMethods.DELETE_ALL_CONFIG_VALUES,
      gateway
    })
  },
  async callAction(device, name, gateway) {
    await deviceFetch({
      device,
      command: DeviceApiMethods.CALL_ACTION,
      params: {
        name
      },
      gateway
    })
  },
  async actionSchedule(device, name, callDelay, gateway) {
    await deviceFetch({
      device,
      command: DeviceApiMethods.ACTION_SCHEDULE,
      params: {
        name,
        callDelay
      },
      gateway
    })
  },
  async getSensors(device, gateway) {
    return (await deviceFetch({ device, command: DeviceApiMethods.GET_SENSORS, gateway })).data
  },
  async getAllHooks(device, gateway) {
    return (await deviceFetch({ device, command: DeviceApiMethods.GET_ALL_HOOKS, gateway })).data
  },
  async getHooks(device, sensor, gateway) {
    return (
      await deviceFetch({
        device,
        command: DeviceApiMethods.GET_HOOKS,
        params: {
          sensor
        },
        gateway
      })
    ).data
  },
  async getHookById(device, sensor, id, gateway) {
    return (
      await deviceFetch({
        device,
        command: DeviceApiMethods.GET_HOOK_BY_ID,
        params: { sensor, id },
        gateway
      })
    ).data
  },
  async getHooksTemplates(device, sensor, gateway) {
    return (
      await deviceFetch({
        device,
        command: DeviceApiMethods.GET_HOOKS_TEMPLATES,
        gateway,
        params: { sensor }
      })
    ).data
  },
  async createHook(device, sensor, hook, gateway) {
    await deviceFetch({
      device,
      command: DeviceApiMethods.CREATE_HOOK,
      params: {
        sensor,
        hook
      },
      gateway
    })
  },
  async updateHook(device, sensor, hook, gateway) {
    await deviceFetch({
      device,
      command: DeviceApiMethods.UPDATE_HOOK,
      params: {
        sensor,
        hook
      },
      gateway
    })
  },
  async deleteHook(device, sensor, id, gateway) {
    await deviceFetch({
      device,
      command: DeviceApiMethods.DELETE_HOOK,
      params: { sensor, id },
      gateway
    })
  },
  async testHook(device, sensor, id, value, gateway) {
    return deviceFetch({
      device,
      command: DeviceApiMethods.TEST_HOOK,
      params: {
        sensor,
        id,
        value
      },
      gateway
    })
  },
  async features(device, gateway) {
    return (
      await deviceFetch({
        device,
        gateway,
        command: DeviceApiMethods.GET_FEATURES
      })
    ).data
  },
  async metrics(device, gateway) {
    return (
      await deviceFetch({
        device,
        gateway,
        command: DeviceApiMethods.GET_METRICS
      })
    ).data
  },
  async exportSettings(device, gateway) {
    return (
      await deviceFetch({
        device,
        gateway,
        command: DeviceApiMethods.EXPORT_SETTINGS
      })
    ).data
  },
  async importSettings(device, gateway, settings) {
    await deviceFetch({
      device,
      gateway,
      command: DeviceApiMethods.IMPORT_SETTINGS,
      params: {
        settings
      }
    })
  },
  async restart(device, gateway) {
    await deviceFetch({
      device,
      gateway,
      command: DeviceApiMethods.RESTART
    })
  },
  async wipe(device, gateway) {
    await deviceFetch({
      device,
      gateway,
      command: DeviceApiMethods.WIPE
    })
  }
}
