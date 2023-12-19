import { Client } from '@stomp/stompjs';
import axios from "axios";
import { EventBus, toast, STOMP_CONNECTED } from "../utils/EventBus";

const CLOUD_IP = import.meta.env.VITE_CLOUD_IP
const CLOUD_PORT = import.meta.env.VITE_CLOUD_PORT
const CLOUD_BROKER_PATH = import.meta.env.VITE_CLOUD_WS

const CLOUD_BROKER_URL = `ws://${CLOUD_IP}:${CLOUD_PORT}/${CLOUD_BROKER_PATH}`

const URL_AUTH = '/auth'
const URL_AUTH_USER = '/auth/user'
const URL_AUTH_GATEWAY = '/auth/gateway'
const URL_LOGOUT_GATEWAY = '/auth/gateway/logout'
const URL_GATEWAYS_LIST = '/gateway/management/list'
const URL_GATEWAY_REQUEST = '/gateway/request'
const URL_GATEWAY_CREATE = '/gateway/management/create'
const URL_GATEWAY_UPDATE = '/gateway/management/update'
const URL_GATEWAY_DELETE = '/gateway/management/delete'
const URL_GATEWAY_ONLINE = '/gateway/management/online'

const axiosInstance = axios.create({
    baseURL: `http://${CLOUD_IP}:${CLOUD_PORT}`,
    timeout: 5000,
    withCredentials: true
})

const CLOUD_STOMP_CLIENT = new Client({brokerURL: CLOUD_BROKER_URL});

const CloudApi = {
    connectToWs(user) {
        if (!user || !user.login) {
            console.error("Can't subscribe to response topic - user is missing!")
            return;
        }
        const topic = '/response/' + user.login
        CLOUD_STOMP_CLIENT.onConnect = () => {
            console.debug("Connected to message broker")
            EventBus.emit(STOMP_CONNECTED, CLOUD_STOMP_CLIENT)
            
            console.debug("Subscribing to search topic " + topic)
            CLOUD_STOMP_CLIENT.subscribe(topic, (message) => {
                if (message && message.body) {
                    console.debug("God response: " + message.body)
                    const response = JSON.parse(message.body)
                    EventBus.emit(response.id, JSON.parse(response.result))
                } else {
                    console.warn("Empty topic message")
                }
            }, {id: "responses"})
        }
        console.debug("Connecting to ws broker " + CLOUD_BROKER_URL)
        CLOUD_STOMP_CLIENT.activate()
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
            toast.success({caption: "Successfully authorized"})
            return response.data
        } catch (error) {
            console.log(error)
            toast.error({
                caption: "Failed to authorize!",
                description: error.response.status == 403 ? "Wrong login/passwor" : "Service error",
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
                toast.error({
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
                toast.error({
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
            toast.error({
                caption: "Failed to send gateway command",
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
            toast.error({
                caption: "Failed to send device request",
            })
        }
    },
    async isOnline(gateway) {
        try {
            const response = await axiosInstance.get(`${URL_GATEWAY_ONLINE}/${gateway.id}`);
            return response.data
        } catch (error) {
            console.log(error)
        }
    },
}
export { CloudApi, CLOUD_STOMP_CLIENT };