import GatewayControlPanel from './components/GatewayControlPanel.vue'
import DeviceLogs from './components/logs/DeviceLogs.vue'
import SettingsManager from './components/settings/SettingsManager.vue'
import GatewaySelector from './components/gateway/GatewaySelector.vue'
import Dashborard from './components/dashboard/Dashboard.vue'
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
          component: SettingsManager
        },
        {
          name: 'dashboard',
          path: '/dashboard',
          component: Dashborard
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
          component: Dashborard
        },
        {
          name: 'logs',
          path: '/:gateway/logs',
          component: DeviceLogs
        },
        {
          name: 'settings',
          path: '/:gateway/settings',
          component: SettingsManager
        },
        unkownRoute
      ]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})
