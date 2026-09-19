import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/workspace/HomeView.vue";
import store from "../store";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/auth/AuthView.vue"),
    meta: { guest: true },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/auth/AuthView.vue"),
    meta: { guest: true },
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/contacts",
    name: "contacts",
    component: () => import("../views/contacts/ContactsView.vue"),
  },
  {
    path: "/invoice",
    name: "invoice",
    component: () => import("../views/finance/InvoiceView.vue"),
  },
  {
    path: "/mail",
    redirect: "/invoice",
  },
  {
    path: "/todo",
    name: "todo",
    component: () => import("../views/workspace/todoList.vue"),
  },
  {
    path: "/tasks",
    redirect: "/todo",
  },
  {
    path: "/tasks/:id",
    name: "task-detail",
    component: () => import("../views/workspace/TaskDetailView.vue"),
  },
  {
    path: "/todo/:id",
    redirect: to => `/tasks/${to.params.id}`,
  },
  {
    path: "/project",
    name: "project",
    component: () => import("../views/workspace/projectManagement.vue"),
  },
  {
    path: "/finance",
    name: "finance",
    component: () => import("../views/finance/moneyTracker.vue"),
  },
  {
    path: "/rab",
    name: "rab",
    component: () => import("../views/finance/RabView.vue"),
  },
  {
    path: "/videos",
    name: "videos",
    component: () => import("../views/media/VideoHubView.vue"),
  },
  {
    path: "/videos/:id",
    name: "video-detail",
    component: () => import("../views/media/VideoDetailView.vue"),
  },
  {
    path: "/custom-bingkai",
    name: "custom-bingkai",
    component: () => import("../views/media/MotivationFrameSettingsView.vue"),
  },
  {
    path: "/frame-custom",
    redirect: "/custom-bingkai",
  },
  {
    path: "/motivation-frame/custom",
    redirect: "/custom-bingkai",
  },
  {
    path: "/motivation-frame/settings",
    redirect: "/custom-bingkai",
  },
  {
    path: "/games",
    name: "games",
    component: () => import("../views/media/GamesView.vue"),
  },
  {
    path: "/games/:id",
    name: "game-detail",
    component: () => import("../views/media/GamesView.vue"),
  },
  {
    path: "/selfie",
    name: "selfie",
    component: () => import("../views/media/SelfieHappinessView.vue"),
  },
  {
    path: "/cv",
    name: "cv",
    component: () => import("../views/notes/CvBuilderView.vue"),
  },
  {
    path: "/sql",
    name: "sql",
    component: () => import("../views/system/SqlExportView.vue"),
  },
  {
    path: "/chat-ai",
    name: "chat-ai",
    component: () => import("../views/ai/LiveChatAiView.vue"),
  },
  {
    path: "/code-notes",
    name: "code-notes",
    component: () => import("../views/notes/CodeNotesView.vue"),
  },
  {
    path: "/code-notes/:id",
    name: "code-note-detail",
    component: () => import("../views/notes/CodeNoteDetailView.vue"),
  },
  {
    path: "/code-snippets/:id",
    redirect: to => `/code-notes/${to.params.id}`,
  },
  {
    path: "/code-snippet/:id",
    redirect: to => `/code-notes/${to.params.id}`,
  },
  {
    path: "/surat",
    name: "surat",
    component: () => import("../views/notes/SuratBuilderView.vue"),
  },
  {
    path: "/time-suite",
    name: "time-suite",
    component: () => import("../views/productivity/TimeSuiteView.vue"),
  },
  {
    path: "/habits",
    redirect: "/",
  },
  {
    path: "/calendar",
    name: "calendar",
    component: () => import("../views/workspace/CalendarView.vue"),
  },
  {
    path: "/notes",
    name: "notes",
    component: () => import("../views/notes/StickyNotesView.vue"),
  },
  {
    path: "/notes/:id",
    name: "note-detail",
    component: () => import("../views/notes/NoteDetailView.vue"),
  },
  {
    path: "/diary",
    name: "diary",
    component: () => import("../views/notes/DiaryView.vue"),
  },
  {
    path: "/diary/:id",
    name: "diary-detail",
    component: () => import("../views/notes/DiaryDetailView.vue"),
  },
  {
    path: "/jurnal",
    redirect: "/diary",
  },
  {
    path: "/storage",
    name: "storage",
    component: () => import("../views/system/StorageView.vue"),
  },
  {
    path: "/storage/view/:key",
    name: "storage-key-detail",
    component: () => import("../views/system/StorageKeyDetailView.vue"),
  },
  {
    path: "/storage/json-viewer",
    redirect: to => `/storage/view/${encodeURIComponent(to.query.key || '')}`,
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("../views/system/PreferencesView.vue"),
  },
  {
    path: "/preferences",
    name: "preferences",
    component: () => import("../views/system/PreferencesView.vue"),
  },
  {
    path: "/camera",
    name: "camera",
    component: () => import("../views/media/CameraScannerView.vue"),
  },
  {
    path: "/scan",
    redirect: "/camera",
  },
  {
    path: "/mood",
    name: "mood",
    component: () => import("../views/productivity/MoodAlarmView.vue"),
  },
  {
    path: "/alarm",
    name: "alarm",
    component: () => import("../views/productivity/MoodAlarmView.vue"),
  },
  {
    path: "/mood-alarm",
    redirect: "/mood",
  },
  {
    path: "/faq",
    name: "faq",
    component: () => import("../views/about/FaqAboutView.vue"),
  },
  {
    path: "/developer",
    name: "developer",
    component: () => import("../views/system/DeveloperPortfolioView.vue"),
  },
  {
    path: "/portfolio",
    redirect: "/developer",
  },
  {
    path: "/chat",
    redirect: "/faq",
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/about/FaqAboutView.vue"),
  },
  {
    path: "/quick-capture",
    name: "quick-capture",
    component: () => import("../views/workspace/QuickCaptureView.vue"),
  },
  {
    path: "/productivity-insights",
    name: "productivity-insights",
    component: () => import("../views/productivity/ProductivityInsightsView.vue"),
  },
  {
    path: "/insights",
    redirect: "/productivity-insights",
  },
  {
    path: "/job-tracker",
    name: "job-tracker",
    component: () => import("../views/workspace/JobTrackerView.vue"),
  },
  {
    path: "/jobs",
    redirect: "/job-tracker",
  },
  {
    path: "/lamaran",
    redirect: "/job-tracker",
  },
  {
    path: "/lamaran-kerja",
    redirect: "/job-tracker",
  },
  {
    path: "/medium-draft",
    name: "medium-draft",
    component: () => import("../views/notes/MediumDraftView.vue"),
  },
  {
    path: "/medium",
    redirect: "/medium-draft",
  },
  {
    path: "/drafts",
    redirect: "/medium-draft",
  },
  // Finance System Modules
  {
    path: "/finance-cashflow",
    name: "finance-cashflow",
    component: () => import("../views/finance/CashFlowManagementView.vue"),
  },
  {
    path: "/finance-ap-ar",
    name: "finance-ap-ar",
    component: () => import("../views/finance/AccountsPayableReceivableView.vue"),
  },
  {
    path: "/finance-expenses",
    name: "finance-expenses",
    component: () => import("../views/finance/ExpenseReimbursementView.vue"),
  },
  {
    path: "/finance-budgeting",
    name: "finance-budgeting",
    component: () => import("../views/finance/BudgetingForecastingView.vue"),
  },
  {
    path: "/finance-reports",
    name: "finance-reports",
    component: () => import("../views/finance/FinancialReportsView.vue"),
  },
  {
    path: "/finance-security",
    name: "finance-security",
    component: () => import("../views/finance/FinanceSecurityAuditView.vue"),
  },
  {
    path: "/team-collaboration",
    name: "team-collaboration",
    component: () => import("../views/contacts/TeamCollaborationView.vue"),
  },
  {
    path: "/team-bulletin",
    name: "team-bulletin",
    component: () => import("../views/contacts/TeamCollaborationView.vue"),
  },
  {
    path: "/team-channels",
    name: "team-channels",
    component: () => import("../views/contacts/TeamCollaborationView.vue"),
  },
  {
    path: "/team-assets",
    name: "team-assets",
    component: () => import("../views/contacts/TeamCollaborationView.vue"),
  },
  {
    path: "/team-ticketing",
    name: "team-ticketing",
    component: () => import("../views/contacts/TeamCollaborationView.vue"),
  },
  {
    path: "/team-requests",
    redirect: "/team-ticketing",
  },
  {
    path: "/team-calendar",
    name: "team-calendar",
    component: () => import("../views/contacts/TeamCollaborationView.vue"),
  },
  {
    path: "/team-expertise",
    name: "team-expertise",
    component: () => import("../views/contacts/TeamCollaborationView.vue"),
  },
  {
    path: "/team-directory",
    redirect: "/team-expertise",
  },
  {
    path: "/features",
    name: "features",
    component: () => import("../views/system/FeatureSettingsView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/register-user",
    name: "register-user",
    component: () => import("../views/system/RegisterUserView.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// Navigation guard: redirect to /login if not authenticated + log transitions
router.beforeEach((to, from, next) => {
  const token = store.state.auth.token;
  console.log(
    `%c[Router] ${from.path || '(initial)'} → ${to.path}`,
    'color: #f59e0b; font-weight: bold;',
    token ? '(authed)' : '(guest)',
    to.meta.requiresAuth ? '[requires auth]' : '',
  );

  if (to.meta.requiresAuth && !token) {
    console.warn('[Router] → Redirecting to /login (no token)');
    next('/login');
  } else if (to.meta.guest && token) {
    console.log('[Router] → Redirecting to / (already logged in)');
    next('/');
  } else {
    next();
  }
});

router.onError((error) => {
  const isChunkLoadFailed =
    error.name === 'ChunkLoadError' ||
    error.name === 'SyntaxError' ||
    (error.message && (
      error.message.includes('Loading chunk') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('Unexpected token') ||
      error.message.includes('dynamically imported module')
    ));

  if (isChunkLoadFailed) {
    const lastReload = sessionStorage.getItem('last_chunk_reload');
    const now = Date.now();
    if (!lastReload || now - parseInt(lastReload, 10) > 8000) {
      sessionStorage.setItem('last_chunk_reload', now.toString());
      window.location.reload();
    }
  }
});

export default router;
