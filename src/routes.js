import ControlPanel from './components/ControlPanel.vue'
import DeviceLogs from './components/device/logs/DeviceLogs.vue'
import SettingsManager from './components/device/settings/SettingsManager.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const mode = import.meta.env.VITE_MODE

const gatewayRoutes = [
  {
    path: '/',
    redirect: () => {
      return '/panel'
    },
    children: [
      {
        path: '/panel',
        component: ControlPanel
      },
      {
        path: '/logs',
        component: DeviceLogs
      },
      {
        path: '/settings',
        component: SettingsManager
      }
    ]
  }
]

const cloudRoutes = [
  {
    path: '/',
    redirect: () => {
      return '/panel'
    },
    children: [
      {
        path: '/panel',
        component: {
          render() {
            return null
          }
        }
      },
      {
        path: '/panel/:gateway',
        component: ControlPanel
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: mode === 'cloud' ? cloudRoutes : gatewayRoutes
})
