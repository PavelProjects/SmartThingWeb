import { Client } from '@stomp/stompjs';
import { EventBus, REQUEST } from "../utils/EventBus";
import { CloudApi } from './CloudApi';

const GATEWAY_PATH = import.meta.env.VITE_GATEWAY_PATH
const GATEWAY_PORT = import.meta.env.VITE_GATEWAY_PORT
const GATEWAY_WS = import.meta.env.VITE_GATEWAY_WS
const GATEWAY_SEARCH_TOPIC = import.meta.env.VITE_GATEWAY_SEARCH_TOPIC
const GATEWAY_BROKER_URL = `ws://${GATEWAY_PATH}:${GATEWAY_PORT}/${GATEWAY_WS}`
const SEARCH_TIME = 10000

const GatewaySearhApi = {
    searchDevices(onDeviceFound = (device) => {console.log(device)}) {
        EventBus.emit(REQUEST, {id: "search", loading: true})
        const client = new Client({brokerURL: GATEWAY_BROKER_URL});
        client.onConnect = () => {
            console.log("Subscribing to search topic " + GATEWAY_SEARCH_TOPIC)
            client.subscribe(GATEWAY_SEARCH_TOPIC, (message) => {
                if (message && message.body) {
                    onDeviceFound(JSON.parse(message.body));
                } else {
                    console.warn("Empty topic message")
                }
            }, {id: "search"})
        }
        console.log("Connecting to ws broker " + GATEWAY_BROKER_URL)
        client.activate()

        setTimeout(() => {
            client.unsubscribe("search")
            console.log("Unsubscribed from search topic")
            EventBus.emit(REQUEST, {id: "search", loading: false})
        }, SEARCH_TIME)
    },
}

const CloudSearchApi = {
    async searchDevices(onDeviceFound = (device) => {console.log(device);}, gateway) {
        EventBus.emit(REQUEST, {id: "search", loading: true})

        const requestInfo = await CloudApi.sendGatewayCommand(gateway, "search")
        
        EventBus.on(requestInfo.id, (result) => {
            if (Array.isArray(result)) {
                result.forEach(onDeviceFound)
            } else {
                console.error("Search result is not array: " + result)
            }
            EventBus.emit(REQUEST, {id: "search", loading: false})
        })
    }
}

const SearchApi = import.meta.env.VITE_MODE == 'gateway' ? GatewaySearhApi : CloudSearchApi

export { SearchApi }