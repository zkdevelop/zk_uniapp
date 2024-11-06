// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import { createPinia } from 'pinia'

Vue.config.productionTip = false

const pinia = createPinia()
Vue.use(pinia)

App.mpType = 'app'

const app = new Vue({
    ...App,
    pinia
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)
  return {
    app,
    pinia
  }
}
// #endif