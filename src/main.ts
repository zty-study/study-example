import App from './App.vue'
import router from './router'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import directives from '@/directives/index'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import '@icon-park/vue-next/styles/index.css'

const pinia = createPinia()
pinia.use(createPersistedState())

createApp(App).use(pinia).use(router).use(directives).mount('#app')
