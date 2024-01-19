import Home from "./components/Home.vue"
import DeviceLogs from "./components/DeviceLogs.vue"
import { createRouter, createWebHashHistory } from 'vue-router'

const NotFound = {
  temlate: "<div>Page not found</div>"
}

const routes = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  {
    path: "/",
    component: Home
  },
  {
    path: "/logs",
    component: DeviceLogs
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})