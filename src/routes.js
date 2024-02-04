import ControlPanel from './components/ControlPanel.vue'
import DeviceLogs from './components/device/logs/DeviceLogs.vue'
import SettingsManager from './components/device/settings/SettingsManager.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: () => {
      return '/devices/panel'
    },
    children: [
      {
        path: '/devices/panel',
        component: ControlPanel
      },
      {
        path: '/devices/logs',
        component: DeviceLogs
      },
      {
        path: '/devices/settings',
        component: SettingsManager
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})
