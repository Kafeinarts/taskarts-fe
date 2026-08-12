import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/contacts",
    name: "contacts",
    component: () => import("../views/ContactsView.vue"),
  },
  {
    path: "/invoice",
    name: "invoice",
    component: () => import("../views/InvoiceView.vue"),
  },
  {
    path: "/mail",
    redirect: "/invoice",
  },
  {
    path: "/todo",
    name: "todo",
    component: () => import("../views/todoList.vue"),
  },
  {
    path: "/tasks",
    redirect: "/todo",
  },
  {
    path: "/tasks/:id",
    name: "task-detail",
    component: () => import("../views/TaskDetailView.vue"),
  },
  {
    path: "/todo/:id",
    redirect: to => `/tasks/${to.params.id}`,
  },
  {
    path: "/project",
    name: "project",
    component: () => import("../views/projectManagement.vue"),
  },
  {
    path: "/finance",
    name: "finance",
    component: () => import("../views/moneyTracker.vue"),
  },
  {
    path: "/rab",
    name: "rab",
    component: () => import("../views/RabView.vue"),
  },
  {
    path: "/videos",
    name: "videos",
    component: () => import("../views/VideoHubView.vue"),
  },
  {
    path: "/games",
    name: "games",
    component: () => import("../views/GamesView.vue"),
  },
  {
    path: "/games/:id",
    name: "game-detail",
    component: () => import("../views/GamesView.vue"),
  },
  {
    path: "/selfie",
    name: "selfie",
    component: () => import("../views/SelfieHappinessView.vue"),
  },
  {
    path: "/cv",
    name: "cv",
    component: () => import("../views/CvBuilderView.vue"),
  },
  {
    path: "/sql",
    name: "sql",
    component: () => import("../views/SqlExportView.vue"),
  },
  {
    path: "/chat-ai",
    name: "chat-ai",
    component: () => import("../views/LiveChatAiView.vue"),
  },
  {
    path: "/code-notes",
    name: "code-notes",
    component: () => import("../views/CodeNotesView.vue"),
  },
  {
    path: "/surat",
    name: "surat",
    component: () => import("../views/SuratBuilderView.vue"),
  },
  {
    path: "/time-suite",
    name: "time-suite",
    component: () => import("../views/TimeSuiteView.vue"),
  },
  {
    path: "/habits",
    redirect: "/",
  },
  {
    path: "/calendar",
    name: "calendar",
    component: () => import("../views/CalendarView.vue"),
  },
  {
    path: "/notes",
    name: "notes",
    component: () => import("../views/StickyNotesView.vue"),
  },
  {
    path: "/notes/:id",
    name: "note-detail",
    component: () => import("../views/NoteDetailView.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("../views/PreferencesView.vue"),
  },
  {
    path: "/preferences",
    name: "preferences",
    component: () => import("../views/PreferencesView.vue"),
  },
  {
    path: "/camera",
    name: "camera",
    component: () => import("../views/CameraScannerView.vue"),
  },
  {
    path: "/scan",
    redirect: "/camera",
  },
  {
    path: "/mood",
    name: "mood",
    component: () => import("../views/MoodAlarmView.vue"),
  },
  {
    path: "/alarm",
    name: "alarm",
    component: () => import("../views/MoodAlarmView.vue"),
  },
  {
    path: "/mood-alarm",
    redirect: "/mood",
  },
  {
    path: "/faq",
    name: "faq",
    component: () => import("../views/FaqAboutView.vue"),
  },
  {
    path: "/developer",
    name: "developer",
    component: () => import("../views/DeveloperPortfolioView.vue"),
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
    component: () => import("../views/FaqAboutView.vue"),
  },
  {
    path: "/quick-capture",
    name: "quick-capture",
    component: () => import("../views/QuickCaptureView.vue"),
  },
  {
    path: "/productivity-insights",
    name: "productivity-insights",
    component: () => import("../views/ProductivityInsightsView.vue"),
  },
  {
    path: "/insights",
    redirect: "/productivity-insights",
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
