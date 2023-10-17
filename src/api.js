
async function defaultGet(path, expectedStatus = 200,errorMessage = "Failed to load data from " + path) {
    const response = await fetch(path)
    if (response.status !== expectedStatus) {
        console.error(errorMessage)
        return null
    }
    return await response.json()
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
    async getConfig(ip) {
        return defaultGet(`http://${ip}/config`)
    },
    async addConfigValues(ip, values) {
        const body = JSON.stringify(values)
        const response = await fetch(
            `http://${ip}/config/add`,
            {
                method: 'POST',
                body
            }
        )
        return response.status == 200
    },
    async deleteConfigValue(ip, key) {
        const response = await fetch(
            `http://${ip}/config/delete?name=${key}`,
            {
                method: 'DELETE'
            }
        )
        return response.status == 200
    },
    async executeDeviceAcion(ip, actions) {
        const response = await fetch(`http://${ip}/action?action=${actions}`, {
            method: 'PUT'
        })
        return response.status == 200
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
    async getCallbacks(ip, type, name) {
        return defaultGet(`http://${ip}/callbacks/by/observable?observableType=${type}&name=${name}`)
    },
    async getCallbackById(ip, type, name, id) {
        return defaultGet(`http://${ip}/callbacks/by/id?observableType=${type}&name=${name}&id=${id}`)
    },
    async getCallbacksTemplates(ip) {
        return defaultGet(`http://${ip}/callbacks/template`)
    },
    async createCallback(ip, observable, callback) {
        const body = JSON.stringify({
            observable,
            callback
        })
        const response = await fetch (
            `http://${ip}/callbacks/create`,
            {
                method: 'POST',
                body
            }
        )
        return response.status == 201
    },
    async updateCallback(ip, observable, callback) {
        const body = JSON.stringify({
            observable,
            callback
        })
        const response = await fetch (
            `http://${ip}/callbacks/update`,
            {
                method: 'PUT',
                body
            }
        )
        return response.status == 200
    },
    async deleteCallback(ip, type, name, id) {
        const response = await fetch (
            `http://${ip}/callbacks/delete?observableType=${type}&name=${name}&id=${id}`,
            {
                method: 'DELETE',
            }
        )
        return response.status == 200    
    },
}