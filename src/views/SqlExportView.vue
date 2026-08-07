<template>
  <div class="container-fluid p-0" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border">
      <div>
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="badge bg-purple text-white fw-bold px-3 py-1.5 rounded-pill" style="background-color: #6f42c1;">🗄️ Database Migration Engine</span>
          <span class="badge bg-primary-subtle text-primary fw-bold px-3 py-1.5 rounded-pill">SQL Dump & Schema Generator</span>
        </div>
        <h2 class="fw-bold mb-1 text-dark">🗄️ Export Everything to SQL</h2>
        <p class="text-muted mb-0">Eksport seluruh data aplikasi (Tasks, Contacts, Projects, Finance, Notes, Surat) menjadi skrip database relational SQL (.sql).</p>
      </div>

      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" @click="downloadSqlDump">
          <i class="bi bi-download me-1"></i> Unduh File Database (.sql)
        </button>
      </div>
    </div>

    <!-- SQL Engine Controls & Options -->
    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
          <h5 class="fw-bold text-dark mb-3"><i class="bi bi-sliders text-primary me-2"></i>Dialek SQL</h5>
          <div class="mb-3">
            <label class="form-label fw-bold text-dark small">Pilih Format Database Target:</label>
            <select class="form-select border-2" v-model="sqlDialect" @change="generateSqlDump">
              <option value="postgresql">🐘 PostgreSQL (Standard Cloud SQL)</option>
              <option value="mysql">🐬 MySQL / MariaDB</option>
              <option value="sqlite">🗃️ SQLite 3 (Embedded)</option>
            </select>
          </div>

          <div class="form-check form-switch mb-3">
            <input class="form-check-input" type="checkbox" id="includeDropTable" v-model="includeDropTable" @change="generateSqlDump" />
            <label class="form-check-label fw-bold text-dark small" for="includeDropTable">
              Sertakan DROP TABLE IF EXISTS
            </label>
          </div>

          <div class="form-check form-switch mb-3">
            <input class="form-check-input" type="checkbox" id="includeSampleInserts" v-model="includeInserts" @change="generateSqlDump" />
            <label class="form-check-label fw-bold text-dark small" for="includeSampleInserts">
              Sertakan Data INSERT Records
            </label>
          </div>

          <button class="btn btn-outline-primary w-100 rounded-pill fw-bold mt-2" @click="copySqlToClipboard">
            <i class="bi bi-clipboard me-1"></i> {{ isCopied ? 'Tersalin ke Clipboard!' : 'Salin Semua SQL' }}
          </button>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
          <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
            <h5 class="fw-bold text-dark mb-0"><i class="bi bi-code-square text-success me-2"></i>Generated SQL Script Preview</h5>
            <span class="badge bg-light text-dark border fw-mono px-3 py-1">{{ totalStatementsCount }} SQL Statements</span>
          </div>

          <div class="position-relative">
            <textarea
              class="form-control font-monospace text-success bg-dark p-3 rounded-3 border-0 small"
              rows="14"
              readonly
              v-model="sqlDumpCode"
              style="font-family: 'Fira Code', 'Courier New', monospace; line-height: 1.4;"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { sendOnDeviceNotification } from '../utils/notification';

export default {
  name: 'SqlExportView',
  setup() {
    const store = useStore();

    const sqlDialect = ref('postgresql');
    const includeDropTable = ref(true);
    const includeInserts = ref(true);
    const sqlDumpCode = ref('');
    const isCopied = ref(false);

    const escapeSql = (str) => {
      if (str === null || str === undefined) return 'NULL';
      return `'${String(str).replace(/'/g, "''")}'`;
    };

    const generateSqlDump = () => {
      let sql = `-- ==========================================================\n`;
      sql += `-- RAJINKERJA CORE DATABASE EXPORT DUMP\n`;
      sql += `-- Target Dialect: ${sqlDialect.value.toUpperCase()}\n`;
      sql += `-- Generated At: ${new Date().toISOString()}\n`;
      sql += `-- ==========================================================\n\n`;

      const isPg = sqlDialect.value === 'postgresql';

      // 1. TODOS / TASKS TABLE
      if (includeDropTable.value) sql += `DROP TABLE IF EXISTS todos;\n`;
      sql += `CREATE TABLE todos (\n`;
      sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
      sql += `  name VARCHAR(255) NOT NULL,\n`;
      sql += `  level VARCHAR(32),\n`;
      sql += `  category VARCHAR(64),\n`;
      sql += `  deadline VARCHAR(32),\n`;
      sql += `  done BOOLEAN DEFAULT FALSE,\n`;
      sql += `  status_column VARCHAR(32),\n`;
      sql += `  notes TEXT\n`;
      sql += `);\n\n`;

      if (includeInserts.value) {
        const tasks = store.getters.getTasks || [];
        tasks.forEach(t => {
          sql += `INSERT INTO todos (id, name, level, category, deadline, done, status_column, notes) VALUES (\n`;
          sql += `  ${escapeSql(t.id)}, ${escapeSql(t.name)}, ${escapeSql(t.level)}, ${escapeSql(t.category)}, ${escapeSql(t.deadline)}, ${t.done ? 'TRUE' : 'FALSE'}, ${escapeSql(t.statusColumn)}, ${escapeSql(t.notes)}\n`;
          sql += `);\n`;
        });
        sql += `\n`;
      }

      // 2. CONTACTS TABLE
      if (includeDropTable.value) sql += `DROP TABLE IF EXISTS contacts;\n`;
      sql += `CREATE TABLE contacts (\n`;
      sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
      sql += `  name VARCHAR(255) NOT NULL,\n`;
      sql += `  company VARCHAR(255),\n`;
      sql += `  email VARCHAR(255),\n`;
      sql += `  phone VARCHAR(64),\n`;
      sql += `  group_name VARCHAR(64),\n`;
      sql += `  category VARCHAR(64),\n`;
      sql += `  status VARCHAR(32)\n`;
      sql += `);\n\n`;

      if (includeInserts.value) {
        const contacts = store.getters.getContacts || [];
        contacts.forEach(c => {
          sql += `INSERT INTO contacts (id, name, company, email, phone, group_name, category, status) VALUES (\n`;
          sql += `  ${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.company)}, ${escapeSql(c.email)}, ${escapeSql(c.phone)}, ${escapeSql(c.groupName || 'Tim Internal')}, ${escapeSql(c.category)}, ${escapeSql(c.status)}\n`;
          sql += `);\n`;
        });
        sql += `\n`;
      }

      // 3. FINANCES / TRANSACTIONS TABLE
      if (includeDropTable.value) sql += `DROP TABLE IF EXISTS transactions;\n`;
      sql += `CREATE TABLE transactions (\n`;
      sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
      sql += `  item VARCHAR(255) NOT NULL,\n`;
      sql += `  amount NUMERIC(15, 2) NOT NULL,\n`;
      sql += `  type VARCHAR(32) NOT NULL,\n`;
      sql += `  date VARCHAR(32),\n`;
      sql += `  category VARCHAR(64)\n`;
      sql += `);\n\n`;

      if (includeInserts.value) {
        const trs = store.getters.getTransactions || [];
        trs.forEach(tr => {
          sql += `INSERT INTO transactions (id, item, amount, type, date, category) VALUES (\n`;
          sql += `  ${escapeSql(tr.id)}, ${escapeSql(tr.item)}, ${tr.amount || 0}, ${escapeSql(tr.type)}, ${escapeSql(tr.date)}, ${escapeSql(tr.category)}\n`;
          sql += `);\n`;
        });
        sql += `\n`;
      }

      // 4. NOTES TABLE
      if (includeDropTable.value) sql += `DROP TABLE IF EXISTS notes;\n`;
      sql += `CREATE TABLE notes (\n`;
      sql += `  id VARCHAR(64) PRIMARY KEY,\n`;
      sql += `  title VARCHAR(255) NOT NULL,\n`;
      sql += `  content TEXT,\n`;
      sql += `  category VARCHAR(64),\n`;
      sql += `  color VARCHAR(32)\n`;
      sql += `);\n\n`;

      if (includeInserts.value) {
        const notes = store.getters.getNotes || [];
        notes.forEach(n => {
          sql += `INSERT INTO notes (id, title, content, category, color) VALUES (\n`;
          sql += `  ${escapeSql(n.id)}, ${escapeSql(n.title)}, ${escapeSql(n.content)}, ${escapeSql(n.category)}, ${escapeSql(n.color)}\n`;
          sql += `);\n`;
        });
      }

      sqlDumpCode.value = sql;
    };

    const totalStatementsCount = computed(() => {
      if (!sqlDumpCode.value) return 0;
      return (sqlDumpCode.value.match(/;/g) || []).length;
    });

    const copySqlToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(sqlDumpCode.value);
        isCopied.value = true;
        sendOnDeviceNotification('📋 SQL Script Tersalin', {
          body: 'Seluruh skrip SQL telah disalin ke clipboard.',
          type: 'success'
        });
        setTimeout(() => { isCopied.value = false; }, 2000);
      } catch (err) {
        console.error(err);
      }
    };

    const downloadSqlDump = () => {
      const blob = new Blob([sqlDumpCode.value], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `rajinkerja-database-dump-${dateStr}.sql`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      sendOnDeviceNotification('💾 SQL Dump Terunduh', {
        body: `File rajinkerja-database-dump-${dateStr}.sql berhasil diunduh.`,
        type: 'success'
      });
    };

    onMounted(() => {
      generateSqlDump();
    });

    return {
      sqlDialect,
      includeDropTable,
      includeInserts,
      sqlDumpCode,
      isCopied,
      totalStatementsCount,
      generateSqlDump,
      copySqlToClipboard,
      downloadSqlDump
    };
  }
};
</script>
