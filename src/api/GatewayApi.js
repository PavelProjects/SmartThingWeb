import { defaultGet, fetchCustom } from "./ApiFetchUtils"

const GATEWAY_PATH = import.meta.env.VITE_GATEWAY_PATH
const GATEWAY_PORT = import.meta.env.VITE_GATEWAY_PORT

const URL_GET_AUTHORIZATION = "info/authorization"
const URL_CLOUD_INFO_GET = "configuration/cloud-info"
const URL_CLOUD_INFO_UPDATE = "configuration/cloud-info/update"

export const GatewayApi = {
    async getAuthorization(requestId) {
        return await defaultGet(
            requestId,
            `http://${GATEWAY_PATH}:${GATEWAY_PORT}/${URL_GET_AUTHORIZATION}`
        )
    },
    async getCloudInfo(requestId) {
        return await defaultGet(
            requestId,
            `http://${GATEWAY_PATH}:${GATEWAY_PORT}/${URL_CLOUD_INFO_GET}`,
        )
    },
    async updateCloudInfo(requestId, payload) {
        const response = await fetchCustom({
            requestId,
            path: `http://${GATEWAY_PATH}:${GATEWAY_PORT}/${URL_CLOUD_INFO_UPDATE}`,
            payload,
            method: 'PUT',
            notification: {
                info: "Updated",
                infoDescription: "Cloud connection configration was updated",
                error: "Failed to update cloud configuration"
            }
        })
        return response.status == 200
    }
}