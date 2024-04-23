import GatewayControlPanel from './components/GatewayControlPanel.vue'
import DeviceLogs from './components/device/logs/DeviceLogs.vue'
import SettingsManager from './components/device/settings/SettingsManager.vue'
import GatewaySelector from './components/gateway/GatewaySelector.vue'
import Dashborard from './components/dashboard/Dashboard.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const mode = import.meta.env.VITE_MODE

const unkownRoute = {
  path: '/:pathMatch(.*)*',
  redirect: '/'
}

const gatewayRoutes = [
  {
    path: '/',
    redirect: () => {
      return '/panel'
    },
    children: [
      {
        path: '/panel',
        component: GatewayControlPanel
      },
      {
        path: '/logs',
        component: DeviceLogs
      },
      {
        path: '/settings',
        component: SettingsManager
      },
      {
        path: '/dashboard',
        component: Dashborard
      }
    ]
  },
  unkownRoute
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
        component: GatewaySelector
      },
      {
        path: '/panel/:gateway',
        component: GatewayControlPanel
      }
    ]
  },
  unkownRoute
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: mode === 'cloud' ? cloudRoutes : gatewayRoutes
})
