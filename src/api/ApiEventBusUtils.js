import { EventBus, toast, REQUEST } from '../utils/EventBus.js'

export function notifyDescByStatus(status) {
  switch (status) {
    case 404:
      return 'Endpoint not found'
    case 403:
      return 'Failed to authorize'
    case 500:
      return 'Service error'
    default:
      return ''
  }
}

export function sendNotification({ result, info, infoDescription, error, errorDescription }) {
  if (result) {
    toast.success({
      caption: info,
      description: infoDescription
    })
  } else {
    toast.error({
      caption: error,
      description: errorDescription
    })
  }
}

export function notifyRequestFailed({ caption = 'Request failed', description }) {
  toast.error({
    caption,
    description
  })
}

export function sendRequestState(requestId, loading) {
  if (!requestId) {
    return
  }
  EventBus.emit(REQUEST, {
    id: requestId,
    loading
  })
}
