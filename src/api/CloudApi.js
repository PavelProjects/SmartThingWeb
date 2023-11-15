import { Client } from '@stomp/stompjs';
import axios, { HttpStatusCode } from "axios";
import { EventBus, notify } from "../utils/EventBus";

const CLOUD_IP = import.meta.env.VITE_CLOUD_IP
const CLOUD_PORT = import.meta.env.VITE_CLOUD_PORT
const CLOUD_BROKER_URL = import.meta.env.VITE_CLOUD_WS

const BROKER_URL = `ws://${CLOUD_IP}:${CLOUD_PORT}/${CLOUD_BROKER_URL}`

const URL_AUTH = '/auth'
const URL_AUTH_USER = '/auth/user'
const URL_AUTH_GATEWAY = '/auth/gateway'
const URL_LOGOUT_GATEWAY = '/auth/gateway/logout'
const URL_GATEWAYS_LIST = '/gateway/management/list'
const URL_GATEWAY_REQUEST = '/gateway/request'
const URL_GATEWAY_CREATE = '/gateway/management/create'
const URL_GATEWAY_UPDATE = '/gateway/management/update'
const URL_GATEWAY_DELETE = '/gateway/management/delete'

// axios.defaults.withCredentials = true

const axiosInstance = axios.create({
    baseURL: `http://${CLOUD_IP}:${CLOUD_PORT}`,
    timeout: 5000,
    withCredentials: true
})
// axiosInstance.interceptors.response.use(null, (error) => {
//     if (error.response.status == HttpStatusCode.Forbidden) {

//     }
// })

const client = new Client({brokerURL: BROKER_URL});

const CloudApi = {
    connectToResponseTopic(user) {
        if (!user || !user.login) {
            console.error("Can't subscribe to response topic - user is missing!")
            return;
        }

        try {
            console.debug("Trying to close topic listener")
            client.deactivate()
        } catch (error) {
            console.error(error)
        }

        const topic = '/response/' + user.login
        client.onConnect = () => {
            console.debug("Subscribing to search topic " + topic)
            client.subscribe(topic, (message) => {
                if (message && message.body) {
                    console.debug("God response: " + message.body)
                    const response = JSON.parse(message.body)
                    EventBus.emit(response.id, JSON.parse(response.result))
                } else {
                    console.warn("Empty topic message")
                }
            }, {id: "responses"})
        }

        console.debug("Connecting to ws broker " + BROKER_URL)
        client.activate()
    },
    async getAuthorization() {
        try {
            const response = await axiosInstance.get(URL_AUTH)
            return response.data
        } catch (error) {
            console.error(error)
        }
    },
    async authUser(login, password) {
        try {
            const response = await axiosInstance.post(URL_AUTH_USER, {login, password})
            notify({caption: "Successfully authorized", type: "success"})
            return response.data
        } catch (error) {
            console.log(error)
            notify({
                caption: "Failed to authorize!",
                description: error.response.status == 403 ? "Wrong login/passwor" : "Service error",
                type: "error"
            })
        }
    },
    async authGateway(gateway) {
        try {
            const response = await axiosInstance.post(URL_AUTH_GATEWAY, {
                gatewayId: gateway.id,
                days: 0
            })
            return response.data
        } catch (error) {
            console.error(error)
        }
    },
    async logoutGateway(gateway) {
        try {
            const response = await axiosInstance.post(
                `${URL_LOGOUT_GATEWAY}/${gateway.id}`
            )
            return response.status == 200
        } catch (error) {
            console.error(error)
        }
    },
    async getGatewaysList() {
        try {
            const response = await axiosInstance.get(URL_GATEWAYS_LIST)
            return response.data
        } catch (error) {
            console.error(error)
        }
    },
    async createGateway({name, description}) {
        try {
            const response = await axiosInstance.post(URL_GATEWAY_CREATE, {name, description})
            return response.status == 201
        } catch (error) {
            console.error(error)
            if (error.response.status == 400) {
                notify({
                    type: "error",
                    caption: error.response.data
                })
            }
        }
    },
    async updateGateway({id, name, description}) {
        try {
            const response = await axiosInstance.put(URL_GATEWAY_UPDATE, {id, name, description})
            return response.status == 200
        } catch (error) {
            console.log(error)
            if (error.response.status == 400) {
                notify({
                    type: "error",
                    caption: error.response.data
                })
            }
        }
    },
    async deleteGateway(gateway) {
        try {
            const response = await axiosInstance.delete(
                URL_GATEWAY_DELETE + '/' + gateway.id
            )
            return response.status == 200
        } catch (error) {
            console.error(error)
        }
    },
    async sendGatewayCommand(gateway, command) {
        try {
            const response = await axiosInstance.post(
                URL_GATEWAY_REQUEST + "/command",
                {
                    gatewayId: gateway.id,
                    command
                }
            )
            return response.data
        } catch (error) {
            console.error(error)
            notify({
                caption: "Failed to send gateway command",
                type: "error"
            })
        }
    },
    async sendDeviceRequest(gateway, {target, path, method, payload}) {
        try {
            const response = await axiosInstance.post(
                URL_GATEWAY_REQUEST + "/send",
                {
                    gatewayId: gateway.id,
                    target,
                    path,
                    method,
                    payload: JSON.stringify(payload)
                }
            )
            return response.data
        } catch (error) {
            console.error(error)
            notify({
                caption: "Failed to send device request",
                type: "error"
            })
        }
    }
}
export { CloudApi };