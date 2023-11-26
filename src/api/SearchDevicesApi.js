import { EventBus, REQUEST, STOMP_CONNECTED } from "../utils/EventBus";
import { CloudApi } from './CloudApi';
import { GATEWAY_STOMP_CLIENT, GATEWAY_SEARCH_TOPIC } from './GatewayApi';

const SEARCH_TIME = 10000

const GatewaySearhApi = {
    async searchDevices(onDeviceFound = (device) => {console.log(device)}) {
        if (!GATEWAY_STOMP_CLIENT.connected) {
            let promiseResolver;
            const promise = new Promise(resolve => promiseResolver = resolve);
            EventBus.on(STOMP_CONNECTED, () => promiseResolver())
            await promise
        }

        EventBus.emit(REQUEST, {id: "search", loading: true})
        
        console.debug("Subscribing to search topic " + GATEWAY_SEARCH_TOPIC)
        // GATEWAY_STOMP_CLIENT.subscribe(GATEWAY_SEARCH_TOPIC, (message) => {
        //     if (message && message.body) {
        //         onDeviceFound(JSON.parse(message.body));
        //     } else {
        //         console.warn("Empty topic message")
        //     }
        // }, {id: "search"})

        setTimeout(() => {
            GATEWAY_STOMP_CLIENT.unsubscribe("search")
            console.debug("Unsubscribed from search topic")
            EventBus.emit(REQUEST, {id: "search", loading: false})
        }, SEARCH_TIME)
    },
}

const CloudSearchApi = {
    async searchDevices(onDeviceFound = (device) => {console.debug(device);}, gateway) {
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