import GatewayControlPanel from './components/GatewayControlPanel.vue'
import DeviceLogs from './components/device/logs/DeviceLogs.vue'
import SettingsManager from './components/device/settings/SettingsManager.vue'
import GatewaySelector from './components/gateway/GatewaySelector.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const mode = import.meta.env.VITE_MODE

const unkownRoute = {
  path: "/:pathMatch(.*)*",
  redirect: '/'
}

const gatewayRoutes = [
  {
    path: '/',
    redirect: () => {
      return '/devices/panel'
    },
    children: [
      {
        path: '/devices/panel',
        component: GatewayControlPanel
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
  },
  unkownRoute
]

const cloudRoutes = [
  {
    path: '/',
    redirect: () => {
      return '/home'
    },
    children: [
      {
        path: '/home',
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
