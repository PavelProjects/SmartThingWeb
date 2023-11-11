import mitt from 'mitt'

export const EventBus = mitt()
export const NOTIFY = "notify"
export const REQUEST = "request"

export const notify = ({caption, description, type="info"}) => {
    EventBus.emit(NOTIFY, {caption, description, type});
}