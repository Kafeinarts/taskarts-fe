import { createApp } from 'vue'
import {
  Quasar,
  Notify,
  Dialog,
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
  QBtnGroup,
  QBtnToggle,
  QInput,
  QSelect,
  QCheckbox,
  QRadio,
  QToggle,
  QTabs,
  QTab,
  QRouteTab,
  QTabPanels,
  QTabPanel,
  QBadge,
  QChip,
  QLinearProgress,
  QCircularProgress,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QDialog,
  QIcon,
  QSeparator,
  QSpace,
  QTooltip,
  QMenu,
  QBanner,
  QSpinner,
  QAvatar,
  QHeader,
  QToolbar,
  QToolbarTitle,
  QPage,
  QPageContainer,
  QLayout
} from 'quasar'
import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import 'sweetalert2/dist/sweetalert2.min.css'
import { cleanLegacyLocalStorageSnapshot } from './utils/backupStorage'

// Immediately purge legacy monolithic snapshot to free up local storage quota
cleanLegacyLocalStorageSnapshot()

createApp(App)
  .use(store)
  .use(router)
  .use(Quasar, {
    plugins: {
      Notify,
      Dialog
    },
    components: {
      QCard,
      QCardSection,
      QCardActions,
      QBtn,
      QBtnGroup,
      QBtnToggle,
      QInput,
      QSelect,
      QCheckbox,
      QRadio,
      QToggle,
      QTabs,
      QTab,
      QRouteTab,
      QTabPanels,
      QTabPanel,
      QBadge,
      QChip,
      QLinearProgress,
      QCircularProgress,
      QList,
      QItem,
      QItemSection,
      QItemLabel,
      QDialog,
      QIcon,
      QSeparator,
      QSpace,
      QTooltip,
      QMenu,
      QBanner,
      QSpinner,
      QAvatar,
      QHeader,
      QToolbar,
      QToolbarTitle,
      QPage,
      QPageContainer,
      QLayout
    },
    config: {
      brand: {
        primary: '#2563eb',
        secondary: '#0284c7',
        accent: '#9333ea',
        dark: '#1e293b',
        positive: '#10b981',
        negative: '#ef4444',
        info: '#06b6d4',
        warning: '#f59e0b'
      }
    }
  })
  .mount('#app')

