import {notifyDescByStatus, sendNotification, notifyRequestFailed, sendRequestState} from "./ApiEventBusUtils.js"
const REQUEST_TIMEOUT = 5000

const blankResponse = {
    status: -1,
    json: async () => {return null}
}

export async function fetchCustom({
    requestId, path, method = 'GET', payload = null, headers = {}, expectedStatus = 200, notification = null
}) {
    sendRequestState(requestId, true)
    
    let response = blankResponse;
    
    const controller = new AbortController();
    const requestTimeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    let body = null
    if (payload) {
        body = JSON.stringify(payload)
        headers["Content-Type"] = "application/json"
    }

    try {
        response = await fetch(
            path,
            {
                method,
                body,
                headers,
                signal: controller.signal 
            }
        )
        if (notification) {
            const defaultNotification = {
                result: response.status == expectedStatus,
                error: "Request failed",
                errorDescription: notifyDescByStatus(response.status)
            }
            sendNotification({...defaultNotification, ...notification})
        }
    } catch (error) {
        console.log(`Request to ${path} failed: ${error}`)
        const { aborted } = controller.signal || false 
        notifyRequestFailed({
            caption: aborted ? "Request timeout" : "Request failed"
        })
    } finally {
        clearTimeout(requestTimeout);
        sendRequestState(requestId, false)
    }

    return response
}

export async function defaultGet(requestId, path) {
    const result = await fetchCustom({
        requestId,
        path,
        method: 'GET',
        expectedStatus: 200
    })
    try {
        return await result.json()
    } catch (error) {
        console.error(error)
        return null
    }
}