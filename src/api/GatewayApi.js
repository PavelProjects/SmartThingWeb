import { defaultGet, fetchCustom } from "./ApiFetchUtils"

const GATEWAY_PATH = import.meta.env.VITE_GATEWAY_PATH
const GATEWAY_PORT = import.meta.env.VITE_GATEWAY_PORT

const URL_AUTHORIZATION = "info/authorization"
const URL_CLOUD_INFO_GET = "info/cloud-info"

export const GatewayApi = {
    async getCloudAuthorization(requestId) {
        return await defaultGet(
            requestId,
            `http://${GATEWAY_PATH}:${GATEWAY_PORT}/${URL_AUTHORIZATION}`
        )
    },
    async getCloudInfo(requestId) {
        return await defaultGet(
            requestId,
            `http://${GATEWAY_PATH}:${GATEWAY_PORT}/${URL_CLOUD_INFO_GET}`,
        )
    },
    async updateCloudAuthorization(requestId, payload) {
        const response = await fetchCustom({
            requestId,
            path: `http://${GATEWAY_PATH}:${GATEWAY_PORT}/${URL_AUTHORIZATION}`,
            payload,
            method: 'PUT',
            notification: {
                info: "Updated",
                infoDescription: "Cloud authorization info was updated",
                error: "Failed to update cloud authorization info"
            }
        })
        return response.status == 200 ? await response.json() : {}
    }
}