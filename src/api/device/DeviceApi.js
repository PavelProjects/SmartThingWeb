import { toast } from "../../utils/EventBus"
import { deviceFetch } from "./DeviceFetch"

export const DeviceApi = {
    async getDeviceInfo(ip, gateway) {
        try {
            const response = await deviceFetch({ip, path: '/info/system', gateway})
            return response.data
        } catch (error) {
            console.error(error)
            toast.error({
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
            toast.error({
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
            toast.error({
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
            toast.success({
                caption: "Device name updated!"
            })
            return true
        } catch (error) {
            console.error(error)
            toast.error({
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
            toast.error({
                caption: "Failed to fetch device configuration"
            })
        }
    },
    async saveConfigValues(ip, values, gateway) {
        try {
            const result = await deviceFetch({
                ip,
                path: '/config',
                method: 'POST',
                payload: values,
                gateway
            })

            if (!result || result.status !== 200) {
                throw new Error({result});
            }
            toast.success({
                caption: "Config updated"
            })
            return true
        } catch (error) {
            console.error(error)
            toast.error({
                caption: "Failed to save configuration values"
            })
        }
    },
    async deleteConfigValue(ip, key, gateway) {
        try {
            const result = await deviceFetch({
                ip,
                path: '/config',
                method: 'DELETE',
                requestParams: {
                    name: key
                },
                gateway
            })

            if (!result || result.status !== 200) {
                throw new Error({result});
            }
            toast.success({
                caption: "Config value deleted"
            })
            return true
        } catch (error) {
            console.error(error)
            toast.error({
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
            toast.success({
                caption: "Config deleted"
            })
            return true
        } catch (error) {
            console.error(error)
            toast.error({
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
            toast.success({
                caption: "Done"
            })
            return true
        } catch (error) {
            console.error(error)
            toast.error({
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
            toast.error({
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
            toast.error({
                type: "error",
                caption: "Failed to fetch device states"
            })
        }
    },
    async getAllCallbacks(ip, gateway) {
        try {
            const response = await deviceFetch({ip, path: '/callback', gateway})
            return response.data
        } catch (error) {
            console.error(error)
            toast.error({
                caption: "Failed to fetch callbacks"
            })
        }
    },
    async getCallbacks(ip, observable, gateway) {
        try {
            const response = await deviceFetch({
                ip,
                path: '/callback/by/observable',
                requestParams: {
                    type: observable.type,
                    name: observable.name,
                },
                gateway
            })
            return response.data
        } catch (error) {
            console.error(error)
            toast.error({
                caption: `Failed to fetch callbacks for [${observable.type}]${observable.name}`
            })
        }
    },
    async getCallbackById(ip, observable, id, gateway) {
        try {
            const response = await deviceFetch({
                ip,
                path: '/callback/by/id',
                requestParams: {
                    type: observable.type,
                    name: observable.name,
                    id
                },
                gateway
            })
            return response.data
        } catch (error) {
            console.error(error)
            toast.error({
                caption: `Failed to fetch callback by id=${id}`
            })
        }
        
    },
    async getCallbacksTemplates(ip, gateway) {
        try {
            const response = await deviceFetch({ip, path: '/callback/template', gateway})
            return response.data
        } catch (error) {
            console.error(error)
            toast.error({
                caption: "Failed to fetch callbacks templates"
            })
        }
        
    },
    async createCallback(ip, observable, callback, gateway) {
        try {
            const result = await deviceFetch({
                ip,
                path: '/callback',
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
            toast.success({
                caption: "Callback created"
            })
            return true
        } catch (error) {
            console.error(error)
            toast.error({
                caption: "Failed to create callback"
            })
        }
        
    },
    async updateCallback(ip, observable, callback, gateway) {
        try {
            const result = await deviceFetch({
                ip,
                path: '/callback',
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
            toast.success({
                caption: "Callback updated"
            })
            return true
        } catch (error) {
            console.error(error)
            toast.error({
                type: "error",
                caption: `Failed to update callback id=${callback.id}`
            })
        }
        
    },
    async deleteCallback(ip, observable, id, gateway) {
        try {
            const result = await deviceFetch({
                ip,
                path: '/callback',
                method: 'DELETE',
                requestParams: {
                    type: observable.type,
                    name: observable.name,
                    id
                },
                gateway
            })
            
            if (!result || result.status !== 200) {
                throw new Error({result});
            }
            toast.success({
                caption: "Callback deleted"
            })
            return true
        } catch (error) {
            console.error(error)
            toast.error({
                caption: `Failed to delete callback by id=${id}`
            })
        }
    },
    async metrics(ip, gateway) {
        try {
            const result = await deviceFetch({
                ip,
                gateway,
                path: '/metrics',
                method: 'GET'
            })
            if (!result || result.status !== 200) {
                throw new Error({result});
            }
            return result.data
        } catch (error) {
            console.error(error)
            toast.error({
                caption: 'Failed to load device metrics'
            })
        }
    }
}