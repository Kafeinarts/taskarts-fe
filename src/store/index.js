import { createStore } from 'vuex';

// Default empty datasets as requested: "buat semuanya dari raw dan kosong tanpa ada data apa apa"
const DEFAULT_CONTACTS = [];
const DEFAULT_PROJECTS = [];
const DEFAULT_TASKS = [];
const DEFAULT_TRANSACTIONS = [];
const DEFAULT_INVOICES = [];
const DEFAULT_HABITS = [];
const DEFAULT_NOTES = [];
const DEFAULT_EVENTS = [];

// Sample data generator for users who click "Load Sample Data"
const SAMPLE_CONTACTS = [
  {
    id: 'c1',
    name: 'Budi Santoso',
    company: 'PT Teknologi Nusantara',
    email: 'budi@teknus.co.id',
    phone: '081234567890',
    address: 'Jl. Jend. Sudirman No. 45, Jakarta Selatan',
    category: 'Corporate Client',
    status: 'Active',
    notes: 'Klien lama, pembayaran selalu tepat waktu.',
    createdDate: '2026-01-15'
  },
  {
    id: 'c2',
    name: 'Rian Prasetyo',
    company: 'RajinKerja Core Team',
    email: 'rian.dev@rajinkerja.id',
    phone: '081398765432',
    address: 'BSD City, Tangerang Selatan',
    category: 'Tim Internal',
    status: 'Active',
    notes: 'Lead Developer & System Architect.',
    createdDate: '2026-01-20'
  },
  {
    id: 'c3',
    name: 'Dinda Kirana',
    company: 'RajinKerja Core Team',
    email: 'dinda.design@rajinkerja.id',
    phone: '085712345678',
    address: 'Kebayoran Baru, Jakarta Selatan',
    category: 'Tim Internal',
    status: 'VIP',
    notes: 'Senior UI/UX Designer & Product Illustrator.',
    createdDate: '2026-02-01'
  },
  {
    id: 'c4',
    name: 'Sarah Jenkins',
    company: 'Global Tech Solutions',
    email: 'sarah.j@globaltech.com',
    phone: '081987654321',
    address: '500 Howard St, San Francisco, CA 94105',
    category: 'International',
    status: 'VIP',
    notes: 'Proyek frontend Vue 3. Pembayaran USD via Wise.',
    createdDate: '2026-02-10'
  }
];

const SAMPLE_PROJECTS = [
  {
    id: 'p1',
    clientName: 'PT Teknologi Nusantara',
    clientEmail: 'budi@teknus.co.id',
    clientPhone: '0812-3456-7890',
    projectTitle: 'Redesign E-Commerce Mobile App UI/UX',
    deadline: '2026-08-20',
    rate: 15000000,
    status: 'In Progress',
    description: 'Mengubah tampilan dashboard & checkout e-commerce.',
    progress: 65
  },
  {
    id: 'p2',
    clientName: 'Global Tech Solutions',
    clientEmail: 'sarah.j@globaltech.com',
    clientPhone: '+1 (415) 892-0123',
    projectTitle: 'Vue 3 Dashboard Widget Components',
    deadline: '2026-08-30',
    rate: 18000000,
    status: 'In Progress',
    description: 'Modul statistik & charting reusable component library.',
    progress: 40
  }
];

const SAMPLE_TASKS = [
  {
    id: 't1',
    name: 'Selesaikan Wireframe Checkout Flow',
    level: 'Penting',
    category: 'Work',
    projectTag: 'E-Commerce Mobile App',
    deadline: '2026-07-30',
    done: true,
    statusColumn: 'done',
    recurring: 'none',
    eisenhower: 'do_first',
    notes: 'Disetujui oleh Pak Budi.'
  },
  {
    id: 't2',
    name: 'Integrasi Store & LocalStorage Persistence',
    level: 'Penting',
    category: 'Urgent',
    projectTag: 'Vue 3 Components',
    deadline: '2026-08-02',
    done: false,
    statusColumn: 'in_progress',
    recurring: 'weekly',
    eisenhower: 'do_first',
    notes: 'Pastikan state tersimpan secara otomatis.'
  },
  {
    id: 't3',
    name: 'Kirim Invoice Down Payment',
    level: 'Menengah',
    category: 'Client',
    projectTag: 'Vue 3 Components',
    deadline: '2026-08-05',
    done: false,
    statusColumn: 'todo',
    recurring: 'none',
    eisenhower: 'schedule',
    notes: 'Nominal DP 50% = Rp 9.000.000.'
  }
];

const SAMPLE_TRANSACTIONS = [
  {
    id: 'tr1',
    item: 'Down Payment Proyek Redesign E-Commerce',
    amount: 7500000,
    type: 'income',
    date: '2026-07-10',
    category: 'Web Development',
    method: 'Bank Transfer',
    track: 'PT Teknologi Nusantara'
  },
  {
    id: 'tr2',
    item: 'Langganan Software Design & Servers',
    amount: 2200000,
    type: 'expense',
    date: '2026-07-12',
    category: 'Software Subscription',
    method: 'Credit Card',
    track: 'Operational Tools'
  }
];

const SAMPLE_HABITS = [
  { id: 'h1', name: 'Coding / Deep Work 2 Jam', category: 'Productivity', history: { '2026-07-26': true, '2026-07-27': true } },
  { id: 'h2', name: 'Prospek & Outreach Klien Baru', category: 'Business', history: { '2026-07-27': true } },
  { id: 'h3', name: 'Olahraga & Stretching 30 Mnt', category: 'Health', history: {} }
];

const DEFAULT_WORK_ALARMS = [
  { id: 'al_1', time: '08:00', label: 'Jam Mulai Kerja & Cek Kanban', active: true, sound: 'beep', repeat: 'Senin - Jumat' },
  { id: 'al_2', time: '12:00', label: 'Istirahat Siang & Makan', active: true, sound: 'chime', repeat: 'Setiap Hari' },
  { id: 'al_3', time: '13:00', label: 'Selesai Istirahat & Sesi Siang', active: true, sound: 'beep', repeat: 'Senin - Jumat' },
  { id: 'al_4', time: '17:00', label: 'Jam Selesai Kerja & Evaluasi', active: true, sound: 'siren', repeat: 'Senin - Jumat' }
];

function loadLocal(key, defaultData) {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultData;
  } catch (e) {
    return defaultData;
  }
}

function saveLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

export default createStore({
  state() {
    return {
      contacts: loadLocal('ft_contacts', DEFAULT_CONTACTS),
      projects: loadLocal('ft_projects', DEFAULT_PROJECTS),
      tasks: loadLocal('ft_tasks', DEFAULT_TASKS),
      transactions: loadLocal('ft_transactions', DEFAULT_TRANSACTIONS),
      invoices: loadLocal('ft_invoices', DEFAULT_INVOICES),
      habits: loadLocal('ft_habits', DEFAULT_HABITS),
      notes: loadLocal('ft_notes', DEFAULT_NOTES),
      events: loadLocal('ft_events', DEFAULT_EVENTS),
      moodLogs: loadLocal('ft_moodLogs', []),
      workAlarms: loadLocal('ft_workAlarms', DEFAULT_WORK_ALARMS),
      geminiApiKey: loadLocal('ft_geminiApiKey', ''),
      aiProvider: loadLocal('ft_aiProvider', 'gemini'),
      aiModel: loadLocal('ft_aiModel', 'gemini-1.5-flash'),
      themeMode: 'light', // Light mode default
      accentColor: loadLocal('ft_accentColor', '#2563eb'), // default Material blue
      budgetThreshold: loadLocal('ft_budgetThreshold', 5000000), // Default budget threshold: Rp 5.000.000
      welcomeBanner: loadLocal('ft_welcomeBanner', {
        title: 'Selamat Datang, Rekan Kerja!',
        subtitle: 'Pusat kendali produktivitas & organizer karir karyawan Anda: kelola tugas (5 view modes), proyek kantor, arus kas, dan invoice.'
      }),
      myBusiness: loadLocal('ft_myBusiness', {
        name: '',
        tagline: '',
        owner: '',
        email: '',
        phone: '',
        bankName: '',
        accountNumber: '',
        accountHolder: ''
      }),
      userProfile: loadLocal('ft_userProfile', {
        name: 'Arip Developer',
        jobTitle: 'Full-Stack Developer & Tech Lead',
        company: 'RajinKerja Studio',
        bio: 'Productive developer creating high-performance web solutions & productivity tools.',
        email: 'aripstrike@gmail.com',
        phone: '081234567890',
        avatar: ''
      }),
      cvData: loadLocal('ft_cvData', {
        fullName: 'Budi Pratama',
        jobTitle: 'Senior Frontend Engineer',
        email: 'budi.pratama@email.com',
        phone: '081234567890',
        address: 'Jakarta, Indonesia',
        linkedin: 'linkedin.com/in/budipratama',
        github: 'github.com/budipratama',
        website: 'budipratama.dev',
        summary: 'Experienced Senior Frontend Engineer with 5+ years of building scalable web applications using Vue 3, React, and Modern Web Standards.',
        experience: [
          {
            company: 'PT Tech Inovasi',
            position: 'Senior Frontend Developer',
            period: '2022 - Sekarang',
            location: 'Jakarta',
            description: 'Memimpin tim frontend dalam pengembangan PWA web app dengan Vue 3 & TypeScript, meningkatkan conversion rate 35%.'
          }
        ],
        education: [
          {
            institution: 'Universitas Indonesia',
            degree: 'S1 Teknik Informatika',
            period: '2017 - 2021',
            gpa: '3.82'
          }
        ],
        skills: ['Vue.js 3', 'TypeScript', 'Tailwind CSS', 'Node.js', 'REST API', 'Git', 'PWA', 'Jest'],
        languages: ['Bahasa Indonesia (Native)', 'English (Professional)'],
        certifications: ['Google Certified Associate Cloud Engineer', 'Meta Front-End Developer Specialization'],
        selectedTemplate: 'ats_clean_1'
      }),
      codeNotes: loadLocal('ft_codeNotes', []),
      suratList: loadLocal('ft_suratList', []),
      selfieGallery: loadLocal('ft_selfieGallery', [])
    };
  },
  getters: {
    getContacts: (state) => state.contacts,
    getProjects: (state) => state.projects,
    getTasks: (state) => state.tasks,
    getTransactions: (state) => state.transactions,
    getInvoices: (state) => state.invoices,
    getHabits: (state) => state.habits,
    getNotes: (state) => state.notes,
    getEvents: (state) => state.events,
    getMoodLogs: (state) => state.moodLogs,
    getWorkAlarms: (state) => state.workAlarms,
    getGeminiApiKey: (state) => state.geminiApiKey,
    getAiProvider: (state) => state.aiProvider,
    getAiModel: (state) => state.aiModel,
    getThemeMode: (state) => state.themeMode,
    getAccentColor: (state) => state.accentColor,
    getBudgetThreshold: (state) => state.budgetThreshold,
    getMyBusiness: (state) => state.myBusiness,
    getWelcomeBanner: (state) => state.welcomeBanner || { title: 'Selamat Datang, Rekan Kerja!', subtitle: 'Pusat kendali produktivitas & organizer karir karyawan Anda: kelola tugas (5 view modes), proyek kantor, arus kas, dan invoice.' },
    getUserProfile: (state) => state.userProfile,
    getCvData: (state) => state.cvData,
    getCodeNotes: (state) => state.codeNotes,
    getSuratList: (state) => state.suratList,
    getSelfieGallery: (state) => state.selfieGallery,

    // Statistics
    totalClientsCount: (state) => state.contacts.length,
    activeProjectsCount: (state) => state.projects.filter(p => p.status === 'In Progress').length,
    completedTasksCount: (state) => state.tasks.filter(t => t.done || t.statusColumn === 'done').length,
    totalTasksCount: (state) => state.tasks.length,
    pendingTasksCount: (state) => state.tasks.filter(t => !t.done && t.statusColumn !== 'done').length,

    totalIncome: (state) => {
      return state.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    },
    totalExpense: (state) => {
      return state.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    },
    netProfit: (state, getters) => {
      return getters.totalIncome - getters.totalExpense;
    },
    isBudgetExceeded: (state, getters) => {
      return getters.totalExpense > state.budgetThreshold;
    }
  },
  mutations: {
    // Theme & Preferences
    SET_THEME_MODE(state, mode) {
      state.themeMode = mode;
      saveLocal('ft_themeMode', state.themeMode);
    },
    SET_ACCENT_COLOR(state, color) {
      state.accentColor = color;
      saveLocal('ft_accentColor', state.accentColor);
    },

    // Contacts
    ADD_CONTACT(state, contact) {
      state.contacts.unshift(contact);
      saveLocal('ft_contacts', state.contacts);
    },
    ADD_CONTACTS_BULK(state, list) {
      state.contacts.unshift(...list);
      saveLocal('ft_contacts', state.contacts);
    },
    UPDATE_CONTACT(state, updatedContact) {
      const index = state.contacts.findIndex(c => c.id === updatedContact.id);
      if (index !== -1) {
        state.contacts.splice(index, 1, updatedContact);
        saveLocal('ft_contacts', state.contacts);
      }
    },
    DELETE_CONTACT(state, id) {
      state.contacts = state.contacts.filter(c => c.id !== id);
      saveLocal('ft_contacts', state.contacts);
    },
    DELETE_CONTACTS_BULK(state, ids) {
      state.contacts = state.contacts.filter(c => !ids.includes(c.id));
      saveLocal('ft_contacts', state.contacts);
    },

    // Projects
    ADD_PROJECT(state, project) {
      state.projects.unshift(project);
      saveLocal('ft_projects', state.projects);
    },
    ADD_PROJECTS_BULK(state, list) {
      state.projects.unshift(...list);
      saveLocal('ft_projects', state.projects);
    },
    UPDATE_PROJECT(state, updatedProject) {
      const index = state.projects.findIndex(p => p.id === updatedProject.id);
      if (index !== -1) {
        state.projects.splice(index, 1, updatedProject);
        saveLocal('ft_projects', state.projects);
      }
    },
    DELETE_PROJECT(state, id) {
      state.projects = state.projects.filter(p => p.id !== id);
      saveLocal('ft_projects', state.projects);
    },
    DELETE_PROJECTS_BULK(state, ids) {
      state.projects = state.projects.filter(p => !ids.includes(p.id));
      saveLocal('ft_projects', state.projects);
    },

    // Tasks
    ADD_TASK(state, task) {
      state.tasks.unshift(task);
      saveLocal('ft_tasks', state.tasks);
    },
    ADD_TASKS_BULK(state, list) {
      state.tasks.unshift(...list);
      saveLocal('ft_tasks', state.tasks);
    },
    UPDATE_TASK(state, updatedTask) {
      const index = state.tasks.findIndex(t => t.id === updatedTask.id);
      if (index !== -1) {
        state.tasks.splice(index, 1, updatedTask);
        saveLocal('ft_tasks', state.tasks);
      }
    },
    TOGGLE_TASK(state, id) {
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        task.done = !task.done;
        if (task.done) {
          task.statusColumn = 'done';
        } else {
          task.statusColumn = 'todo';
        }
        saveLocal('ft_tasks', state.tasks);
      }
    },
    UPDATE_TASK_STATUS(state, { id, statusColumn }) {
      const task = state.tasks.find(t => t.id === id);
      if (task) {
        task.statusColumn = statusColumn;
        task.done = (statusColumn === 'done');
        saveLocal('ft_tasks', state.tasks);
      }
    },
    DELETE_TASK(state, id) {
      state.tasks = state.tasks.filter(t => t.id !== id);
      saveLocal('ft_tasks', state.tasks);
    },
    DELETE_TASKS_BULK(state, ids) {
      state.tasks = state.tasks.filter(t => !ids.includes(t.id));
      saveLocal('ft_tasks', state.tasks);
    },

    // Transactions
    ADD_TRANSACTION(state, transaction) {
      state.transactions.unshift(transaction);
      saveLocal('ft_transactions', state.transactions);
    },
    ADD_TRANSACTIONS_BULK(state, list) {
      state.transactions.unshift(...list);
      saveLocal('ft_transactions', state.transactions);
    },
    UPDATE_TRANSACTION(state, updatedTx) {
      const index = state.transactions.findIndex(t => t.id === updatedTx.id);
      if (index !== -1) {
        state.transactions.splice(index, 1, updatedTx);
        saveLocal('ft_transactions', state.transactions);
      }
    },
    DELETE_TRANSACTION(state, id) {
      state.transactions = state.transactions.filter(t => t.id !== id);
      saveLocal('ft_transactions', state.transactions);
    },
    DELETE_TRANSACTIONS_BULK(state, ids) {
      state.transactions = state.transactions.filter(t => !ids.includes(t.id));
      saveLocal('ft_transactions', state.transactions);
    },

    // Invoices
    ADD_INVOICE(state, invoice) {
      state.invoices.unshift(invoice);
      saveLocal('ft_invoices', state.invoices);
    },
    UPDATE_INVOICE(state, updatedInv) {
      const index = state.invoices.findIndex(i => i.id === updatedInv.id);
      if (index !== -1) {
        state.invoices.splice(index, 1, updatedInv);
        saveLocal('ft_invoices', state.invoices);
      }
    },
    DELETE_INVOICE(state, id) {
      state.invoices = state.invoices.filter(i => i.id !== id);
      saveLocal('ft_invoices', state.invoices);
    },
    DELETE_INVOICES_BULK(state, ids) {
      state.invoices = state.invoices.filter(i => !ids.includes(i.id));
      saveLocal('ft_invoices', state.invoices);
    },

    // Habits
    ADD_HABIT(state, habit) {
      state.habits.unshift(habit);
      saveLocal('ft_habits', state.habits);
    },
    UPDATE_HABIT(state, updatedHabit) {
      const index = state.habits.findIndex(h => h.id === updatedHabit.id);
      if (index !== -1) {
        state.habits.splice(index, 1, updatedHabit);
        saveLocal('ft_habits', state.habits);
      }
    },
    TOGGLE_HABIT_DATE(state, { id, dateStr }) {
      const habit = state.habits.find(h => h.id === id);
      if (habit) {
        if (!habit.history) habit.history = {};
        habit.history[dateStr] = !habit.history[dateStr];
        saveLocal('ft_habits', state.habits);
      }
    },
    DELETE_HABIT(state, id) {
      state.habits = state.habits.filter(h => h.id !== id);
      saveLocal('ft_habits', state.habits);
    },

    // Notes
    ADD_NOTE(state, note) {
      state.notes.unshift(note);
      saveLocal('ft_notes', state.notes);
    },
    ADD_NOTES_BULK(state, notesArray) {
      state.notes = [...notesArray, ...state.notes];
      saveLocal('ft_notes', state.notes);
    },
    UPDATE_NOTE(state, updatedNote) {
      const index = state.notes.findIndex(n => n.id === updatedNote.id);
      if (index !== -1) {
        state.notes.splice(index, 1, updatedNote);
        saveLocal('ft_notes', state.notes);
      }
    },
    DELETE_NOTE(state, id) {
      state.notes = state.notes.filter(n => n.id !== id);
      saveLocal('ft_notes', state.notes);
    },
    DELETE_NOTES_BULK(state, ids) {
      state.notes = state.notes.filter(n => !ids.includes(n.id));
      saveLocal('ft_notes', state.notes);
    },

    // Calendar Events
    ADD_EVENT(state, eventItem) {
      state.events.unshift(eventItem);
      saveLocal('ft_events', state.events);
    },
    UPDATE_EVENT(state, updatedEv) {
      const index = state.events.findIndex(e => e.id === updatedEv.id);
      if (index !== -1) {
        state.events.splice(index, 1, updatedEv);
        saveLocal('ft_events', state.events);
      }
    },
    DELETE_EVENT(state, id) {
      state.events = state.events.filter(e => e.id !== id);
      saveLocal('ft_events', state.events);
    },

    // Settings & Budget
    SET_BUDGET_THRESHOLD(state, amount) {
      state.budgetThreshold = Number(amount) || 0;
      saveLocal('ft_budgetThreshold', state.budgetThreshold);
    },

    // Mood Tracker & Alarms
    ADD_MOOD_LOG(state, log) {
      state.moodLogs.unshift(log);
      saveLocal('ft_moodLogs', state.moodLogs);
    },
    DELETE_MOOD_LOG(state, id) {
      state.moodLogs = state.moodLogs.filter(m => m.id !== id);
      saveLocal('ft_moodLogs', state.moodLogs);
    },
    CLEAR_MOOD_LOGS(state) {
      state.moodLogs = [];
      saveLocal('ft_moodLogs', []);
    },

    ADD_WORK_ALARM(state, alarm) {
      state.workAlarms.push(alarm);
      saveLocal('ft_workAlarms', state.workAlarms);
    },
    UPDATE_WORK_ALARM(state, updated) {
      const idx = state.workAlarms.findIndex(a => a.id === updated.id);
      if (idx !== -1) {
        state.workAlarms[idx] = { ...updated };
        saveLocal('ft_workAlarms', state.workAlarms);
      }
    },
    TOGGLE_WORK_ALARM(state, id) {
      const alarm = state.workAlarms.find(a => a.id === id);
      if (alarm) {
        alarm.active = !alarm.active;
        saveLocal('ft_workAlarms', state.workAlarms);
      }
    },
    DELETE_WORK_ALARM(state, id) {
      state.workAlarms = state.workAlarms.filter(a => a.id !== id);
      saveLocal('ft_workAlarms', state.workAlarms);
    },

    // AI Configuration
    UPDATE_AI_CONFIG(state, payload) {
      if (payload.geminiApiKey !== undefined) {
        state.geminiApiKey = payload.geminiApiKey;
        saveLocal('ft_geminiApiKey', state.geminiApiKey);
      }
      if (payload.aiProvider !== undefined) {
        state.aiProvider = payload.aiProvider;
        saveLocal('ft_aiProvider', state.aiProvider);
      }
      if (payload.aiModel !== undefined) {
        state.aiModel = payload.aiModel;
        saveLocal('ft_aiModel', state.aiModel);
      }
    },

    // My Business
    UPDATE_MY_BUSINESS(state, info) {
      state.myBusiness = { ...state.myBusiness, ...info };
      saveLocal('ft_myBusiness', state.myBusiness);
    },

    UPDATE_WELCOME_BANNER(state, banner) {
      state.welcomeBanner = { ...state.welcomeBanner, ...banner };
      saveLocal('ft_welcomeBanner', state.welcomeBanner);
    },

    UPDATE_USER_PROFILE(state, profile) {
      state.userProfile = { ...state.userProfile, ...profile };
      saveLocal('ft_userProfile', state.userProfile);
    },

    SAVE_CV_DATA(state, cvData) {
      state.cvData = { ...state.cvData, ...cvData };
      saveLocal('ft_cvData', state.cvData);
    },

    ADD_CODE_NOTE(state, note) {
      state.codeNotes.unshift(note);
      saveLocal('ft_codeNotes', state.codeNotes);
    },
    UPDATE_CODE_NOTE(state, updatedNote) {
      const idx = state.codeNotes.findIndex(c => c.id === updatedNote.id);
      if (idx !== -1) {
        state.codeNotes.splice(idx, 1, updatedNote);
        saveLocal('ft_codeNotes', state.codeNotes);
      }
    },
    DELETE_CODE_NOTE(state, id) {
      state.codeNotes = state.codeNotes.filter(c => c.id !== id);
      saveLocal('ft_codeNotes', state.codeNotes);
    },

    ADD_SURAT(state, surat) {
      state.suratList.unshift(surat);
      saveLocal('ft_suratList', state.suratList);
    },
    DELETE_SURAT(state, id) {
      state.suratList = state.suratList.filter(s => s.id !== id);
      saveLocal('ft_suratList', state.suratList);
    },

    ADD_SELFIE(state, selfie) {
      state.selfieGallery.unshift(selfie);
      saveLocal('ft_selfieGallery', state.selfieGallery);
    },
    DELETE_SELFIE(state, id) {
      state.selfieGallery = state.selfieGallery.filter(s => s.id !== id);
      saveLocal('ft_selfieGallery', state.selfieGallery);
    },

    // Global Reset & Import/Export
    CLEAR_ALL_DATA(state) {
      state.contacts = [];
      state.projects = [];
      state.tasks = [];
      state.transactions = [];
      state.invoices = [];
      state.habits = [];
      state.notes = [];
      state.events = [];

      saveLocal('ft_contacts', []);
      saveLocal('ft_projects', []);
      saveLocal('ft_tasks', []);
      saveLocal('ft_transactions', []);
      saveLocal('ft_invoices', []);
      saveLocal('ft_habits', []);
      saveLocal('ft_notes', []);
      saveLocal('ft_events', []);
    },

    LOAD_SAMPLE_DATA(state) {
      state.contacts = [...SAMPLE_CONTACTS];
      state.projects = [...SAMPLE_PROJECTS];
      state.tasks = [...SAMPLE_TASKS];
      state.transactions = [...SAMPLE_TRANSACTIONS];
      state.habits = [...SAMPLE_HABITS];
      state.notes = [...DEFAULT_NOTES];
      state.events = [...DEFAULT_EVENTS];

      saveLocal('ft_contacts', state.contacts);
      saveLocal('ft_projects', state.projects);
      saveLocal('ft_tasks', state.tasks);
      saveLocal('ft_transactions', state.transactions);
      saveLocal('ft_habits', state.habits);
      saveLocal('ft_notes', state.notes);
      saveLocal('ft_events', state.events);
    },

    IMPORT_FULL_DATA(state, data) {
      if (!data) return;
      state.contacts = data.contacts || [];
      state.projects = data.projects || [];
      state.tasks = data.tasks || [];
      state.transactions = data.transactions || [];
      state.invoices = data.invoices || [];
      state.habits = data.habits || [];
      state.notes = data.notes || [];
      state.events = data.events || [];
      if (data.themeMode) state.themeMode = data.themeMode;
      if (data.accentColor) state.accentColor = data.accentColor;
      if (data.budgetThreshold) state.budgetThreshold = data.budgetThreshold;
      if (data.myBusiness) state.myBusiness = data.myBusiness;

      saveLocal('ft_contacts', state.contacts);
      saveLocal('ft_projects', state.projects);
      saveLocal('ft_tasks', state.tasks);
      saveLocal('ft_transactions', state.transactions);
      saveLocal('ft_invoices', state.invoices);
      saveLocal('ft_habits', state.habits);
      saveLocal('ft_notes', state.notes);
      saveLocal('ft_events', state.events);
      saveLocal('ft_themeMode', state.themeMode);
      saveLocal('ft_accentColor', state.accentColor);
      saveLocal('ft_budgetThreshold', state.budgetThreshold);
      saveLocal('ft_myBusiness', state.myBusiness);
    }
  },
  actions: {
    setThemeMode({ commit }, mode) {
      commit('SET_THEME_MODE', mode);
    },
    setAccentColor({ commit }, color) {
      commit('SET_ACCENT_COLOR', color);
    },

    addContact({ commit }, contact) {
      commit('ADD_CONTACT', { ...contact, id: 'c_' + Date.now() + Math.random().toString(36).substr(2, 4) });
    },
    addContactsBulk({ commit }, list) {
      const formatted = list.map((c, i) => ({ ...c, id: 'c_' + (Date.now() + i) + Math.random().toString(36).substr(2, 4) }));
      commit('ADD_CONTACTS_BULK', formatted);
    },
    updateContact({ commit }, contact) {
      commit('UPDATE_CONTACT', contact);
    },
    deleteContact({ commit }, id) {
      commit('DELETE_CONTACT', id);
    },
    deleteContactsBulk({ commit }, ids) {
      commit('DELETE_CONTACTS_BULK', ids);
    },

    addProject({ commit }, project) {
      commit('ADD_PROJECT', { ...project, id: 'p_' + Date.now() + Math.random().toString(36).substr(2, 4) });
    },
    addProjectsBulk({ commit }, list) {
      const formatted = list.map((p, i) => ({ ...p, id: 'p_' + (Date.now() + i) + Math.random().toString(36).substr(2, 4) }));
      commit('ADD_PROJECTS_BULK', formatted);
    },
    updateProject({ commit }, project) {
      commit('UPDATE_PROJECT', project);
    },
    deleteProject({ commit }, id) {
      commit('DELETE_PROJECT', id);
    },
    deleteProjectsBulk({ commit }, ids) {
      commit('DELETE_PROJECTS_BULK', ids);
    },

    addTask({ commit }, task) {
      commit('ADD_TASK', {
        recurring: 'none',
        statusColumn: 'todo',
        eisenhower: 'do_first',
        ...task,
        id: 't_' + Date.now() + Math.random().toString(36).substr(2, 4)
      });
    },
    addTasksBulk({ commit }, list) {
      const formatted = list.map((t, i) => ({
        recurring: 'none',
        statusColumn: 'todo',
        eisenhower: 'do_first',
        level: 'Menengah',
        projectTag: 'Umum',
        deadline: new Date().toISOString().split('T')[0],
        done: false,
        ...t,
        id: 't_' + (Date.now() + i) + Math.random().toString(36).substr(2, 4)
      }));
      commit('ADD_TASKS_BULK', formatted);
    },
    updateTask({ commit }, task) {
      commit('UPDATE_TASK', task);
    },
    toggleTask({ commit }, id) {
      commit('TOGGLE_TASK', id);
    },
    updateTaskStatus({ commit }, payload) {
      commit('UPDATE_TASK_STATUS', payload);
    },
    deleteTask({ commit }, id) {
      commit('DELETE_TASK', id);
    },
    deleteTasksBulk({ commit }, ids) {
      commit('DELETE_TASKS_BULK', ids);
    },

    addTransaction({ commit }, transaction) {
      commit('ADD_TRANSACTION', { ...transaction, id: 'tr_' + Date.now() + Math.random().toString(36).substr(2, 4) });
    },
    addTransactionsBulk({ commit }, list) {
      const formatted = list.map((tr, i) => ({ ...tr, id: 'tr_' + (Date.now() + i) + Math.random().toString(36).substr(2, 4) }));
      commit('ADD_TRANSACTIONS_BULK', formatted);
    },
    updateTransaction({ commit }, transaction) {
      commit('UPDATE_TRANSACTION', transaction);
    },
    deleteTransaction({ commit }, id) {
      commit('DELETE_TRANSACTION', id);
    },
    deleteTransactionsBulk({ commit }, ids) {
      commit('DELETE_TRANSACTIONS_BULK', ids);
    },

    addInvoice({ commit }, invoice) {
      commit('ADD_INVOICE', { ...invoice, id: 'inv_' + Date.now() });
    },
    updateInvoice({ commit }, invoice) {
      commit('UPDATE_INVOICE', invoice);
    },
    deleteInvoice({ commit }, id) {
      commit('DELETE_INVOICE', id);
    },
    deleteInvoicesBulk({ commit }, ids) {
      commit('DELETE_INVOICES_BULK', ids);
    },

    addHabit({ commit }, habit) {
      commit('ADD_HABIT', { ...habit, id: 'h_' + Date.now(), history: {} });
    },
    updateHabit({ commit }, habit) {
      commit('UPDATE_HABIT', habit);
    },
    toggleHabitDate({ commit }, payload) {
      commit('TOGGLE_HABIT_DATE', payload);
    },
    deleteHabit({ commit }, id) {
      commit('DELETE_HABIT', id);
    },

    addNote({ commit }, note) {
      commit('ADD_NOTE', { ...note, id: 'n_' + Date.now(), updatedAt: new Date().toISOString() });
    },
    addNotesBulk({ commit }, notesArray) {
      const formatted = notesArray.map((note, index) => ({
        ...note,
        id: 'n_' + (Date.now() + index),
        updatedAt: new Date().toISOString()
      }));
      commit('ADD_NOTES_BULK', formatted);
    },
    updateNote({ commit }, note) {
      commit('UPDATE_NOTE', { ...note, updatedAt: new Date().toISOString() });
    },
    deleteNote({ commit }, id) {
      commit('DELETE_NOTE', id);
    },
    deleteNotesBulk({ commit }, ids) {
      commit('DELETE_NOTES_BULK', ids);
    },

    addEvent({ commit }, eventItem) {
      commit('ADD_EVENT', { ...eventItem, id: 'ev_' + Date.now() });
    },
    updateEvent({ commit }, eventItem) {
      commit('UPDATE_EVENT', eventItem);
    },
    deleteEvent({ commit }, id) {
      commit('DELETE_EVENT', id);
    },

    setThemeMode({ commit }, mode) {
      commit('SET_THEME_MODE', mode);
    },

    setBudgetThreshold({ commit }, amount) {
      commit('SET_BUDGET_THRESHOLD', amount);
    },

    updateMyBusiness({ commit }, info) {
      commit('UPDATE_MY_BUSINESS', info);
    },

    updateUserProfile({ commit }, profile) {
      commit('UPDATE_USER_PROFILE', profile);
    },

    saveCvData({ commit }, cvData) {
      commit('SAVE_CV_DATA', cvData);
    },

    addCodeNote({ commit }, note) {
      commit('ADD_CODE_NOTE', { ...note, id: 'cn_' + Date.now(), createdAt: new Date().toISOString() });
    },
    updateCodeNote({ commit }, note) {
      commit('UPDATE_CODE_NOTE', note);
    },
    deleteCodeNote({ commit }, id) {
      commit('DELETE_CODE_NOTE', id);
    },

    addSurat({ commit }, surat) {
      commit('ADD_SURAT', { ...surat, id: 'srt_' + Date.now(), createdAt: new Date().toISOString() });
    },
    deleteSurat({ commit }, id) {
      commit('DELETE_SURAT', id);
    },

    addSelfie({ commit }, selfie) {
      commit('ADD_SELFIE', { ...selfie, id: 'slf_' + Date.now(), timestamp: new Date().toISOString() });
    },
    deleteSelfie({ commit }, id) {
      commit('DELETE_SELFIE', id);
    },

    clearAllData({ commit }) {
      commit('CLEAR_ALL_DATA');
    },

    loadSampleData({ commit }) {
      commit('LOAD_SAMPLE_DATA');
    },

    importFullData({ commit }, data) {
      commit('IMPORT_FULL_DATA', data);
    }
  }
});
