import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'sweetalert2/dist/sweetalert2.min.css'
import { cleanLegacyLocalStorageSnapshot } from './utils/backupStorage'

// Immediately purge legacy monolithic snapshot to free up local storage quota
cleanLegacyLocalStorageSnapshot()

createApp(App).use(store).use(router).mount('#app')
