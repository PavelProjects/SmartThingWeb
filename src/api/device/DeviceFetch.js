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
    const requestInfo = await CloudApi.sendDeviceRequest(gateway, {
        target: ip,
        method,
        path: `${path[0] != '/' ? '/' : ''}${path}${joinRequestParams(requestParams)}`,
        payload
    })
    if (!requestInfo || !requestInfo.id) {
        console.error("Device fetch failed - requestInfo is undefinded")
    }
    let promiseResolver;
    const requestPromise = new Promise((resolve) => promiseResolver = resolve)
    EventBus.on(requestInfo.id, (response) => {
        console.debug("Device fetch finished: " + JSON.stringify(response));
        promiseResolver({
            status: response.code,
            data: JSON.parse(response.body)
        });
    });
    return await requestPromise;
}

const deviceFetch = mode == "cloud" ? deviceFetchCloud : deviceFetchLocal;

export { deviceFetch }