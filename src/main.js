import { createApp } from 'vue'
import App from './App.vue'
import { router } from './routes'
import { createPinia } from 'pinia'
import { intlInstance } from './intlConfig'
import { BUILD_INFO } from './buildInfo'

console.debug(
  `UI build info${Object.entries(BUILD_INFO).reduce((acc, [key, value]) => `${acc}\n${key}: ${value}`, '')}`
)

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(intlInstance)
app.mount('#app')
