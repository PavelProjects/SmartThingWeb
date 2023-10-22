import {notifyDescByStatus, sendNotification, notifyRequestFailed, sendRequestState} from "./ApiEventBusUtils.js"

export async function fetchCustom({
    requestId, path, method = 'GET', payload = null, headers = {}, expectedStatus = 200, notification = null
}) {
        try {
            sendRequestState(requestId, true)

            let body = null
            if (payload) {
                body = JSON.stringify(payload)
                headers["Content-Type"] = "application/json"
            }
            const response = await fetch(
                path,
                {
                    method,
                    body,
                    headers
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
            return response
        } catch (error) {
            console.log(`Request to ${path} failed: ${error}`)
            notifyRequestFailed()
            return {
                status: -1,
                json: async () => {return null}
            }
        } finally {
            sendRequestState(requestId, false)
        }
}

export async function defaultGet(requestId, path) {
    const result = await fetchCustom({
        requestId,
        path,
        method: 'GET',
        expectedStatus: 200
    })
    return await result.json()
}