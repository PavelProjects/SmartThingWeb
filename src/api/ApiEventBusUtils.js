import {EventBus, NOTIFY, REQUEST} from '../EventBus.js'

export function notifyDescByStatus(status) {
    switch (status) {
        case 500:
            return "Check device logs for the additional info"
        case 404:
            return "Endpoint not found"
        default:
            return ""
    }
}

export function sendNotification({result, info, infoDescription, error, errorDescription}) {
    if (result) {
        EventBus.emit(NOTIFY, {
            caption: info,
            description: infoDescription,
            type: "success"
        })
    } else {
        EventBus.emit(NOTIFY, {
            caption: error,
            description: errorDescription,
            type: "error"
        })
    }
}

export function notifyRequestFailed({caption = "Request failed", description}) {
    EventBus.emit(NOTIFY, {
        caption,
        description,
        type: "error"
    })
}

export function sendRequestState(requestId, loading) {
    if (!requestId) {
        return
    }
    EventBus.emit(
        REQUEST,
        {
            id: requestId,
            loading
        }
    )
}
