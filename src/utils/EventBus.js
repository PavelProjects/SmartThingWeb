import mitt from 'mitt'

export const EventBus = mitt()

export const TOAST = 'toast'
export const REQUEST = 'request'
export const EVENT = 'event'
export const GATEWAY_EVENT = {
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED"
}
export const WS_CONNECTED = 'WS_CONNECTED'
export const LOGGED_IN = 'LOGGED_IN'
export const LOGGED_OUT = 'LOGGED_OUT'

export const toast = {
  info: ({ caption, description, autoClose = true }) => {
    EventBus.emit(TOAST, { toast: { caption, description, type: 'info', autoClose } })
  },
  error: ({ caption, description, autoClose = true }) => {
    EventBus.emit(TOAST, { toast: { caption, description, type: 'error', autoClose } })
  },
  success: ({ caption, description, autoClose = true }) => {
    EventBus.emit(TOAST, { toast: { caption, description, type: 'success', autoClose } })
  }
}
