import mitt from 'mitt'

export const EventBus = mitt()
export const TOAST = "toast"
export const REQUEST = "request"
export const STOMP_CONNECTED = "STOMP_CONNECTED"

export const notifyFromDevice = ({gateway, device, toast: {caption, description, type="info", autoClose = false}}) => {
    EventBus.emit(TOAST, {
        gateway,
        device,
        toast: {
            caption, description, type, autoClose
        }
    })
}

export const notify = ({caption, description, type = "info", autoClose = true}) => {
    EventBus.emit(TOAST, {toast: {caption, description, type, autoClose}});
}