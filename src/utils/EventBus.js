import mitt from 'mitt'

export const EventBus = mitt()
export const NOTIFY = "notify"
export const REQUEST = "request"
export const STOMP_CONNECTED = "STOMP_CONNECTED"

export const notifyFromDevice = ({gateway, device, notification: {caption, description, type="info", autoClose = false}}) => {
    EventBus.emit(NOTIFY, {
        gateway,
        device,
        notification: {
            caption, description, type, autoClose
        }
    })
}

export const notify = ({caption, description, type = "info", autoClose = true}) => {
    EventBus.emit(NOTIFY, {notification: {caption, description, type, autoClose}});
}