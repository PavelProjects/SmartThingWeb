import { defaultGet, fetchCustom } from "./ApiFetchUtils"

export const DeviceApi = {
    async getDeviceInfo(ip, requestId) {
        return defaultGet(requestId, `http://${ip}/info/system`)
    },
    async getDeviceActionsInfo(ip, requestId) {
        return defaultGet(requestId, `http://${ip}/info/actions`)
    },
    async getDeviceConfigInfo(ip, requestId) {
        return defaultGet(requestId, `http://${ip}/info/config`)
    },
    async saveName(ip, name, requestId) {
        const result = await fetchCustom({
            requestId,
            path: `http://${ip}/info`,
            method: 'PUT',
            payload: {name},
            expectedStatus: 200,
            notification: {
                info: "Name changed",
                error: "Failed to change name"
            }
        })
        return result && result.status == 200
    },
    async getConfig(ip, requestId) {
        return defaultGet(requestId, `http://${ip}/config`)
    },
    async saveConfigValues(ip, values, requestId) {
        const result = await fetchCustom({
            requestId,
            path: `http://${ip}/config/save`,
            method: 'POST',
            payload: values,
            expectedStatus: 200,
            notification: {
                info: "Configuration updated",
                error: "Failed to update configuration"
            }
        })
        return result && result.status == 200
    },
    async deleteConfigValue(ip, key, requestId) {
        const result = await fetchCustom({
            requestId,
            path: `http://${ip}/config/delete?name=${key}`,
            method: 'POST',
            expectedStatus: 200,
            notification: {
                info: "The configuration value has been removed",
                error: "Failed to remove configuration value"
            }
        })
        return result && result.status == 200
    },
    async deleteAllConfigValues(ip, requestId) {
        const result = await fetchCustom({
            requestId,
            path: `http://${ip}/config/delete/all`,
            method: 'DELETE',
            expectedStatus: 200,
            notification: {
                info: "Configuration removed",
                error: "Failed to remove configuration"
            }
        })
        return result && result.status == 200
    },
    async executeDeviceAcion(ip, action, requestId) {
        const result = await fetchCustom({
            requestId,
            path: `http://${ip}/action?action=${action}`,
            method: 'PUT',
            expectedStatus: 200,
            notification: {
                info: "Action completed",
                error: "Failed to complete device action"
            }
        })
        return result && result.status == 200
    },
    async getDeviceSensors(ip, requestId) {
        return defaultGet(requestId, `http://${ip}/sensors`)
    },
    async getDeviceStates(ip, requestId) {
        return defaultGet(requestId, `http://${ip}/states`)
    },
    async getAllCallbacks(ip, requestId) {
        return defaultGet(requestId, `http://${ip}/callbacks`)
    },
    async getCallbacks(ip, observable, requestId) {
        return defaultGet(
            "getCallbacks", 
            `http://${ip}/callbacks/by/observable?observableType=${observable.type}&name=${observable.name}`
        )
    },
    async getCallbackById(ip, observable, id, requestId) {
        return defaultGet(
            requestId, 
            `http://${ip}/callbacks/by/id?observableType=${observable.type}&name=${observable.name}&id=${id}`
            )
    },
    async getCallbacksTemplates(ip, requestId) {
        return defaultGet(
            requestId, 
            `http://${ip}/callbacks/template`
        )
    },
    async createCallback(ip, observable, callback, requestId) {
        const result = await fetchCustom({
            requestId,
            path: `http://${ip}/callbacks/create`,
            method: 'POST',
            payload: {
                observable,
                callback
            },
            expectedStatus: 201,
            notification: {
                info: "Callback created",
                error: "Failed to create callback"
            }
        })
        return result && result.status == 201
    },
    async updateCallback(ip, observable, callback, requestId) {
        const result = await fetchCustom({
            requestId,
            path: `http://${ip}/callbacks/update`,
            method: 'POST',
            payload: {
                observable,
                callback
            },
            expectedStatus: 200,
            notification: {
                info: "Callback updated",
                error: "Failed to update callback"
            }
        })
        return result && result.status == 200
    },
    async deleteCallback(ip, observable, id, requestId) {
        const result = await fetchCustom({
            requestId,
            path: `http://${ip}/callbacks/delete?observableType=${observable.type}&name=${observable.name}&id=${id}`,
            method: 'DELETE',
            expectedStatus: 200,
            notification: {
                info: "The callback has been removed",
                error: "Failed to remove callback"
            }
        })
        return result && result.status == 200
    },
}