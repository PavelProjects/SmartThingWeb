import mitt from 'mitt'

export const EventBus = mitt()
export const NOTIFY = "notify"
export const REQUEST = "request"