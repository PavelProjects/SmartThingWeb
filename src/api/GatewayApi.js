import { defaultGet, fetchCustom } from "./ApiFetchUtils"
import { Client } from '@stomp/stompjs';
import { EventBus, REQUEST } from "../utils/EventBus";

const GATEWAY_PATH = import.meta.env.VITE_GATEWAY_PATH
const GATEWAY_PORT = import.meta.env.VITE_GATEWAY_PORT
const GATEWAY_WS = import.meta.env.VITE_GATEWAY_WS
const SEARCH_TOPIC = import.meta.env.VITE_GATEWAY_SEARCH_TOPIC
const BROKER_URL = `ws://${GATEWAY_PATH}:${GATEWAY_PORT}/${GATEWAY_WS}`
const SEARCH_TIME = 10000

const URL_CLOUD_INFO = "auth/configuration"
const URL_CLOUD_CONNECTED = "connection/connected"
const URL_CLOUD_CONNECT = "connection/connect"

const GatewayApi = {
    // send command search
    async searchDevices(onDeviceFound = (device) => {console.log(device)}) {
        EventBus.emit(REQUEST, {id: "search", loading: true})
        const client = new Client({brokerURL: BROKER_URL});
        client.onConnect = () => {
            console.log("Subscribing to search topic " + SEARCH_TOPIC)
            client.subscribe(SEARCH_TOPIC, (message) => {
                if (message && message.body) {
                    onDeviceFound(JSON.parse(message.body));
                } else {
                    console.warn("Empty topic message")
                }
            }, {id: "search"})
        }
        console.log("Connecting to ws broker " + BROKER_URL)
        client.activate()

        setTimeout(() => {
            if (client) {
                client.unsubscribe("search")
                console.log("Unsubscribed from search topic")
            } else {
                console.error("Can't disconnect from broker - client is missing")
            }
            EventBus.emit(REQUEST, {id: "search", loading: false})
        }, SEARCH_TIME)
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
            notification: {
                info: "Connected",
                error: "Failed to connect"
            }
        })
        return response.status == 200 && await response.json();
    }
}

export { GatewayApi }