import { HTTP_METHOD, gatewayFetch } from './GatewayFetch'

const PATH_NOTIFICATIONS = '/api/notification'

const NotificationApi = {
  async getNotifications({ gateway }) {
    return (
      await gatewayFetch({
        gateway,
        url: PATH_NOTIFICATIONS,
        method: HTTP_METHOD.GET
      })
    ).data
  },
  async markNotificationSeen({ gateway, notificationId }) {
    await gatewayFetch({
      gateway,
      url: `${PATH_NOTIFICATIONS}?id=${notificationId}`,
      method: HTTP_METHOD.DELETE
    })
  }
}

export { NotificationApi }
