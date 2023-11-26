import mitt from 'mitt'

export const EventBus = mitt()
export const NOTIFY = "notify"
export const REQUEST = "request"
export const STOMP_CONNECTED = "STOMP_CONNECTED"

export const notifyFromDevice = ({gateway, device, notification: {caption, description, type="info"}}) => {
    EventBus.emit(NOTIFY, {
        gateway,
        device,
        caption,
        description,
        type
    })
}

export const notify = ({caption, description, type="info"}) => {
    EventBus.emit(NOTIFY, {caption, description, type});
}