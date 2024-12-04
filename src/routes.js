import GatewayControlPanel from './components/gateway/GatewayControlPanel.vue'
import DeviceLogs from './components/logs/DeviceLogs.vue'
import SettingsDumpsManager from './components/settings/SettingsDumpsManager.vue'
import GatewaySelector from './components/gateway/GatewaySelector.vue'
import DevicesDashboard from './components/dashboard/DevicesDashboard.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import OtaUpdates from './components/ota/OtaUpdates.vue'

const mode = import.meta.env.VITE_MODE

const unkownRoute = {
  path: '/:pathMatch(.*)*',
  redirect: '/'
}

const routes =
  mode === 'gateway'
    ? [
        {
          path: '/',
          redirect: () => {
            return '/panel'
          }
        },
        {
          name: 'panel',
          path: '/panel',
          component: GatewayControlPanel
        },
        {
          name: 'logs',
          path: '/logs',
          component: DeviceLogs
        },
        {
          name: 'settings',
          path: '/settings',
          component: SettingsDumpsManager
        },
        {
          name: 'dashboard',
          path: '/dashboard',
          component: DevicesDashboard
        },
        {
          name: 'ota',
          path: '/ota',
          component: OtaUpdates
        },
        unkownRoute
      ]
    : [
        {
          path: '/',
          redirect: () => {
            return '/gateways'
          }
        },
        {
          name: 'gateway-selector',
          path: '/gateways',
          component: GatewaySelector
        },
        {
          name: 'panel',
          path: '/:gateway/panel',
          component: GatewayControlPanel
        },
        {
          name: 'dashboard',
          path: '/:gateway/dashboard',
          component: DevicesDashboard
        },
        {
          name: 'logs',
          path: '/:gateway/logs',
          component: DeviceLogs
        },
        {
          name: 'settings',
          path: '/:gateway/settings',
          component: SettingsDumpsManager
        },
        unkownRoute
      ]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})
