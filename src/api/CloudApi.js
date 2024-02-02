import { Client } from '@stomp/stompjs';
import axios from "axios";
import { EventBus, toast, STOMP_CONNECTED } from "../utils/EventBus";

const CLOUD_IP = import.meta.env.VITE_CLOUD_IP || document.location.hostname
const CLOUD_PORT = import.meta.env.VITE_CLOUD_PORT
const CLOUD_BROKER_PATH = import.meta.env.VITE_CLOUD_WS

const CLOUD_BROKER_URL = `ws://${CLOUD_IP}:${CLOUD_PORT}/${CLOUD_BROKER_PATH}`

const URL_AUTH = '/auth'
const URL_AUTH_USER = '/auth/user'
const URL_AUTH_GATEWAY = '/auth/gateway'
const URL_LOGOUT_GATEWAY = '/auth/gateway/logout'
const URL_GATEWAYS_LIST = '/gateway/management/list'
const URL_GATEWAY_REQUEST = '/gateway/requests'
const URL_GATEWAY_CREATE = '/gateway/management/create'
const URL_GATEWAY_UPDATE = '/gateway/management/update'
const URL_GATEWAY_DELETE = '/gateway/management/delete'

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
        CLOUD_STOMP_CLIENT.onConnect = () => {
            console.debug("Connected to message broker")
            EventBus.emit(STOMP_CONNECTED, CLOUD_STOMP_CLIENT)
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
            const response = await axiosInstance.post(URL_LOGOUT_GATEWAY, {
                gatewayId: gateway.id
            })
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
            toast.error({
                caption: "Failed to load gateways"
            })
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
            return response.data || {}
        } catch (error) {
            console.error(error)
        }
    },
    async sendDeviceRequest({gateway, device, method, params}) {
        try {
            const response = await axiosInstance.post(
                URL_GATEWAY_REQUEST + "/device",
                {
                    gatewayId: gateway.id,
                    request: { device, method, params }
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
}
export { CloudApi, CLOUD_STOMP_CLIENT };