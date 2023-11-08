import { deviceFetch } from "./DeviceFetch"

export const DeviceApi = {
    async getDeviceInfo(ip, gateway) {
        const response = await deviceFetch({ip, path: '/info/system', gateway})
        return response.data
    },
    async getDeviceActionsInfo(ip, gateway) {
        const response = await deviceFetch({ip, path: '/info/actions', gateway})
        return response.data
    },
    async getDeviceConfigInfo(ip, gateway) {
        const response = await deviceFetch({ip, path: '/info/config', gateway})
        return response.data
    },
    async saveName(ip, name, gateway) {
        const result = await deviceFetch({
            ip,
            path: '/info',
            method: 'PUT',
            payload: {
                name
            },
            gateway
        })
        return result && result.status == 200
    },
    async getConfig(ip, gateway) {
        const response = await deviceFetch({ip, path: '/config', gateway})
        return response.data
    },
    async saveConfigValues(ip, values, gateway) {
        const result = await deviceFetch({
            ip,
            path: '/config/save',
            method: 'POST',
            payload: values,
            gateway
        })
        return result && result.status == 200
    },
    async deleteConfigValue(ip, key, gateway) {
        const result = await deviceFetch({
            ip,
            path: '/config/delete',
            method: 'POST',
            requestParams: {
                name: key
            },
            gateway
        })
        return result && result.status == 200
    },
    async deleteAllConfigValues(ip, gateway) {
        const result = await deviceFetch({
            ip,
            path: '/config/delete/all',
            method: 'DELETE',
            gateway
        })
        return result && result.status == 200
    },
    async executeDeviceAcion(ip, action, gateway) {
        const result = await deviceFetch({
            ip,
            path: '/action',
            method: 'PUT',
            requestParams: {
                action
            },
            gateway
        })
        return result && result.status == 200
    },
    async getDeviceSensors(ip, gateway) {
        const response = await deviceFetch({ip, path: '/sensors', gateway})
        return response.data
    },
    async getDeviceStates(ip, gateway) {
        const response = await deviceFetch({ip, path: '/states', gateway})
        return response.data
    },
    async getAllCallbacks(ip, gateway) {
        const response = await deviceFetch({ip, path: '/callbacks', gateway})
        return response.data
    },
    async getCallbacks(ip, observable, gateway) {
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
    },
    async getCallbackById(ip, observable, id, gateway) {
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
    },
    async getCallbacksTemplates(ip, gateway) {
        const response = await deviceFetch({ip, path: '/callbacks/template', gateway})
        return response.data
    },
    async createCallback(ip, observable, callback, gateway) {
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
        return result && result.status == 201
    },
    async updateCallback(ip, observable, callback, gateway) {
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
        return result && result.status == 200
    },
    async deleteCallback(ip, observable, id, gateway) {
        const result = await deviceFetch({
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
        return result && result.status == 200
    },
}