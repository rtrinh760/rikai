import './main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import SignIn from './routes/SignIn.vue'
import { createManager } from '@vue-youtube/core'
import { clerkPlugin } from 'vue-clerk/plugin'
import { createMemoryHistory, createRouter } from 'vue-router'
import 'vite/client'

const routes = [
    { path: '/', component: App },
    { path: '/sign-in', component: SignIn }
]

const app = createApp(App)
app.use(createPinia())
app.use(createManager())
app.use()
app.use(clerkPlugin, {
    publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
})

app.mount('#app')
