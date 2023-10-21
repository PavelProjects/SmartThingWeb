import {notifyDescByStatus, sendNotification, notifyRequestFailed} from "./ApiNotifyUtils.js"

const GATEWAY_PATH = import.meta.env.VITE_GATEWAY_PATH
const GATEWAY_PORT = import.meta.env.VITE_GATEWAY_PORT

const URL_CLOUD_STATUS_GET = "info/status"
const URL_CLOUD_INFO_GET = "configuration/cloud-info"
const URL_CLOUD_INFO_UPDATE = "configuration/cloud-info/update"

export const GatewayApi = {
    async getStatus() {
        try {
            const response = await fetch(
                `http://${GATEWAY_PATH}:${GATEWAY_PORT}/${URL_CLOUD_STATUS_GET}`
            )
            if (response.status !== 200) {
                console.error("Failed to fetch fateway status")
                return {}
            }
            return await response.json()
        } catch (error) {
            console.error("Failed to fetch gateway status: " + error)
            notifyRequestFailed(URL_CLOUD_STATUS_GET)
            return {}
        }
    },
    async getCloudInfo() {
        try {
            const response = await fetch(
                `http://${GATEWAY_PATH}:${GATEWAY_PORT}/${URL_CLOUD_INFO_GET}`
            )
            if (response.status !== 200) {
                console.error("Failed to fetch cloud info")
                return {}
            }
            return await response.json()
        } catch (error) {
            console.error("Failed to fetch cloud info: " + error)
            notifyRequestFailed(URL_CLOUD_INFO_GET)
            return {}
        }
    },
    async updateCloudInfo(payload) {
        try {
            const body = JSON.stringify(payload)
            const response = await fetch(
                `http://${GATEWAY_PATH}:${GATEWAY_PORT}/${URL_CLOUD_INFO_UPDATE}`,
                {
                    method: 'PUT',
                    headers: { 
                      "Content-Type": "application/json"
                    },
                    body
                }
            )
            const res = response.status == 200
            sendNotification({
                result: res,
                info: "Updated",
                infoDescription: "Cloud connection configration was updated",
                error: "Failed to update cloud configuration",
                errorDescription: notifyDescByStatus(response.status)
            })
            return res
        } catch (error) {
            console.error("Failed to update cloud info: " + error)
            notifyRequestFailed(URL_CLOUD_INFO_UPDATE)
            return false
        }
    }
}