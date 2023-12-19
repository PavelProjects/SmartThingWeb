import { defaultGet, fetchCustom } from "./ApiFetchUtils"
import { Client } from '@stomp/stompjs';
import { EventBus, STOMP_CONNECTED } from "../utils/EventBus";

const GATEWAY_PATH = import.meta.env.VITE_GATEWAY_PATH
const GATEWAY_PORT = import.meta.env.VITE_GATEWAY_PORT

const GATEWAY_WS = import.meta.env.VITE_GATEWAY_WS
const GATEWAY_SEARCH_TOPIC = import.meta.env.VITE_GATEWAY_SEARCH_TOPIC
const GATEWAY_BROKER_URL = `ws://${GATEWAY_PATH}:${GATEWAY_PORT}/${GATEWAY_WS}`

const URL_AUTHORIZATION = "auth"
const URL_CLOUD_INFO = "auth/configuration"
const URL_CLOUD_CONNECTED = "connection/connected"
const URL_CLOUD_CONNECT = "connection/connect"

const GATEWAY_STOMP_CLIENT = new Client({brokerURL: GATEWAY_BROKER_URL});
//todo rework bruhhh
if (import.meta.env.VITE_MODE == 'gateway') {
    console.debug("Connecting to message broker " + GATEWAY_BROKER_URL)
    GATEWAY_STOMP_CLIENT.onConnect = async () => {
        console.debug("Connected to message broker " + GATEWAY_STOMP_CLIENT.brokerURL)
        EventBus.emit(STOMP_CONNECTED, GATEWAY_STOMP_CLIENT)
    }
    GATEWAY_STOMP_CLIENT.activate()
}

const GatewayApi = {
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
            toast: {
                info: "Successfuly authorized in cloud",
                error: "Failed to authorize in cloud"
            }
        })
        return response.status == 200 ? await response.json() : {}
    },
    async getCloudInfo(requestId) {
        return await defaultGet(
            requestId,
            `http://${GATEWAY_PATH}:${GATEWAY_PORT}/${URL_CLOUD_INFO}`,
        )
    },
    async getConnectionStatus(requestId) {
        return await defaultGet(
            requestId,
            `http://${GATEWAY_PATH}:${GATEWAY_PORT}/${URL_CLOUD_CONNECTED}`
        )
    },
    async cloudConnect(requestId) {
        const response = await fetchCustom({
            requestId,
            path: `http://${GATEWAY_PATH}:${GATEWAY_PORT}/${URL_CLOUD_CONNECT}`,
            method: 'PUT',
            toast: {
                info: "Connected",
                error: "Failed to connect"
            }
        })
        return response.status == 200 && await response.json();
    }
}

export { GatewayApi, GATEWAY_SEARCH_TOPIC, GATEWAY_STOMP_CLIENT }