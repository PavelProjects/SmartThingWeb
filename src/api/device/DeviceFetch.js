import { CloudApi } from "../CloudApi";
import { GatewayApi } from "../GatewayApi";

const mode = import.meta.env.VITE_MODE

function joinRequestParams(requestParams) {
    if (!Object.keys(requestParams)) {
        return
    }
    const params = Object.entries(requestParams).map(([key, value]) => `${key}=${value}`)
    return params.length > 0 ? "?" + params.join("&") : ""
}

async function deviceFetchLocal({device, method, params}) {
    if (!device || !method) {
        throw new Error("Device and method is required in device api call!");
    }
    return GatewayApi.callDeviceApi({device, method, params})
}

async function deviceFetchCloud({gateway, device, method, params}) {
    if (!gateway || !device || !method) {
        throw new Error("Gateway, device and method is required in device api call!");
    }
    const { result } = await CloudApi.sendDeviceRequest({gateway, device, method, params})
    const response = JSON.parse(result)
    return {
        status: response.code,
        data: JSON.parse(response.body)
    };
}

const deviceFetch = mode == "cloud" ? deviceFetchCloud : deviceFetchLocal;

export { deviceFetch }