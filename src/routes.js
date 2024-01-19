import ControlPanel from "./components/ControlPanel.vue"
import DeviceLogs from "./components/device/logs/DeviceLogs.vue"
import { createRouter, createWebHashHistory } from 'vue-router'

const NotFound = {
  temlate: "<div>Page not found</div>"
}

const routes = [
  {
    path: "/",
    redirect: to => {
      return 'panel'
    },
    children: [
      {
        path: "/panel",
        component: ControlPanel
      },
      {
        path: "/logs",
        component: DeviceLogs
      },
    ]
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})