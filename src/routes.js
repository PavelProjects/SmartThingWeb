import GatewayControlPanel from './components/GatewayControlPanel.vue'
import DeviceLogs from './components/logs/DeviceLogs.vue'
import SettingsManager from './components/settings/SettingsManager.vue'
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
      return '/gateways'
    },
    children: [
      {
        path: '/gateways',
        component: GatewaySelector
      },
      {
        path: '/:gateway/panel',
        component: GatewayControlPanel
      },
      {
        path: '/:gateway/dashboard',
        component: Dashborard
      },
      {
        path: '/:gateway/logs',
        component: DeviceLogs
      },
      {
        path: '/:gateway/settings',
        component: SettingsManager
      }
    ]
  },
  unkownRoute
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: mode === 'cloud' ? cloudRoutes : gatewayRoutes
})
