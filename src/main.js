import { createApp } from 'vue'
import App from './App.vue'
import { router } from './routes'
import { createPinia } from 'pinia'
import { createIntl, createIntlCache } from 'vue-intl'
import { currentLocale, defaultLocale, messages } from './messages'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(createIntl({
  locale: currentLocale,
  defaultLocale,
  messages: messages[currentLocale] ?? messages[defaultLocale]
}, createIntlCache()))
app.mount('#app')