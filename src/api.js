
async function defaultGet(path, expectedStatus = 200,errorMessage = "Failed to load data from " + path) {
    try {
        const response = await fetch(path)
        if (response.status !== expectedStatus) {
            console.error(errorMessage)
            return null
        }
        return await response.json()
    } catch (error) {
        console.log(`Request to ${path} failed: ${error}`)
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
                    body
                }
            )
            return response.status == 200
        } catch (error) {
            console.log(`Failed to save new device name: ${error}`)
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
                    body
                }
            )
            return response.status == 200
        } catch (error) {
            console.log(`Failed to add config values: ${error}`)
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
            return response.status == 200
        } catch (error) {
            console.log(`Failed to delete config values: ${error}`)
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
            return response.status == 200
        } catch (error) {
            console.log(`Failed to delete config values: ${error}`)
            return false
        }
    },
    async executeDeviceAcion(ip, actions) {
        try {
            const response = await fetch(`http://${ip}/action?action=${actions}`, {
                method: 'PUT'
            })
            return response.status == 200
        } catch (error) {
            console.log(`Failed to execute device action: ${error}`)
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
                    body
                }
            )
            return response.status == 201
        } catch (error) {
            console.log(`Failed to create callback: ${error}`)
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
                    body
                }
            )
            return response.status == 200
        } catch (error) {
            console.log(`Failed to update callback: ${error}`)
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
            return response.status == 200    
        } catch (error) {
            console.log(`Failed to delete callback: ${error}`)
            return false
        }
    },
}