import { notify } from "../../utils/EventBus"
import { deviceFetch } from "./DeviceFetch"

export const DeviceApi = {
    async getDeviceInfo(ip, gateway) {
        try {
            const response = await deviceFetch({ip, path: '/info/system', gateway})
            return response.data
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: "Failed to fetch device info"
            })
        }
    },
    async getDeviceActionsInfo(ip, gateway) {
        try {
            const response = await deviceFetch({ip, path: '/info/actions', gateway})
            return response.data
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: "Failed to fetch device actions"
            })
        }
    },
    async getDeviceConfigInfo(ip, gateway) {
        try {
            const response = await deviceFetch({ip, path: '/info/config', gateway})
            return response.data
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: "Failed to fetch device configuration information"
            })
        }
    },
    async saveName(ip, name, gateway) {
        try {
            const result = await deviceFetch({
                ip,
                path: '/info',
                method: 'PUT',
                payload: {
                    name
                },
                gateway
            })
            if (!result || result.status !== 200) {
                throw new Error({result});
            }
            notify({
                type: "success",
                caption: "Device name updated!"
            })
            return true
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: "Failed to save device name"
            })
        }
    },
    async getConfig(ip, gateway) {
        try {
            const response = await deviceFetch({ip, path: '/config', gateway})
            return response.data
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: "Failed to fetch device configuration"
            })
        }
    },
    async saveConfigValues(ip, values, gateway) {
        try {
            const result = await deviceFetch({
                ip,
                path: '/config/save',
                method: 'POST',
                payload: values,
                gateway
            })

            if (!result || result.status !== 200) {
                throw new Error({result});
            }
            notify({
                type: "success",
                caption: "Config updated"
            })
            return true
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: "Failed to save configuration values"
            })
        }
    },
    async deleteConfigValue(ip, key, gateway) {
        try {
            const result = await deviceFetch({
                ip,
                path: '/config/delete',
                method: 'POST',
                requestParams: {
                    name: key
                },
                gateway
            })

            if (!result || result.status !== 200) {
                throw new Error({result});
            }
            notify({
                type: "success",
                caption: "Config value deleted"
            })
            return true
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: "Failed to delete device config value"
            })
        }
        
    },
    async deleteAllConfigValues(ip, gateway) {
        try {
            const result = await deviceFetch({
                ip,
                path: '/config/delete/all',
                method: 'DELETE',
                gateway
            })

            if (!result || result.status !== 200) {
                throw new Error({result});
            }
            notify({
                type: "success",
                caption: "Config deleted"
            })
            return true
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: "Failed to delete all confi values"
            })
        }
    },
    async executeDeviceAcion(ip, action, gateway) {
        try {
            const result = await deviceFetch({
                ip,
                path: '/action',
                method: 'PUT',
                requestParams: {
                    action
                },
                gateway
            })
            if (!result || result.status !== 200) {
                throw new Error({result});
            }
            notify({
                type: "success",
                caption: "Done"
            })
            return true
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: "Failed to execute action " + action
            })
        }
        
    },
    async getDeviceSensors(ip, gateway) {
        try {
            const response = await deviceFetch({ip, path: '/sensors', gateway})
            return response.data
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: "Failed to fetch sensors values"
            })
        }
    },
    async getDeviceStates(ip, gateway) {
        try {
            const response = await deviceFetch({ip, path: '/states', gateway})
            return response.data
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: "Failed to fetch device states"
            })
        }
    },
    async getAllCallbacks(ip, gateway) {
        try {
            const response = await deviceFetch({ip, path: '/callbacks', gateway})
            return response.data
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: "Failed to fetch callbacks"
            })
        }
    },
    async getCallbacks(ip, observable, gateway) {
        try {
            const response = await deviceFetch({
                ip,
                path: '/callbacks/by/observable',
                requestParams: {
                    observableType: observable.type,
                    name: observable.name,
                },
                gateway
            })
            return response.data
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: `Failed to fetch callbacks for [${observable.type}]${observable.name}`
            })
        }
    },
    async getCallbackById(ip, observable, id, gateway) {
        try {
            const response = await deviceFetch({
                ip,
                path: '/callbacks/by/id',
                requestParams: {
                    observableType: observable.type,
                    name: observable.name,
                    id
                },
                gateway
            })
            return response.data
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: `Failed to fetch callback by id=${id}`
            })
        }
        
    },
    async getCallbacksTemplates(ip, gateway) {
        try {
            const response = await deviceFetch({ip, path: '/callbacks/template', gateway})
            return response.data
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: "Failed to fetch callbacks templates"
            })
        }
        
    },
    async createCallback(ip, observable, callback, gateway) {
        try {
            const result = await deviceFetch({
                ip,
                path: '/callbacks/create',
                method: 'POST',
                payload: {
                    observable,
                    callback
                },
                gateway
            })
            if (!result || result.status !== 201) {
                throw new Error({result});
            }
            notify({
                type: "success",
                caption: "Callback created"
            })
            return true
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: "Failed to create callback"
            })
        }
        
    },
    async updateCallback(ip, observable, callback, gateway) {
        try {
            const result = await deviceFetch({
                ip,
                path: '/callbacks/update',
                method: 'PUT',
                payload: {
                    observable,
                    callback
                },
                gateway
            })
            
            if (!result || result.status !== 200) {
                throw new Error({result});
            }
            notify({
                type: "success",
                caption: "Callback updated"
            })
            return true
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: `Failed to update callback id=${callback.id}`
            })
        }
        
    },
    async deleteCallback(ip, observable, id, gateway) {
        try {
            const result = await deviceFetch({
                ip,
                gateway,
                path: '/callbacks/delete',
                method: 'DELETE',
                requestParams: {
                    observableType: observable.type,
                    name: observable.name,
                    id
                },
                gateway
            })
            
            if (!result || result.status !== 200) {
                throw new Error({result});
            }
            notify({
                type: "success",
                caption: "Callback deleted"
            })
            return true
        } catch (error) {
            console.error(error)
            notify({
                type: "error",
                caption: `Failed to delete callback by id=${id}`
            })
        }
    },
}