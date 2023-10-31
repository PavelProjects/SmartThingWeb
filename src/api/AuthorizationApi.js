import { defaultGet, fetchCustom } from "./ApiFetchUtils"

const GATEWAY_PATH = import.meta.env.VITE_GATEWAY_PATH
const GATEWAY_PORT = import.meta.env.VITE_GATEWAY_PORT

const URL_AUTHORIZATION = "auth"

const AuthorizationApi = {
    async getCloudAuthorization(requestId) {
        return await defaultGet(
            requestId,
            `http://${GATEWAY_PATH}:${GATEWAY_PORT}/${URL_AUTHORIZATION}`
        )
    },
    async cloudAuthorize(requestId, payload) {
        const response = await fetchCustom({
            requestId,
            path: `http://${GATEWAY_PATH}:${GATEWAY_PORT}/${URL_AUTHORIZATION}`,
            payload,
            method: 'PUT',
            notification: {
                info: "Successfuly authorized in cloud",
                error: "Failed to authorize in cloud"
            }
        })
        return response.status == 200 ? await response.json() : {}
    },
}

export { AuthorizationApi }