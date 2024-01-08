import axios from "axios";
import { CloudApi } from "../CloudApi";
import { EventBus } from "../../utils/EventBus";

const mode = import.meta.env.VITE_MODE

function joinRequestParams(requestParams) {
    if (!Object.keys(requestParams)) {
        return
    }
    const params = Object.entries(requestParams).map(([key, value]) => `${key}=${value}`)
    return params.length > 0 ? "?" + params.join("&") : ""
}

async function deviceFetchLocal({method = 'GET', ip, path, requestParams = {}, payload}) {
    return await axios({
        timeout: 10000,
        url: `http://${ip}${path[0] != '/' ? '/' : ''}${path}${joinRequestParams(requestParams)}`,
        method,
        data: payload
    })
}

async function deviceFetchCloud({gateway, method = 'GET', ip, path, requestParams = {}, payload}) {
    if (!gateway) {
        console.error("Gateway is required in cloud device fetch! Path: " + path)
        return
    }
    const { result } = await CloudApi.sendDeviceRequest(gateway, {
        target: ip,
        method,
        path: `${path[0] != '/' ? '/' : ''}${path}${joinRequestParams(requestParams)}`,
        payload
    })
    const response = JSON.parse(result)
    return {
        status: response.code,
        data: JSON.parse(response.body)
    };
}

const deviceFetch = mode == "cloud" ? deviceFetchCloud : deviceFetchLocal;

export { deviceFetch }