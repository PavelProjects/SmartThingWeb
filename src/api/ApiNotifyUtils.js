import {EventBus, NOTIFY} from '../EventBus.js'

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

export function notifyRequestFailed(path) {
    EventBus.emit(NOTIFY, {
        caption: "Request failed",
        description: path ? `Request to ${path} failed` : '',
        type: "error"
    })
}
