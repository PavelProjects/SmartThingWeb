import { createApp } from 'vue'
import App from './App.vue'
import { router } from './routes'
import { createPinia } from 'pinia'
import { intlInstance } from './intlConfig'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(intlInstance)
app.mount('#app')
