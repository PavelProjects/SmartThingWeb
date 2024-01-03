import mitt from 'mitt'

export const EventBus = mitt()
export const TOAST = "toast"
export const REQUEST = "request"
export const STOMP_CONNECTED = "STOMP_CONNECTED"

export const notifyFromDevice = ({ device, notification: { message, type } }) => {
  EventBus.emit(TOAST, {
    device,
    toast: {
      description: message,
      type: type,
      autoClose: false,
    }
  })
}

export const toast = {
  info: ({ caption, description, autoClose = true }) => {
    EventBus.emit(TOAST, { toast: { caption, description, type: "info", autoClose } })
  },
  error: ({ caption, description, autoClose = true }) => {
    EventBus.emit(TOAST, { toast: { caption, description, type: "error", autoClose } })
  },
  success: ({ caption, description, autoClose = true }) => {
    EventBus.emit(TOAST, { toast: { caption, description, type: "success", autoClose } })
  },
}