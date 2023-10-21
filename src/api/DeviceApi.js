import {notifyDescByStatus, sendNotification, notifyRequestFailed} from "./ApiNotifyUtils.js"

async function defaultGet(path, expectedStatus = 200, errorMessage = "Failed to load data from " + path) {
    try {
        const response = await fetch(path)
        if (response.status !== expectedStatus) {
            console.error(errorMessage)
            EventBus.emit(NOTIFY, {
                caption: "Request failed",
                description: errorMessage,
                type: "error"
            })
            return null
        }
        return await response.json()
    } catch (error) {
        console.log(`Request to ${path} failed: ${error}`)
        notifyRequestFailed(path)
        return null
    }
}

export const DeviceApi = {
    async getDeviceInfo(ip) {
        return defaultGet(`http://${ip}/info/system`)
    },
    async getDeviceActionsInfo(ip) {
        return defaultGet(`http://${ip}/info/actions`)
    },
    async getDeviceConfigInfo(ip) {
        return defaultGet(`http://${ip}/info/config`)
    },
    async saveName(ip, name) {
        const body = JSON.stringify({name})
        try {
            const response = await fetch(
                `http://${ip}/info`,
                {
                    method: 'PUT',
                    body,
                    headers: { 
                      "Content-Type": "application/json"
                    }
                }
            )
            const res = response.status == 200
            sendNotification({
                result: res,
                info: "Name changed",
                error: "Failed to change name",
                errorDescription: notifyDescByStatus(response.status)
            })
            return res
        } catch (error) {
            console.log(`Failed to save new device name: ${error}`)
            notifyRequestFailed()
            return false
        }
    },
    async getConfig(ip) {
        return defaultGet(`http://${ip}/config`)
    },
    async saveConfigValues(ip, values) {
        const body = JSON.stringify(values)
        try {
            const response = await fetch(
                `http://${ip}/config/save`,
                {
                    method: 'POST',
                    body,
                    headers: { 
                      "Content-Type": "application/json"
                    }
                }
            )
            const res = response.status == 200
            sendNotification({
                result: res,
                info: "Configuration updated",
                error: "Failed to update configuration",
                errorDescription: notifyDescByStatus(response.status)
            })
            return res
        } catch (error) {
            console.log(`Failed to add config values: ${error}`)
            notifyRequestFailed()
            return false
        }
    },
    async deleteConfigValue(ip, key) {
        try {
            const response = await fetch(
                `http://${ip}/config/delete?name=${key}`,
                {
                    method: 'DELETE'
                }
            )
            const res = response.status == 200
            sendNotification({
                result: res,
                info: "The configuration value has been removed",
                error: "Failed to remove configuration value",
                errorDescription: notifyDescByStatus(response.status)
            })
            return res
        } catch (error) {
            console.log(`Failed to delete config values: ${error}`)
            notifyRequestFailed()
            return false
        }
    },
    async deleteAllConfigValues(ip) {
        try {
            const response = await fetch(
                `http://${ip}/config/delete/all`,
                {
                    method: 'DELETE'
                }
            )
            const res = response.status == 200
            sendNotification({
                result: res,
                info: "Configuration removed",
                error: "Failed to update configuration",
                errorDescription: notifyDescByStatus(response.status)
            })
            return res
        } catch (error) {
            console.log(`Failed to delete config values: ${error}`)
            notifyRequestFailed()
            return false
        }
    },
    async executeDeviceAcion(ip, action) {
        try {
            const response = await fetch(`http://${ip}/action?action=${action}`, {
                method: 'PUT'
            })
            const res = response.status == 200
            sendNotification({
                result: res,
                info: "Action completed",
                error: "Failed to complete device action",
                errorDescription: notifyDescByStatus(response.status)
            })
            return res
        } catch (error) {
            console.log(`Failed to execute device action: ${error}`)
            notifyRequestFailed()
            return false
        }
    },
    async getDeviceSensors(ip) {
        return defaultGet(`http://${ip}/sensors`)
    },
    async getDeviceStates(ip) {
        return defaultGet(`http://${ip}/states`)
    },
    async getAllCallbacks(ip) {
        return defaultGet(`http://${ip}/callbacks`)
    },
    async getCallbacks(ip, observable) {
        return defaultGet(`http://${ip}/callbacks/by/observable?observableType=${observable.type}&name=${observable.name}`)
    },
    async getCallbackById(ip, observable, id) {
        return defaultGet(`http://${ip}/callbacks/by/id?observableType=${observable.type}&name=${observable.name}&id=${id}`)
    },
    async getCallbacksTemplates(ip) {
        return defaultGet(`http://${ip}/callbacks/template`)
    },
    async createCallback(ip, observable, callback) {
        try {
            const body = JSON.stringify({
                observable,
                callback
            })
            const response = await fetch (
                `http://${ip}/callbacks/create`,
                {
                    method: 'POST',
                    body,
                    headers: { 
                      "Content-Type": "application/json"
                    }
                }
            )
            const res = response.status == 201
            sendNotification({
                result: res,
                info: "Callback created",
                error: "Failed to create callback",
                errorDescription: notifyDescByStatus(response.status)
            })
            return res
        } catch (error) {
            console.log(`Failed to create callback: ${error}`)
            notifyRequestFailed()
            return false
        }
    },
    async updateCallback(ip, observable, callback) {
        try {
            const body = JSON.stringify({
                observable,
                callback
            })
            const response = await fetch (
                `http://${ip}/callbacks/update`,
                {
                    method: 'PUT',
                    body,
                    headers: { 
                      "Content-Type": "application/json"
                    }
                }
            )
            const res = response.status == 200
            sendNotification({
                result: res,
                info: "Callback updated",
                error: "Failed to update callback",
                errorDescription: notifyDescByStatus(response.status)
            })
            return res
        } catch (error) {
            console.log(`Failed to update callback: ${error}`)
            notifyRequestFailed()
            return false
        }
    },
    async deleteCallback(ip, observable, id) {
        try {
            const response = await fetch (
                `http://${ip}/callbacks/delete?observableType=${observable.type}&name=${observable.name}&id=${id}`,
                {
                    method: 'DELETE',
                }
            )
            const res = response.status == 200
            sendNotification({
                result: res,
                info: "The callback has been removed",
                error: "Failed to remove callback",
                errorDescription: notifyDescByStatus(response.status)
            })
            return res
        } catch (error) {
            console.log(`Failed to delete callback: ${error}`)
            notifyRequestFailed()
            return false
        }
    },
}