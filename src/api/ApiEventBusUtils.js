import {EventBus, notify, REQUEST} from '../utils/EventBus.js'

export function notifyDescByStatus(status) {
    switch (status) {
        case 404:
            return "Endpoint not found"
        case 403:
            return "Failed to authorize"    
        case 500:
            return "Service error"    
        default:
            return ""
    }
}

export function sendNotification({result, info, infoDescription, error, errorDescription}) {
    if (result) {
        notify({
            caption: info,
            description: infoDescription,
            type: "success"
        })
    } else {
        notify({
            caption: error,
            description: errorDescription,
            type: "error"
        })
    }
}

export function notifyRequestFailed({caption = "Request failed", description}) {
    notify({
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
