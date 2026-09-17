<template>
  <div class="container-fluid p-0 pb-5" data-aos="fade-up">
    <!-- Header Banner -->
    <div class="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border">
      <div>
        <div class="d-flex flex-wrap align-items-center gap-2 mb-1.5">
          <span class="badge bg-primary text-white fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-people-fill me-1"></i> Tim & Komunikasi
          </span>
          <span class="badge bg-info-subtle text-info-emphasis fw-bold px-3 py-1.5 rounded-pill">
            <i class="bi bi-calendar-check me-1"></i> Google Calendar Sync
          </span>
          <span class="badge bg-success-subtle text-success fw-bold px-3 py-1.5 rounded-pill">
            Kolaborasi Lintas Divisi
          </span>
        </div>
        <h2 class="fw-bold mb-1 text-dark fs-4 fs-md-3">Modul Tim & Komunikasi Terintegrasi</h2>
        <p class="text-muted mb-0 small">
          Pusat buletin satu arah, ruang diskusi saluran (channel), repositori aset bersama, ticketing lintas divisi, direktori keahlian, dan kalender kolaborasi terhubung Google Calendar.
        </p>
      </div>

      <!-- Quick Google Calendar Connection Status in Header -->
      <div class="d-flex align-items-center gap-2 flex-wrap">
        <div v-if="googleUser" class="d-flex align-items-center gap-2 bg-light border px-3 py-1.5 rounded-pill">
          <img v-if="googleUser.photoURL" :src="googleUser.photoURL" class="rounded-circle" width="24" height="24" alt="Google Avatar" />
          <i v-else class="bi bi-google text-primary"></i>
          <span class="small fw-semibold text-dark text-truncate" style="max-width: 140px;">{{ googleUser.displayName || googleUser.email }}</span>
          <button class="btn btn-sm btn-outline-danger border-0 p-0 ms-1" @click="handleGoogleSignOut" title="Putus Akun Google">
            <i class="bi bi-box-arrow-right"></i>
          </button>
        </div>
        <button
          v-else
          class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-1.5 shadow-sm"
          @click="handleGoogleSignIn"
          :disabled="isGoogleConnecting"
        >
          <span v-if="isGoogleConnecting" class="spinner-border spinner-border-sm me-1" role="status"></span>
          <i v-else class="bi bi-google"></i>
          <span>{{ isGoogleConnecting ? 'Menghubungkan...' : 'Hubungkan Google Calendar' }}</span>
        </button>
      </div>
    </div>

    <!-- Navigation Tabs (6 Essential Features) -->
    <div class="card border-0 shadow-sm rounded-4 bg-white mb-4 overflow-hidden">
      <div class="card-header bg-light border-bottom p-2 p-md-3">
        <div class="d-flex flex-wrap gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="btn btn-sm rounded-pill px-3 py-2 fw-semibold transition-all d-flex align-items-center gap-1.5"
            :class="activeTab === tab.id ? 'btn-primary text-white shadow-sm' : 'btn-white text-secondary border'"
            @click="switchTab(tab.id)"
          >
            <i :class="tab.icon"></i>
            <span>{{ tab.label }}</span>
            <span v-if="tab.badgeCount" class="badge rounded-pill bg-white text-primary ms-1 px-1.5 py-0.5" style="font-size: 10px;">
              {{ tab.badgeCount }}
            </span>
          </button>
        </div>
      </div>

      <div class="card-body p-3 p-md-4">
        <!-- ======================================================== -->
        <!-- TAB 1: PUSAT INFORMASI & PENGUMUMAN (COMPANY BULLETIN)   -->
        <!-- ======================================================== -->
        <div v-if="activeTab === 'bulletin'">
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
            <div>
              <h5 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i class="bi bi-megaphone-fill text-danger"></i>
                <span>Pusat Informasi & Pengumuman Internal (Top-Down)</span>
              </h5>
              <small class="text-muted">Papan buletin resmi manajemen/HR untuk kebijakan baru, pencapaian target, dan agenda bersama.</small>
            </div>
            <button class="btn btn-sm btn-danger rounded-pill px-3.5 py-1.5 fw-bold shadow-sm d-flex align-items-center gap-1" @click="openBulletinModal()">
              <i class="bi bi-plus-circle"></i> Buat Pengumuman
            </button>
          </div>

          <!-- Category filter -->
          <div class="d-flex flex-wrap gap-1.5 mb-3">
            <button
              v-for="cat in bulletinCategories"
              :key="cat"
              class="btn btn-xs rounded-pill px-3 py-1 fw-semibold"
              :class="selectedBulletinCat === cat ? 'btn-danger text-white' : 'btn-light text-muted border'"
              @click="selectedBulletinCat = cat"
            >
              {{ cat }}
            </button>
          </div>

          <!-- Bulletin List -->
          <div v-if="filteredBulletins.length === 0" class="text-center py-5 bg-light rounded-4 border">
            <i class="bi bi-megaphone text-muted fs-1 mb-2 d-block"></i>
            <h6 class="fw-bold text-dark">Belum Ada Pengumuman Internal</h6>
            <p class="text-muted small mb-3">Klik tombol "Buat Pengumuman" untuk menyiarkan informasi ke seluruh tim.</p>
            <button class="btn btn-sm btn-danger rounded-pill px-4 fw-semibold" @click="openBulletinModal()">
              + Buat Pengumuman Baru
            </button>
          </div>

          <div v-else class="row g-3">
            <div v-for="b in filteredBulletins" :key="b.id" class="col-12">
              <div class="card border rounded-4 shadow-xs overflow-hidden transition-all hover-elevate">
                <div class="card-body p-3.5">
                  <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <div class="d-flex flex-wrap align-items-center gap-2">
                      <span class="badge" :class="getPriorityClass(b.priority)">{{ b.priority }}</span>
                      <span class="badge bg-light text-dark border">{{ b.category }}</span>
                      <span v-if="b.targetDivision" class="badge bg-secondary-subtle text-secondary">
                        <i class="bi bi-diagram-3 me-1"></i>{{ b.targetDivision }}
                      </span>
                      <span class="text-muted small">
                        <i class="bi bi-clock me-1"></i>{{ b.displayDate }}
                      </span>
                    </div>

                    <div class="d-flex align-items-center gap-1">
                      <button class="btn btn-sm btn-outline-secondary rounded-circle p-1" @click="openBulletinModal(b)" title="Edit">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-sm btn-outline-danger rounded-circle p-1" @click="removeBulletin(b.id)" title="Hapus">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>

                  <h5 class="fw-bold text-dark mb-2">{{ b.title }}</h5>
                  <p class="text-secondary small mb-3 lh-base" style="white-space: pre-line;">{{ b.content }}</p>

                  <div class="d-flex justify-content-between align-items-center border-top pt-2 mt-2">
                    <span class="small text-muted">
                      Dipublikasikan oleh: <strong>{{ b.author || 'Manajemen / HR' }}</strong> ({{ b.authorRole || 'Otoritas' }})
                    </span>
                    <button class="btn btn-xs btn-outline-primary rounded-pill px-2.5 py-1" @click="broadcastNotification(b)">
                      <i class="bi bi-bell-fill me-1"></i> Kirim Notifikasi Ulang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- TAB 2: RUANG DISKUSI BERBASIS SALURAN (CHANNELS)         -->
        <!-- ======================================================== -->
        <div v-else-if="activeTab === 'channels'">
          <div class="row g-3">
            <!-- Sidebar Channels List -->
            <div class="col-lg-4">
              <div class="card border rounded-4 shadow-xs h-100 bg-light p-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="fw-bold text-dark mb-0 d-flex align-items-center gap-1.5">
                    <i class="bi bi-hash text-primary"></i> Saluran Diskusi
                  </h6>
                  <button class="btn btn-xs btn-primary rounded-pill px-2.5 py-1 fw-bold" @click="openChannelModal">
                    + Saluran Baru
                  </button>
                </div>

                <div v-if="channels.length === 0" class="text-center py-4">
                  <i class="bi bi-chat-square-dots text-muted fs-3 mb-2 d-block"></i>
                  <p class="text-muted small mb-2">Belum ada channel dibuat.</p>
                  <button class="btn btn-xs btn-outline-primary rounded-pill px-3" @click="openChannelModal">
                    Buat Saluran Pertama
                  </button>
                </div>

                <div v-else class="d-flex flex-column gap-1.5 overflow-y-auto" style="max-height: 480px;">
                  <button
                    v-for="ch in channels"
                    :key="ch.id"
                    class="btn text-start p-2.5 rounded-3 d-flex align-items-center justify-content-between transition-all"
                    :class="selectedChannelId === ch.id ? 'bg-primary text-white shadow-xs' : 'bg-white text-dark border'"
                    @click="selectChannel(ch.id)"
                  >
                    <div class="overflow-hidden me-2">
                      <strong class="d-block text-truncate">{{ ch.name }}</strong>
                      <small :class="selectedChannelId === ch.id ? 'text-white-50' : 'text-muted'" class="d-block text-truncate">
                        {{ ch.topic || 'Diskusi proyek' }}
                      </small>
                    </div>
                    <button
                      v-if="selectedChannelId === ch.id"
                      class="btn btn-xs btn-outline-light border-0 p-1"
                      @click.stop="removeChannel(ch.id)"
                      title="Hapus Saluran"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </button>
                </div>
              </div>
            </div>

            <!-- Active Channel Conversation Box -->
            <div class="col-lg-8">
              <div v-if="!activeChannel" class="card border rounded-4 shadow-xs h-100 p-5 text-center bg-white">
                <i class="bi bi-chat-left-text text-muted display-4 mb-3 d-block"></i>
                <h5 class="fw-bold text-dark">Pilih atau Buat Saluran Diskusi</h5>
                <p class="text-muted small mb-3">Buat channel kolaborasi proyek seperti <code>#Kampanye-Promo-Akhir-Tahun</code> untuk menghubungkan tim Marketing, Finance, dan Operasional.</p>
                <button class="btn btn-sm btn-primary rounded-pill px-4 align-self-center" @click="openChannelModal">
                  + Buat Saluran Baru
                </button>
              </div>

              <div v-else class="card border rounded-4 shadow-xs h-100 d-flex flex-column bg-white overflow-hidden">
                <!-- Channel Header -->
                <div class="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h5 class="fw-bold text-dark mb-0">{{ activeChannel.name }}</h5>
                    <small class="text-muted">{{ activeChannel.topic || 'Saluran diskusi asinkron' }}</small>
                  </div>
                  <div class="d-flex align-items-center gap-1.5 flex-wrap">
                    <span v-for="div in (activeChannel.divisions || [])" :key="div" class="badge bg-primary-subtle text-primary border border-primary-subtle">
                      {{ div }}
                    </span>
                  </div>
                </div>

                <!-- Messages Timeline -->
                <div class="card-body p-3 overflow-y-auto flex-grow-1" style="min-height: 320px; max-height: 420px; background-color: #f8fafc;" ref="chatScrollBox">
                  <div v-if="activeMessages.length === 0" class="text-center py-5">
                    <i class="bi bi-chat-dots text-muted fs-2 mb-2 d-block"></i>
                    <p class="text-muted small mb-0">Belum ada obrolan di saluran {{ activeChannel.name }}.<br />Mulai sapa rekan tim Anda!</p>
                  </div>

                  <div v-else class="d-flex flex-column gap-2.5">
                    <div
                      v-for="msg in activeMessages"
                      :key="msg.id"
                      class="d-flex flex-column p-2.5 rounded-3 bg-white border shadow-xs"
                    >
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <div class="d-flex align-items-center gap-2">
                          <strong class="text-dark small">{{ msg.senderName }}</strong>
                          <span class="badge bg-light text-secondary border small">{{ msg.senderRole }}</span>
                          <span class="badge bg-secondary-subtle text-secondary small">{{ msg.senderDivision }}</span>
                        </div>
                        <span class="text-muted" style="font-size: 11px;">{{ msg.timestamp }}</span>
                      </div>
                      <p class="text-secondary small mb-1 lh-sm" style="white-space: pre-wrap;">{{ msg.text }}</p>
                      <div v-if="msg.attachmentName" class="p-1.5 rounded bg-light border d-inline-flex align-items-center gap-2 small">
                        <i class="bi bi-paperclip text-primary"></i>
                        <span class="fw-semibold text-truncate">{{ msg.attachmentName }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Message Input -->
                <div class="card-footer bg-white border-top p-2.5">
                  <form @submit.prevent="handleSendMessage" class="d-flex gap-2">
                    <input
                      type="text"
                      class="form-control rounded-pill px-3.5"
                      placeholder="Tulis pesan ke saluran..."
                      v-model="newMessageText"
                      required
                    />
                    <button type="button" class="btn btn-outline-secondary rounded-circle p-2" @click="attachFilePrompt" title="Lampirkan Dokumen/Link">
                      <i class="bi bi-paperclip"></i>
                    </button>
                    <button type="submit" class="btn btn-primary rounded-pill px-4 fw-bold shadow-xs">
                      Kirim
                    </button>
                  </form>
                  <small v-if="attachedFileName" class="text-success mt-1 d-block">
                    <i class="bi bi-check2-circle me-1"></i> Terlampir: {{ attachedFileName }}
                    <button type="button" class="btn btn-link btn-xs text-danger p-0 ms-1" @click="attachedFileName = ''">Hapus</button>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- TAB 3: REPOSITORI ASET & DOKUMEN BERSAMA (SHARED ASSETS) -->
        <!-- ======================================================== -->
        <div v-else-if="activeTab === 'assets'">
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
            <div>
              <h5 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i class="bi bi-folder-symlink-fill text-warning"></i>
                <span>Repositori Aset & Dokumen Bersama (Marketing & Divisi)</span>
              </h5>
              <small class="text-muted">Perpustakaan digital sentral untuk Brand Guidelines, logo HD, template pitch deck, dan SOP resmi perusahaan.</small>
            </div>
            <button class="btn btn-sm btn-warning rounded-pill px-3.5 py-1.5 fw-bold shadow-sm d-flex align-items-center gap-1 text-dark" @click="openAssetModal">
              <i class="bi bi-upload"></i> Unggah Aset Baru
            </button>
          </div>

          <!-- Filter & Search -->
          <div class="row g-2 mb-3 align-items-center">
            <div class="col-md-5">
              <input type="text" class="form-control form-control-sm rounded-pill px-3" placeholder="Cari nama aset, format, atau deskripsi..." v-model="assetSearch" />
            </div>
            <div class="col-md-7 d-flex flex-wrap gap-1.5 justify-content-md-end">
              <button
                v-for="cat in assetCategories"
                :key="cat"
                class="btn btn-xs rounded-pill px-3 py-1 fw-semibold"
                :class="selectedAssetCat === cat ? 'btn-warning text-dark' : 'btn-light text-muted border'"
                @click="selectedAssetCat = cat"
              >
                {{ cat }}
              </button>
            </div>
          </div>

          <!-- Asset Cards -->
          <div v-if="filteredAssets.length === 0" class="text-center py-5 bg-light rounded-4 border">
            <i class="bi bi-folder2-open text-muted fs-1 mb-2 d-block"></i>
            <h6 class="fw-bold text-dark">Belum Ada Aset Terunggah</h6>
            <p class="text-muted small mb-3">Unggah Brand Guidelines, logo SVG/PNG, atau panduan SOP agar tim tidak perlu meminta manual via chat.</p>
            <button class="btn btn-sm btn-warning text-dark rounded-pill px-4 fw-semibold" @click="openAssetModal">
              + Unggah Aset Perusahaan
            </button>
          </div>

          <div v-else class="row g-3">
            <div v-for="a in filteredAssets" :key="a.id" class="col-md-6 col-lg-4">
              <div class="card border rounded-4 shadow-xs h-100 bg-white p-3.5 d-flex flex-column justify-content-between transition-all hover-elevate">
                <div>
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <span class="badge bg-warning-subtle text-warning-emphasis fw-bold border border-warning-subtle">{{ a.category }}</span>
                    <button class="btn btn-sm btn-outline-danger border-0 p-1" @click="removeAsset(a.id)" title="Hapus Aset">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                  <h6 class="fw-bold text-dark mb-1 text-truncate" :title="a.title">{{ a.title }}</h6>
                  <p class="text-muted small mb-2 lh-sm" style="min-height: 36px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    {{ a.description || 'Aset resmi terpusat perusahaan' }}
                  </p>
                  <div class="d-flex align-items-center gap-2 small text-muted mb-3">
                    <span class="badge bg-light text-dark border">{{ a.fileType }}</span>
                    <span>• {{ a.fileSize }}</span>
                    <span>• {{ a.uploadDate }}</span>
                  </div>
                </div>

                <div class="border-top pt-2.5 d-flex gap-2">
                  <a :href="a.fileUrl || '#'" target="_blank" download class="btn btn-sm btn-primary rounded-pill flex-fill fw-semibold">
                    <i class="bi bi-download me-1"></i> Unduh Aset
                  </a>
                  <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="copyAssetLink(a)" title="Salin URL">
                    <i class="bi bi-link-45deg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- TAB 4: SISTEM PERMINTAAN LINTAS DIVISI (TICKETING)       -->
        <!-- ======================================================== -->
        <div v-else-if="activeTab === 'ticketing'">
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
            <div>
              <h5 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i class="bi bi-ticket-perforated-fill text-success"></i>
                <span>Sistem Permintaan Lintas Divisi (Internal Ticketing)</span>
              </h5>
              <small class="text-muted">Standarisasi permintaan antar tim (Sales minta brosur ke Marketing, Marketing minta pencairan ke Finance) tanpa saling tag berulang.</small>
            </div>
            <button class="btn btn-sm btn-success rounded-pill px-3.5 py-1.5 fw-bold shadow-sm d-flex align-items-center gap-1" @click="openTicketModal">
              <i class="bi bi-plus-circle"></i> Buat Tiket Permintaan
            </button>
          </div>

          <!-- Status Filters -->
          <div class="d-flex flex-wrap gap-1.5 mb-3">
            <button
              v-for="st in ticketStatuses"
              :key="st"
              class="btn btn-xs rounded-pill px-3 py-1 fw-semibold"
              :class="selectedTicketStatus === st ? 'btn-success text-white' : 'btn-light text-muted border'"
              @click="selectedTicketStatus = st"
            >
              {{ st }}
            </button>
          </div>

          <!-- Tickets Table -->
          <div v-if="filteredTickets.length === 0" class="text-center py-5 bg-light rounded-4 border">
            <i class="bi bi-ticket-detailed text-muted fs-1 mb-2 d-block"></i>
            <h6 class="fw-bold text-dark">Belum Ada Tiket Permintaan</h6>
            <p class="text-muted small mb-3">Ajukan permintaan antar tim secara transparan dan terukur.</p>
            <button class="btn btn-sm btn-success rounded-pill px-4 fw-semibold" @click="openTicketModal">
              + Ajukan Tiket Pertama
            </button>
          </div>

          <div v-else class="table-responsive bg-white rounded-4 border shadow-xs">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light text-muted small">
                <tr>
                  <th class="ps-3">No. Tiket</th>
                  <th>Permintaan / Kebutuhan</th>
                  <th>Dari Divisi</th>
                  <th>Ke Divisi</th>
                  <th>Prioritas</th>
                  <th>Status</th>
                  <th>Tenggat (Deadline)</th>
                  <th class="text-end pe-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in filteredTickets" :key="t.id">
                  <td class="ps-3 font-monospace fw-bold text-primary small">{{ t.ticketNumber }}</td>
                  <td>
                    <strong class="d-block text-dark">{{ t.title }}</strong>
                    <small class="text-muted text-truncate d-block" style="max-width: 260px;">{{ t.description }}</small>
                  </td>
                  <td><span class="badge bg-light text-dark border">{{ t.fromDepartment }}</span></td>
                  <td><span class="badge bg-primary-subtle text-primary border border-primary-subtle">{{ t.toDepartment }}</span></td>
                  <td><span class="badge" :class="getPriorityClass(t.priority)">{{ t.priority }}</span></td>
                  <td>
                    <select
                      class="form-select form-select-sm rounded-pill fw-semibold"
                      :class="getTicketStatusClass(t.status)"
                      :value="t.status"
                      @change="onTicketStatusChange(t.id, $event.target.value)"
                    >
                      <option value="Menunggu">🟡 Menunggu</option>
                      <option value="Sedang Dikerjakan">🔵 Sedang Dikerjakan</option>
                      <option value="Selesai">🟢 Selesai</option>
                      <option value="Ditolak">🔴 Ditolak</option>
                    </select>
                  </td>
                  <td class="small text-muted">{{ t.dueDate || '-' }}</td>
                  <td class="text-end pe-3">
                    <button class="btn btn-xs btn-outline-danger rounded-circle p-1.5" @click="removeTicket(t.id)" title="Hapus">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- TAB 5: KALENDER KOLABORASI & GOOGLE CALENDAR             -->
        <!-- ======================================================== -->
        <div v-else-if="activeTab === 'calendar'">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 p-3.5 bg-light rounded-4 border">
            <div>
              <div class="d-flex align-items-center gap-2 mb-1">
                <span class="badge bg-primary text-white fw-bold px-2.5 py-1 rounded-pill">
                  <i class="bi bi-calendar-event me-1"></i> Google Calendar OAuth 2.0
                </span>
                <span v-if="googleUser" class="badge bg-success text-white fw-bold px-2.5 py-1 rounded-pill">
                  <i class="bi bi-check-circle-fill me-1"></i> Terhubung
                </span>
                <span v-else class="badge bg-secondary text-white fw-bold px-2.5 py-1 rounded-pill">
                  Offline
                </span>
              </div>
              <h5 class="fw-bold text-dark mb-0">Kalender Kolaborasi & Ketersediaan Tim</h5>
              <small class="text-muted">Sinkronisasi agenda peluncuran, rapat kampanye tim, dan pantau status ketersediaan (WFH/Cuti/Kantor).</small>
            </div>

            <!-- Google Calendar Action Buttons -->
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <template v-if="googleUser">
                <button class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1.5 fw-bold" @click="loadGoogleEvents" :disabled="isLoadingGoogleEvents">
                  <span v-if="isLoadingGoogleEvents" class="spinner-border spinner-border-sm me-1" role="status"></span>
                  <i v-else class="bi bi-arrow-repeat me-1"></i>
                  <span>Sinkronkan Agenda</span>
                </button>
                <button class="btn btn-sm btn-primary rounded-pill px-3.5 py-1.5 fw-bold shadow-sm" @click="openAddGoogleEventModal">
                  <i class="bi bi-calendar-plus me-1"></i> + Event Google Calendar
                </button>
              </template>
              <button
                v-else
                class="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2"
                @click="handleGoogleSignIn"
                :disabled="isGoogleConnecting"
              >
                <i class="bi bi-google"></i>
                <span>Masuk dengan Google Calendar</span>
              </button>
            </div>
          </div>

          <div class="row g-4">
            <!-- Left: Google Calendar Events & Timeline -->
            <div class="col-lg-7">
              <div class="card border rounded-4 shadow-xs p-3.5 bg-white h-100">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <i class="bi bi-calendar-check text-primary fs-5"></i>
                    <span>Agenda Google Calendar (Bulan Ini)</span>
                  </h6>
                  <span class="badge bg-light text-muted border">{{ googleEvents.length }} Acara Terdeteksi</span>
                </div>

                <div v-if="!googleUser" class="text-center py-5 bg-light rounded-4 border">
                  <i class="bi bi-calendar2-week text-muted display-4 mb-3 d-block"></i>
                  <h6 class="fw-bold text-dark">Hubungkan Akun Google Calendar Anda</h6>
                  <p class="text-muted small mb-3 max-w-md mx-auto">
                    Masuk dengan akun Google untuk melihat jadwal peluncuran kampanye, tenggat waktu proyek, dan menginput agenda langsung ke Google Calendar Anda.
                  </p>
                  <button class="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm" @click="handleGoogleSignIn">
                    <i class="bi bi-google me-1.5"></i> Hubungkan Sekarang
                  </button>
                </div>

                <div v-else-if="isLoadingGoogleEvents" class="text-center py-5">
                  <div class="spinner-border text-primary mb-2" role="status"></div>
                  <p class="text-muted small">Mengambil agenda dari Google Calendar...</p>
                </div>

                <div v-else-if="googleEvents.length === 0" class="text-center py-5 bg-light rounded-4 border">
                  <i class="bi bi-calendar-x text-muted fs-1 mb-2 d-block"></i>
                  <h6 class="fw-bold text-dark">Tidak Ada Agenda Mendatang</h6>
                  <p class="text-muted small mb-3">Google Calendar Anda kosong untuk periode ini.</p>
                  <button class="btn btn-sm btn-primary rounded-pill px-3.5 py-1.5 fw-bold" @click="openAddGoogleEventModal">
                    + Buat Agenda Pertama
                  </button>
                </div>

                <div v-else class="d-flex flex-column gap-2 overflow-y-auto" style="max-height: 480px;">
                  <div
                    v-for="evt in googleEvents"
                    :key="evt.id"
                    class="p-3 rounded-3 border bg-white shadow-xs d-flex justify-content-between align-items-start transition-all hover-elevate"
                  >
                    <div>
                      <div class="d-flex align-items-center gap-2 mb-1">
                        <span class="badge bg-primary-subtle text-primary border border-primary-subtle small">
                          <i class="bi bi-clock me-1"></i>{{ formatEventDate(evt) }}
                        </span>
                        <span v-if="evt.location" class="badge bg-light text-secondary border small text-truncate" style="max-width: 180px;">
                          <i class="bi bi-geo-alt me-1"></i>{{ evt.location }}
                        </span>
                      </div>
                      <strong class="text-dark d-block mb-1">{{ evt.summary || '(Tanpa Judul)' }}</strong>
                      <small class="text-muted d-block" v-if="evt.description">{{ evt.description }}</small>
                    </div>

                    <div class="d-flex align-items-center gap-1">
                      <a v-if="evt.htmlLink" :href="evt.htmlLink" target="_blank" class="btn btn-xs btn-outline-primary rounded-circle p-1" title="Buka di Google Calendar">
                        <i class="bi bi-box-arrow-up-right"></i>
                      </a>
                      <button class="btn btn-xs btn-outline-danger rounded-circle p-1" @click="handleDeleteGoogleEvent(evt)" title="Hapus dari Google Calendar">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Member Availability Status Live Board -->
            <div class="col-lg-5">
              <div class="card border rounded-4 shadow-xs p-3.5 bg-white h-100">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <i class="bi bi-person-badge-fill text-success fs-5"></i>
                    <span>Status Ketersediaan Anggota Tim</span>
                  </h6>
                  <button class="btn btn-xs btn-success rounded-pill px-2.5 py-1 fw-bold" @click="openStatusModal">
                    + Update Status
                  </button>
                </div>

                <div v-if="memberStatuses.length === 0" class="text-center py-5 bg-light rounded-4 border">
                  <i class="bi bi-person-slash text-muted fs-1 mb-2 d-block"></i>
                  <h6 class="fw-bold text-dark">Belum Ada Status Tim</h6>
                  <p class="text-muted small mb-3">Tambahkan status kehadiran harian (WFH, Cuti, Dinas Luar, Di Kantor).</p>
                  <button class="btn btn-xs btn-success rounded-pill px-3 py-1 fw-semibold" @click="openStatusModal">
                    Set Status Sekarang
                  </button>
                </div>

                <div v-else class="d-flex flex-column gap-2 overflow-y-auto" style="max-height: 480px;">
                  <div
                    v-for="m in memberStatuses"
                    :key="m.id"
                    class="p-2.5 rounded-3 border bg-light d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div class="d-flex align-items-center gap-2 mb-0.5">
                        <strong class="text-dark small">{{ m.name }}</strong>
                        <span class="badge" :class="getAvailabilityBadge(m.status)">{{ m.status }}</span>
                      </div>
                      <small class="text-muted d-block">{{ m.division }} <span v-if="m.note">• {{ m.note }}</span></small>
                    </div>
                    <button class="btn btn-xs btn-outline-danger border-0 p-1" @click="removeMemberStatus(m.id)">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- TAB 6: DIREKTORI KEAHLIAN & PENCARIAN KOMPETENSI         -->
        <!-- ======================================================== -->
        <div v-else-if="activeTab === 'expertise'">
          <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
            <div>
              <h5 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i class="bi bi-award-fill text-primary"></i>
                <span>Direktori Keahlian & Pencarian Kompetensi</span>
              </h5>
              <small class="text-muted">Cari rekan di divisi lain berdasarkan keahlian teknis (misal: Copywriting, Video Editing, Python, Pajak) untuk kolaborasi lintas tim cepat.</small>
            </div>
            <button class="btn btn-sm btn-primary rounded-pill px-3.5 py-1.5 fw-bold shadow-sm d-flex align-items-center gap-1" @click="openProfileModal">
              <i class="bi bi-person-plus"></i> Tambah Profil Keahlian
            </button>
          </div>

          <!-- Search & Skill Tags Filter -->
          <div class="row g-2 mb-3 align-items-center">
            <div class="col-md-6">
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-search text-muted"></i></span>
                <input
                  type="text"
                  class="form-control bg-light border-start-0"
                  placeholder="Ketik keahlian (Copywriting, Video, Python, Pajak) atau nama..."
                  v-model="skillSearch"
                />
              </div>
            </div>
            <div class="col-md-6 d-flex flex-wrap gap-1.5 justify-content-md-end">
              <span class="small text-muted align-self-center me-1">Pintasan Keahlian:</span>
              <button
                v-for="s in quickSkillTags"
                :key="s"
                class="btn btn-xs rounded-pill px-2.5 py-0.5"
                :class="skillSearch.toLowerCase() === s.toLowerCase() ? 'btn-primary text-white' : 'btn-light border text-secondary'"
                @click="skillSearch = skillSearch === s ? '' : s"
              >
                #{{ s }}
              </button>
            </div>
          </div>

          <!-- Profiles Grid -->
          <div v-if="filteredProfiles.length === 0" class="text-center py-5 bg-light rounded-4 border">
            <i class="bi bi-person-vcard text-muted fs-1 mb-2 d-block"></i>
            <h6 class="fw-bold text-dark">Belum Ada Profil Keahlian Terdaftar</h6>
            <p class="text-muted small mb-3">Daftarkan nama, divisi, dan keahlian Anda untuk mempermudah rekan kerja berkolaborasi.</p>
            <button class="btn btn-sm btn-primary rounded-pill px-4 fw-semibold" @click="openProfileModal">
              + Daftarkan Profil Saya
            </button>
          </div>

          <div v-else class="row g-3">
            <div v-for="p in filteredProfiles" :key="p.id" class="col-md-6 col-lg-4">
              <div class="card border rounded-4 shadow-xs h-100 bg-white p-3.5 d-flex flex-column justify-content-between transition-all hover-elevate">
                <div>
                  <div class="d-flex justify-content-between align-items-start mb-2.5">
                    <div class="d-flex align-items-center gap-2">
                      <div class="avatar-circle bg-primary-subtle text-primary fw-bold fs-5">
                        {{ (p.fullName || 'User').charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <strong class="d-block text-dark lh-sm">{{ p.fullName }}</strong>
                        <small class="text-muted">{{ p.roleTitle || 'Spesialis' }} • {{ p.department }}</small>
                      </div>
                    </div>
                    <button class="btn btn-sm btn-outline-danger border-0 p-1" @click="removeProfile(p.id)" title="Hapus Profil">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>

                  <p class="text-secondary small mb-2.5 lh-sm" style="min-height: 38px;">
                    {{ p.bio || 'Siap berkolaborasi dalam berbagai inisiatif proyek lintas divisi.' }}
                  </p>

                  <!-- Skills Badge List -->
                  <div class="d-flex flex-wrap gap-1 mb-3">
                    <span
                      v-for="(sk, idx) in (p.skills || [])"
                      :key="idx"
                      class="badge bg-info-subtle text-info-emphasis border border-info-subtle small cursor-pointer"
                      @click="skillSearch = sk"
                      :title="'Cari rekan dengan skill ' + sk"
                    >
                      #{{ sk }}
                    </span>
                  </div>
                </div>

                <!-- Footer Contact Actions -->
                <div class="border-top pt-2.5 d-flex gap-2">
                  <a v-if="p.phone" :href="'https://wa.me/' + cleanPhone(p.phone)" target="_blank" class="btn btn-xs btn-success rounded-pill flex-fill fw-bold py-1.5">
                    <i class="bi bi-whatsapp me-1"></i> WhatsApp
                  </a>
                  <a v-if="p.email" :href="'mailto:' + p.email" class="btn btn-xs btn-outline-primary rounded-pill flex-fill fw-bold py-1.5">
                    <i class="bi bi-envelope me-1"></i> Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODALS (REACTIVE VUE OVERLAYS)                           -->
    <!-- ======================================================== -->

    <!-- Modal 1: Buat / Edit Pengumuman -->
    <div v-if="showBulletinModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow-lg rounded-4 bg-white p-4 max-w-lg w-100 animate-scale">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <h5 class="fw-bold text-dark mb-0">📢 Buat Pengumuman Perusahaan</h5>
          <button class="btn-close" @click="showBulletinModal = false"></button>
        </div>
        <form @submit.prevent="submitBulletin">
          <div class="mb-3">
            <label class="form-label small fw-bold">Judul Pengumuman <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="bulletinForm.title" required placeholder="Contoh: Kebijakan Libur Nasional & Jam Kerja Q4" />
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-bold">Kategori</label>
              <select class="form-select" v-model="bulletinForm.category">
                <option value="Kebijakan Baru">Kebijakan Baru</option>
                <option value="Pencapaian Target">Pencapaian Target</option>
                <option value="Jadwal Libur">Jadwal Libur</option>
                <option value="Pengumuman Umum">Pengumuman Umum</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold">Prioritas</label>
              <select class="form-select" v-model="bulletinForm.priority">
                <option value="Mendesak">Mendesak</option>
                <option value="Penting">Penting</option>
                <option value="Info Biasa">Info Biasa</option>
              </select>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Target Divisi</label>
            <input type="text" class="form-control" v-model="bulletinForm.targetDivision" placeholder="Semua Divisi / Marketing & Sales" />
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Isi Informasi Lengkap <span class="text-danger">*</span></label>
            <textarea class="form-control" rows="4" v-model="bulletinForm.content" required placeholder="Tuliskan detail pengumuman resmi di sini..."></textarea>
          </div>
          <div class="d-flex justify-content-end gap-2 border-top pt-3">
            <button type="button" class="btn btn-sm btn-secondary rounded-pill px-3" @click="showBulletinModal = false">Batal</button>
            <button type="submit" class="btn btn-sm btn-danger rounded-pill px-4 fw-bold">Siarkan Pengumuman</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: Buat Saluran Diskusi Baru -->
    <div v-if="showChannelModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow-lg rounded-4 bg-white p-4 max-w-md w-100 animate-scale">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <h5 class="fw-bold text-dark mb-0">💬 Buat Saluran (Channel) Baru</h5>
          <button class="btn-close" @click="showChannelModal = false"></button>
        </div>
        <form @submit.prevent="submitChannel">
          <div class="mb-3">
            <label class="form-label small fw-bold">Nama Saluran <span class="text-danger">*</span></label>
            <div class="input-group">
              <span class="input-group-text">#</span>
              <input type="text" class="form-control" v-model="channelForm.name" required placeholder="Kampanye-Promo-Akhir-Tahun" />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Topik / Tujuan Kolaborasi</label>
            <input type="text" class="form-control" v-model="channelForm.topic" placeholder="Sinkronisasi budget & timeline promo Q4" />
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Divisi yang Terlibat (Pisahkan dengan koma)</label>
            <input type="text" class="form-control" v-model="channelForm.divisionsStr" placeholder="Marketing, Finance, Operasional" />
          </div>
          <div class="d-flex justify-content-end gap-2 border-top pt-3">
            <button type="button" class="btn btn-sm btn-secondary rounded-pill px-3" @click="showChannelModal = false">Batal</button>
            <button type="submit" class="btn btn-sm btn-primary rounded-pill px-4 fw-bold">Buat Saluran</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 3: Unggah Aset Bersama -->
    <div v-if="showAssetModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow-lg rounded-4 bg-white p-4 max-w-lg w-100 animate-scale">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <h5 class="fw-bold text-dark mb-0">📁 Unggah Aset / Dokumen Bersama</h5>
          <button class="btn-close" @click="showAssetModal = false"></button>
        </div>
        <form @submit.prevent="submitAsset">
          <div class="mb-3">
            <label class="form-label small fw-bold">Nama Dokumen / Aset <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="assetForm.title" required placeholder="Contoh: Official Brand Identity & Vector Logo 2026" />
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-bold">Kategori Aset</label>
              <select class="form-select" v-model="assetForm.category">
                <option value="Brand Guidelines">Brand Guidelines</option>
                <option value="Logo Resolusi Tinggi">Logo Resolusi Tinggi</option>
                <option value="Template Presentasi">Template Presentasi</option>
                <option value="SOP Perusahaan">SOP Perusahaan</option>
                <option value="Dokumen Legal">Dokumen Legal</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold">Tipe Berkas</label>
              <select class="form-select" v-model="assetForm.fileType">
                <option value="PDF">PDF</option>
                <option value="PNG/SVG">PNG / SVG</option>
                <option value="PPTX">PowerPoint (PPTX)</option>
                <option value="ZIP/RAR">ZIP / Arsip</option>
                <option value="DOCX">Word (DOCX)</option>
              </select>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">URL Tautan Unduh / File Online</label>
            <input type="url" class="form-control" v-model="assetForm.fileUrl" placeholder="https://drive.google.com/... atau URL dokumen" />
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Deskripsi Penggunaan</label>
            <textarea class="form-control" rows="2" v-model="assetForm.description" placeholder="Aset resmi untuk kop surat, materi promosi, dan kop presentasi..."></textarea>
          </div>
          <div class="d-flex justify-content-end gap-2 border-top pt-3">
            <button type="button" class="btn btn-sm btn-secondary rounded-pill px-3" @click="showAssetModal = false">Batal</button>
            <button type="submit" class="btn btn-sm btn-warning rounded-pill px-4 fw-bold text-dark">Simpan Aset</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 4: Buat Tiket Permintaan Lintas Divisi -->
    <div v-if="showTicketModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow-lg rounded-4 bg-white p-4 max-w-lg w-100 animate-scale">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <h5 class="fw-bold text-dark mb-0">🎫 Ajukan Tiket Permintaan Lintas Divisi</h5>
          <button class="btn-close" @click="showTicketModal = false"></button>
        </div>
        <form @submit.prevent="submitTicket">
          <div class="mb-3">
            <label class="form-label small fw-bold">Kebutuhan / Permintaan <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="ticketForm.title" required placeholder="Contoh: Desain Brosur Promosi Peluncuran Produk Baru" />
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-bold">Divisi Pemohon (Asal)</label>
              <select class="form-select" v-model="ticketForm.fromDepartment">
                <option value="Sales & Pemasaran">Sales & Pemasaran</option>
                <option value="Marketing">Marketing</option>
                <option value="Keuangan (Finance)">Keuangan (Finance)</option>
                <option value="Teknologi & IT">Teknologi & IT</option>
                <option value="Operasional & GA">Operasional & GA</option>
                <option value="Sumber Daya Manusia (HR)">HRD</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold">Divisi Tujuan (Penerima)</label>
              <select class="form-select" v-model="ticketForm.toDepartment">
                <option value="Marketing">Marketing</option>
                <option value="Keuangan (Finance)">Keuangan (Finance)</option>
                <option value="Teknologi & IT">Teknologi & IT</option>
                <option value="Operasional & GA">Operasional & GA</option>
                <option value="Sales & Pemasaran">Sales & Pemasaran</option>
                <option value="Sumber Daya Manusia (HR)">HRD</option>
              </select>
            </div>
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-bold">Tingkat Prioritas</label>
              <select class="form-select" v-model="ticketForm.priority">
                <option value="Mendesak">Mendesak</option>
                <option value="Tinggi">Tinggi</option>
                <option value="Sedang">Sedang</option>
                <option value="Rendah">Rendah</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold">Tenggat Waktu (Target)</label>
              <input type="date" class="form-control" v-model="ticketForm.dueDate" />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Rincian Instruksi / Catatan Kebutuhan</label>
            <textarea class="form-control" rows="3" v-model="ticketForm.description" placeholder="Jelaskan spesifikasi materi atau rincian pencairan yang dibutuhkan..."></textarea>
          </div>
          <div class="d-flex justify-content-end gap-2 border-top pt-3">
            <button type="button" class="btn btn-sm btn-secondary rounded-pill px-3" @click="showTicketModal = false">Batal</button>
            <button type="submit" class="btn btn-sm btn-success rounded-pill px-4 fw-bold">Kirim Tiket Permintaan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 5: Tambah Event ke Google Calendar -->
    <div v-if="showGoogleEventModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow-lg rounded-4 bg-white p-4 max-w-lg w-100 animate-scale">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <h5 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <i class="bi bi-google text-primary"></i> Tambah ke Google Calendar
          </h5>
          <button class="btn-close" @click="showGoogleEventModal = false"></button>
        </div>
        <form @submit.prevent="submitGoogleEvent">
          <div class="mb-3">
            <label class="form-label small fw-bold">Judul Agenda / Event <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="googleEventForm.summary" required placeholder="Contoh: Peluncuran Produk & Kampanye Akhir Tahun" />
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-bold">Waktu Mulai <span class="text-danger">*</span></label>
              <input type="datetime-local" class="form-control" v-model="googleEventForm.startDateTime" required />
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold">Waktu Selesai <span class="text-danger">*</span></label>
              <input type="datetime-local" class="form-control" v-model="googleEventForm.endDateTime" required />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Lokasi / Google Meet</label>
            <input type="text" class="form-control" v-model="googleEventForm.location" placeholder="Ruang Rapat Utama Lantai 4 / Google Meet" />
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Deskripsi Tambahan</label>
            <textarea class="form-control" rows="3" v-model="googleEventForm.description" placeholder="Tujuan rapat atau instruksi persiapan dokumen..."></textarea>
          </div>
          <div class="d-flex justify-content-end gap-2 border-top pt-3">
            <button type="button" class="btn btn-sm btn-secondary rounded-pill px-3" @click="showGoogleEventModal = false">Batal</button>
            <button type="submit" class="btn btn-sm btn-primary rounded-pill px-4 fw-bold">
              Simpan ke Google Calendar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 6: Update Status Ketersediaan Anggota -->
    <div v-if="showStatusModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow-lg rounded-4 bg-white p-4 max-w-md w-100 animate-scale">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <h5 class="fw-bold text-dark mb-0">👤 Update Status Kehadiran Saya</h5>
          <button class="btn-close" @click="showStatusModal = false"></button>
        </div>
        <form @submit.prevent="submitMemberStatus">
          <div class="mb-3">
            <label class="form-label small fw-bold">Nama Anggota Tim <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="statusForm.name" required />
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Divisi</label>
            <input type="text" class="form-control" v-model="statusForm.division" required placeholder="Marketing / Finance / Operasional" />
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Status Kehadiran</label>
            <select class="form-select" v-model="statusForm.status">
              <option value="Di Kantor">🏢 Di Kantor (Tersedia)</option>
              <option value="WFH">🏠 WFH (Bekerja dari Rumah)</option>
              <option value="Meeting">🤝 Sedang Meeting</option>
              <option value="Dinas Luar">🚗 Dinas Luar Kantor</option>
              <option value="Cuti">🌴 Sedang Cuti</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Catatan Singkat</label>
            <input type="text" class="form-control" v-model="statusForm.note" placeholder="Contoh: Meeting klien s/d jam 15:00" />
          </div>
          <div class="d-flex justify-content-end gap-2 border-top pt-3">
            <button type="button" class="btn btn-sm btn-secondary rounded-pill px-3" @click="showStatusModal = false">Batal</button>
            <button type="submit" class="btn btn-sm btn-success rounded-pill px-4 fw-bold">Simpan Status</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 7: Tambah Profil Direktori Keahlian -->
    <div v-if="showProfileModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow-lg rounded-4 bg-white p-4 max-w-lg w-100 animate-scale">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <h5 class="fw-bold text-dark mb-0">🌟 Tambah Profil Direktori Keahlian</h5>
          <button class="btn-close" @click="showProfileModal = false"></button>
        </div>
        <form @submit.prevent="submitProfile">
          <div class="mb-3">
            <label class="form-label small fw-bold">Nama Lengkap <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="profileForm.fullName" required placeholder="Nama lengkap karyawan" />
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-bold">Jabatan / Peran</label>
              <input type="text" class="form-control" v-model="profileForm.roleTitle" placeholder="Misal: Graphic Designer / Accountant" />
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold">Divisi</label>
              <input type="text" class="form-control" v-model="profileForm.department" placeholder="Marketing / Finance / IT" />
            </div>
          </div>
          <div class="row g-2 mb-3">
            <div class="col-6">
              <label class="form-label small fw-bold">WhatsApp / Telepon</label>
              <input type="tel" class="form-control" v-model="profileForm.phone" placeholder="0812..." />
            </div>
            <div class="col-6">
              <label class="form-label small fw-bold">Email Kantor</label>
              <input type="email" class="form-control" v-model="profileForm.email" placeholder="nama@perusahaan.com" />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Keahlian Khusus / Tags (Pisahkan dengan koma) <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="profileForm.skillsStr" required placeholder="Copywriting, Video Editing, Python, Tax Compliance, UI/UX" />
            <small class="text-muted" style="font-size: 11px;">Gunakan koma untuk memisahkan skill agar rekan tim mudah mencari kompetensi Anda.</small>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-bold">Bio / Portofolio Singkat</label>
            <textarea class="form-control" rows="2" v-model="profileForm.bio" placeholder="Pengalaman dalam mengedit video reel promosi dan penulisan naskah iklan..."></textarea>
          </div>
          <div class="d-flex justify-content-end gap-2 border-top pt-3">
            <button type="button" class="btn btn-sm btn-secondary rounded-pill px-3" @click="showProfileModal = false">Batal</button>
            <button type="submit" class="btn btn-sm btn-primary rounded-pill px-4 fw-bold">Simpan ke Direktori</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import {
  getBulletins,
  saveBulletin,
  deleteBulletin,
  getChannels,
  createChannel,
  deleteChannel,
  getMessages,
  sendMessage,
  getSharedAssets,
  saveSharedAsset,
  deleteSharedAsset,
  getTickets,
  saveTicket,
  updateTicketStatus,
  deleteTicket,
  getMemberStatuses,
  saveMemberStatus,
  deleteMemberStatus,
  getExpertProfiles,
  saveExpertProfile,
  deleteExpertProfile
} from '../utils/teamCollaborationStore';
import {
  auth,
  getCurrentGoogleUser,
  signInWithGoogleCalendar,
  signOutGoogle,
  fetchGoogleCalendarEvents,
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent
} from '../utils/googleCalendarService';

export default {
  name: 'TeamCollaborationView',
  setup() {
    const route = useRoute();
    const router = useRouter();

    const getTabFromRoute = () => {
      if (route.query.tab) return route.query.tab;
      const path = route.path;
      if (path.includes('bulletin')) return 'bulletin';
      if (path.includes('channels')) return 'channels';
      if (path.includes('assets')) return 'assets';
      if (path.includes('ticketing') || path.includes('requests')) return 'ticketing';
      if (path.includes('calendar')) return 'calendar';
      if (path.includes('expertise') || path.includes('directory')) return 'expertise';
      return 'bulletin';
    };

    const activeTab = ref(getTabFromRoute());

    watch(() => [route.path, route.query.tab], () => {
      activeTab.value = getTabFromRoute();
    });

    const switchTab = (tabId) => {
      activeTab.value = tabId;
      if (route.path !== `/team-${tabId}`) {
        router.push({ path: `/team-${tabId}` });
      }
    };

    const tabs = [
      { id: 'bulletin', label: '1. Pusat Pengumuman', icon: 'bi-megaphone-fill' },
      { id: 'channels', label: '2. Ruang Diskusi Saluran', icon: 'bi-hash' },
      { id: 'assets', label: '3. Repositori Aset', icon: 'bi-folder-symlink-fill' },
      { id: 'ticketing', label: '4. Tiket Lintas Divisi', icon: 'bi-ticket-perforated-fill' },
      { id: 'calendar', label: '5. Google Calendar & Tim', icon: 'bi-calendar-check-fill' },
      { id: 'expertise', label: '6. Direktori Keahlian', icon: 'bi-award-fill' }
    ];

    // --- Google Calendar State ---
    const googleUser = ref(getCurrentGoogleUser());
    const isGoogleConnecting = ref(false);
    const isLoadingGoogleEvents = ref(false);
    const googleEvents = ref([]);
    const showGoogleEventModal = ref(false);
    const googleEventForm = ref({
      summary: '',
      startDateTime: '',
      endDateTime: '',
      location: '',
      description: ''
    });

    const handleGoogleSignIn = async () => {
      isGoogleConnecting.value = true;
      try {
        const res = await signInWithGoogleCalendar();
        if (res.success) {
          googleUser.value = res.user;
          Swal.fire({
            icon: 'success',
            title: 'Terhubung ke Google Calendar',
            text: `Selamat datang, ${res.user.displayName || res.user.email}! Google Calendar Anda telah siap disinkronkan.`,
            confirmButtonColor: '#2563eb'
          });
          loadGoogleEvents();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Menghubungkan',
            text: res.error,
            confirmButtonColor: '#ef4444'
          });
        }
      } finally {
        isGoogleConnecting.value = false;
      }
    };

    const handleGoogleSignOut = async () => {
      await signOutGoogle();
      googleUser.value = null;
      googleEvents.value = [];
      Swal.fire({
        icon: 'info',
        title: 'Akun Google Diputus',
        text: 'Sesi Google Calendar Anda telah selesai.',
        confirmButtonColor: '#2563eb'
      });
    };

    const loadGoogleEvents = async () => {
      if (!googleUser.value) return;
      isLoadingGoogleEvents.value = true;
      try {
        const events = await fetchGoogleCalendarEvents();
        googleEvents.value = events;
      } catch (err) {
        console.error('Error fetching calendar events:', err);
        Swal.fire({
          icon: 'warning',
          title: 'Perhatian',
          text: err.message || 'Gagal memuat agenda Google Calendar.',
          confirmButtonColor: '#2563eb'
        });
      } finally {
        isLoadingGoogleEvents.value = false;
      }
    };

    const openAddGoogleEventModal = () => {
      const now = new Date();
      const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
      const toIsoLocal = (d) => {
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };

      googleEventForm.value = {
        summary: '',
        startDateTime: toIsoLocal(now),
        endDateTime: toIsoLocal(inOneHour),
        location: '',
        description: ''
      };
      showGoogleEventModal.value = true;
    };

    const submitGoogleEvent = async () => {
      try {
        const payload = {
          summary: googleEventForm.value.summary,
          location: googleEventForm.value.location,
          description: googleEventForm.value.description,
          start: {
            dateTime: new Date(googleEventForm.value.startDateTime).toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          end: {
            dateTime: new Date(googleEventForm.value.endDateTime).toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        };

        const res = await createGoogleCalendarEvent(payload);
        if (!res?.cancelled) {
          showGoogleEventModal.value = false;
          Swal.fire({
            icon: 'success',
            title: 'Berhasil Ditambahkan',
            text: 'Agenda telah berhasil disinkronkan ke Google Calendar Anda.',
            confirmButtonColor: '#2563eb'
          });
          loadGoogleEvents();
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menambah Agenda',
          text: err.message,
          confirmButtonColor: '#ef4444'
        });
      }
    };

    const handleDeleteGoogleEvent = async (evt) => {
      try {
        const res = await deleteGoogleCalendarEvent(evt.id, evt.summary);
        if (res?.success) {
          Swal.fire({
            icon: 'success',
            title: 'Dihapus',
            text: 'Agenda telah dihapus dari Google Calendar.',
            confirmButtonColor: '#2563eb'
          });
          loadGoogleEvents();
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: err.message,
          confirmButtonColor: '#ef4444'
        });
      }
    };

    const formatEventDate = (evt) => {
      const start = evt.start?.dateTime || evt.start?.date;
      if (!start) return '-';
      const d = new Date(start);
      return d.toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: evt.start?.dateTime ? '2-digit' : undefined,
        minute: evt.start?.dateTime ? '2-digit' : undefined
      });
    };

    // --- 1. Bulletins ---
    const bulletins = ref(getBulletins());
    const selectedBulletinCat = ref('Semua');
    const bulletinCategories = ['Semua', 'Kebijakan Baru', 'Pencapaian Target', 'Jadwal Libur', 'Pengumuman Umum'];
    const showBulletinModal = ref(false);
    const bulletinForm = ref({
      id: null,
      title: '',
      category: 'Kebijakan Baru',
      priority: 'Penting',
      targetDivision: 'Semua Divisi',
      content: '',
      author: 'Arif Permana Putrasuryana',
      authorRole: 'CFO / Manajemen'
    });

    const filteredBulletins = computed(() => {
      if (selectedBulletinCat.value === 'Semua') return bulletins.value;
      return bulletins.value.filter(b => b.category === selectedBulletinCat.value);
    });

    const openBulletinModal = (item = null) => {
      if (item) {
        bulletinForm.value = { ...item };
      } else {
        bulletinForm.value = {
          id: null,
          title: '',
          category: 'Kebijakan Baru',
          priority: 'Penting',
          targetDivision: 'Semua Divisi',
          content: '',
          author: 'Arif Permana Putrasuryana',
          authorRole: 'CFO / Manajemen'
        };
      }
      showBulletinModal.value = true;
    };

    const submitBulletin = () => {
      bulletins.value = saveBulletin(bulletinForm.value);
      showBulletinModal.value = false;
      Swal.fire({
        icon: 'success',
        title: 'Pengumuman Disiarkan',
        text: 'Seluruh divisi kini dapat melihat pembaruan informasi ini secara langsung.',
        confirmButtonColor: '#2563eb'
      });
    };

    const removeBulletin = (id) => {
      Swal.fire({
        title: 'Hapus Pengumuman?',
        text: 'Informasi ini akan ditarik dari papan buletin.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus'
      }).then(res => {
        if (res.isConfirmed) {
          bulletins.value = deleteBulletin(id);
        }
      });
    };

    const broadcastNotification = (b) => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`📢 Pengumuman: ${b.title}`, {
          body: b.content.substring(0, 100) + '...',
          icon: '/favicon.ico'
        });
      }
      Swal.fire({
        icon: 'success',
        title: 'Pemberitahuan Terkirim',
        text: `Peringatan untuk pengumuman "${b.title}" berhasil disiarkan kembali.`,
        confirmButtonColor: '#2563eb'
      });
    };

    // --- 2. Channels & Discussion ---
    const channels = ref(getChannels());
    const selectedChannelId = ref(channels.value[0]?.id || null);
    const activeMessages = ref([]);
    const showChannelModal = ref(false);
    const channelForm = ref({ name: '', topic: '', divisionsStr: 'Marketing, Finance, Operasional' });
    const newMessageText = ref('');
    const attachedFileName = ref('');

    const activeChannel = computed(() => channels.value.find(c => c.id === selectedChannelId.value));

    const selectChannel = (id) => {
      selectedChannelId.value = id;
      activeMessages.value = getMessages(id);
    };

    const openChannelModal = () => {
      channelForm.value = { name: '', topic: '', divisionsStr: 'Marketing, Finance, Operasional' };
      showChannelModal.value = true;
    };

    const submitChannel = () => {
      const divs = channelForm.value.divisionsStr.split(',').map(s => s.trim()).filter(Boolean);
      const created = createChannel({
        name: channelForm.value.name,
        topic: channelForm.value.topic,
        divisions: divs
      });
      channels.value = getChannels();
      selectedChannelId.value = created.id;
      activeMessages.value = [];
      showChannelModal.value = false;
    };

    const removeChannel = (id) => {
      Swal.fire({
        title: 'Hapus Saluran?',
        text: 'Semua obrolan di saluran ini akan dihapus.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus Saluran'
      }).then(res => {
        if (res.isConfirmed) {
          channels.value = deleteChannel(id);
          selectedChannelId.value = channels.value[0]?.id || null;
          if (selectedChannelId.value) {
            activeMessages.value = getMessages(selectedChannelId.value);
          } else {
            activeMessages.value = [];
          }
        }
      });
    };

    const handleSendMessage = () => {
      if (!selectedChannelId.value || !newMessageText.value.trim()) return;
      sendMessage(selectedChannelId.value, {
        senderName: 'Arif Permana Putrasuryana',
        senderRole: 'CFO',
        senderDivision: 'Keuangan',
        text: newMessageText.value.trim(),
        attachmentName: attachedFileName.value
      });
      newMessageText.value = '';
      attachedFileName.value = '';
      activeMessages.value = getMessages(selectedChannelId.value);
    };

    const attachFilePrompt = () => {
      Swal.fire({
        title: 'Lampirkan Aset / Tautan',
        input: 'text',
        inputPlaceholder: 'Nama file atau link lampiran...',
        showCancelButton: true,
        confirmButtonText: 'Lampirkan'
      }).then(res => {
        if (res.isConfirmed && res.value) {
          attachedFileName.value = res.value;
        }
      });
    };

    // --- 3. Shared Assets Hub ---
    const sharedAssets = ref(getSharedAssets());
    const assetSearch = ref('');
    const selectedAssetCat = ref('Semua');
    const assetCategories = ['Semua', 'Brand Guidelines', 'Logo Resolusi Tinggi', 'Template Presentasi', 'SOP Perusahaan', 'Dokumen Legal'];
    const showAssetModal = ref(false);
    const assetForm = ref({
      title: '',
      category: 'Brand Guidelines',
      fileType: 'PDF',
      fileUrl: '',
      description: ''
    });

    const filteredAssets = computed(() => {
      return sharedAssets.value.filter(a => {
        const matchCat = selectedAssetCat.value === 'Semua' || a.category === selectedAssetCat.value;
        const matchSearch = !assetSearch.value || (
          a.title.toLowerCase().includes(assetSearch.value.toLowerCase()) ||
          a.description?.toLowerCase().includes(assetSearch.value.toLowerCase()) ||
          a.fileType.toLowerCase().includes(assetSearch.value.toLowerCase())
        );
        return matchCat && matchSearch;
      });
    });

    const openAssetModal = () => {
      assetForm.value = {
        title: '',
        category: 'Brand Guidelines',
        fileType: 'PDF',
        fileUrl: '',
        description: ''
      };
      showAssetModal.value = true;
    };

    const submitAsset = () => {
      sharedAssets.value = saveSharedAsset(assetForm.value);
      showAssetModal.value = false;
      Swal.fire({
        icon: 'success',
        title: 'Aset Disimpan',
        text: 'Seluruh divisi sekarang dapat mengunduh aset resmi ini secara terpusat.',
        confirmButtonColor: '#2563eb'
      });
    };

    const removeAsset = (id) => {
      Swal.fire({
        title: 'Hapus Aset?',
        text: 'Aset ini akan dihapus dari perpustakaan digital perusahaan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus'
      }).then(res => {
        if (res.isConfirmed) {
          sharedAssets.value = deleteSharedAsset(id);
        }
      });
    };

    const copyAssetLink = (a) => {
      const url = a.fileUrl || window.location.href;
      navigator.clipboard.writeText(url);
      Swal.fire({
        icon: 'info',
        title: 'Tautan Disalin',
        text: 'Tautan unduhan aset berhasil disalin ke clipboard.',
        timer: 1500,
        showConfirmButton: false
      });
    };

    // --- 4. Internal Ticketing ---
    const tickets = ref(getTickets());
    const selectedTicketStatus = ref('Semua');
    const ticketStatuses = ['Semua', 'Menunggu', 'Sedang Dikerjakan', 'Selesai', 'Ditolak'];
    const showTicketModal = ref(false);
    const ticketForm = ref({
      title: '',
      fromDepartment: 'Sales & Pemasaran',
      toDepartment: 'Marketing',
      priority: 'Tinggi',
      dueDate: '',
      description: ''
    });

    const filteredTickets = computed(() => {
      if (selectedTicketStatus.value === 'Semua') return tickets.value;
      return tickets.value.filter(t => t.status === selectedTicketStatus.value);
    });

    const openTicketModal = () => {
      ticketForm.value = {
        title: '',
        fromDepartment: 'Sales & Pemasaran',
        toDepartment: 'Marketing',
        priority: 'Tinggi',
        dueDate: '',
        description: ''
      };
      showTicketModal.value = true;
    };

    const submitTicket = () => {
      tickets.value = saveTicket(ticketForm.value);
      showTicketModal.value = false;
      Swal.fire({
        icon: 'success',
        title: 'Tiket Berhasil Diajukan',
        text: 'Divisi tujuan telah menerima notifikasi permohonan alur kerja ini.',
        confirmButtonColor: '#2563eb'
      });
    };

    const onTicketStatusChange = (id, newStatus) => {
      tickets.value = updateTicketStatus(id, newStatus);
      Swal.fire({
        icon: 'info',
        title: 'Status Diperbarui',
        text: `Status tiket berhasil diubah menjadi: ${newStatus}`,
        timer: 1500,
        showConfirmButton: false
      });
    };

    const removeTicket = (id) => {
      Swal.fire({
        title: 'Hapus Tiket?',
        text: 'Catatan permintaan ini akan dihapus dari sistem workflow.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus'
      }).then(res => {
        if (res.isConfirmed) {
          tickets.value = deleteTicket(id);
        }
      });
    };

    // --- 5. Member Availability Status ---
    const memberStatuses = ref(getMemberStatuses());
    const showStatusModal = ref(false);
    const statusForm = ref({
      name: 'Arif Permana Putrasuryana',
      division: 'Keuangan & Eksekutif',
      status: 'Di Kantor',
      note: ''
    });

    const openStatusModal = () => {
      showStatusModal.value = true;
    };

    const submitMemberStatus = () => {
      memberStatuses.value = saveMemberStatus(statusForm.value);
      showStatusModal.value = false;
      Swal.fire({
        icon: 'success',
        title: 'Status Kehadiran Disimpan',
        text: 'Rekan tim dapat melihat jadwal dan ketersediaan Anda.',
        timer: 1500,
        showConfirmButton: false
      });
    };

    const removeMemberStatus = (id) => {
      memberStatuses.value = deleteMemberStatus(id);
    };

    // --- 6. Skill & Expertise Directory ---
    const expertProfiles = ref(getExpertProfiles());
    const skillSearch = ref('');
    const quickSkillTags = ['Copywriting', 'Video Editing', 'Python', 'Tax Compliance', 'UI/UX', 'SEO', 'Public Speaking'];
    const showProfileModal = ref(false);
    const profileForm = ref({
      fullName: 'Arif Permana Putrasuryana',
      roleTitle: 'Chief Financial Officer',
      department: 'Keuangan',
      phone: '081234567890',
      email: 'arif@perusahaan.com',
      skillsStr: 'Financial Modeling, Tax Compliance, Budgeting, Investment Strategy',
      bio: ''
    });

    const filteredProfiles = computed(() => {
      if (!skillSearch.value.trim()) return expertProfiles.value;
      const q = skillSearch.value.toLowerCase();
      return expertProfiles.value.filter(p => {
        const inSkills = (p.skills || []).some(s => s.toLowerCase().includes(q));
        const inName = p.fullName?.toLowerCase().includes(q);
        const inDept = p.department?.toLowerCase().includes(q);
        const inRole = p.roleTitle?.toLowerCase().includes(q);
        return inSkills || inName || inDept || inRole;
      });
    });

    const openProfileModal = () => {
      profileForm.value = {
        fullName: 'Arif Permana Putrasuryana',
        roleTitle: 'Chief Financial Officer',
        department: 'Keuangan',
        phone: '081234567890',
        email: 'arif@perusahaan.com',
        skillsStr: 'Financial Modeling, Tax Compliance, Budgeting, Investment Strategy',
        bio: ''
      };
      showProfileModal.value = true;
    };

    const submitProfile = () => {
      const skillsArr = profileForm.value.skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      expertProfiles.value = saveExpertProfile({
        fullName: profileForm.value.fullName,
        roleTitle: profileForm.value.roleTitle,
        department: profileForm.value.department,
        phone: profileForm.value.phone,
        email: profileForm.value.email,
        skills: skillsArr,
        bio: profileForm.value.bio
      });
      showProfileModal.value = false;
      Swal.fire({
        icon: 'success',
        title: 'Profil Keahlian Disimpan',
        text: 'Keahlian Anda sekarang dapat ditemukan oleh tim lain yang membutuhkan kolaborasi.',
        confirmButtonColor: '#2563eb'
      });
    };

    const removeProfile = (id) => {
      Swal.fire({
        title: 'Hapus Profil?',
        text: 'Profil ini akan ditarik dari direktori keahlian tim.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus'
      }).then(res => {
        if (res.isConfirmed) {
          expertProfiles.value = deleteExpertProfile(id);
        }
      });
    };

    const cleanPhone = (phone) => {
      if (!phone) return '';
      let p = phone.replace(/[^0-9]/g, '');
      if (p.startsWith('0')) p = '62' + p.substring(1);
      return p;
    };

    // Styling Helpers
    const getPriorityClass = (priority) => {
      switch (priority) {
        case 'Mendesak': return 'bg-danger text-white';
        case 'Tinggi':
        case 'Penting': return 'bg-warning text-dark';
        case 'Sedang': return 'bg-info text-dark';
        default: return 'bg-secondary text-white';
      }
    };

    const getTicketStatusClass = (status) => {
      switch (status) {
        case 'Menunggu': return 'bg-warning-subtle text-warning-emphasis border-warning-subtle';
        case 'Sedang Dikerjakan': return 'bg-primary-subtle text-primary border-primary-subtle';
        case 'Selesai': return 'bg-success-subtle text-success border-success-subtle';
        case 'Ditolak': return 'bg-danger-subtle text-danger border-danger-subtle';
        default: return 'bg-light text-dark';
      }
    };

    const getAvailabilityBadge = (status) => {
      switch (status) {
        case 'Di Kantor': return 'bg-success text-white';
        case 'WFH': return 'bg-primary text-white';
        case 'Meeting': return 'bg-warning text-dark';
        case 'Dinas Luar': return 'bg-info text-dark';
        case 'Cuti': return 'bg-secondary text-white';
        default: return 'bg-light text-dark';
      }
    };

    onMounted(() => {
      if (selectedChannelId.value) {
        activeMessages.value = getMessages(selectedChannelId.value);
      }
      if (auth.currentUser) {
        googleUser.value = auth.currentUser;
        loadGoogleEvents();
      }
    });

    return {
      activeTab,
      tabs,
      googleUser,
      isGoogleConnecting,
      isLoadingGoogleEvents,
      googleEvents,
      showGoogleEventModal,
      googleEventForm,
      handleGoogleSignIn,
      handleGoogleSignOut,
      loadGoogleEvents,
      openAddGoogleEventModal,
      submitGoogleEvent,
      handleDeleteGoogleEvent,
      formatEventDate,
      bulletins,
      selectedBulletinCat,
      bulletinCategories,
      filteredBulletins,
      showBulletinModal,
      bulletinForm,
      openBulletinModal,
      submitBulletin,
      removeBulletin,
      broadcastNotification,
      channels,
      selectedChannelId,
      activeChannel,
      activeMessages,
      showChannelModal,
      channelForm,
      newMessageText,
      attachedFileName,
      selectChannel,
      openChannelModal,
      submitChannel,
      removeChannel,
      handleSendMessage,
      attachFilePrompt,
      sharedAssets,
      assetSearch,
      selectedAssetCat,
      assetCategories,
      filteredAssets,
      showAssetModal,
      assetForm,
      openAssetModal,
      submitAsset,
      removeAsset,
      copyAssetLink,
      tickets,
      selectedTicketStatus,
      ticketStatuses,
      filteredTickets,
      showTicketModal,
      ticketForm,
      openTicketModal,
      submitTicket,
      onTicketStatusChange,
      removeTicket,
      memberStatuses,
      showStatusModal,
      statusForm,
      openStatusModal,
      submitMemberStatus,
      removeMemberStatus,
      expertProfiles,
      skillSearch,
      quickSkillTags,
      showProfileModal,
      profileForm,
      filteredProfiles,
      openProfileModal,
      submitProfile,
      removeProfile,
      cleanPhone,
      getPriorityClass,
      getTicketStatusClass,
      getAvailabilityBadge,
      switchTab
    };
  }
};
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 1060;
}

.max-w-md { max-width: 440px; }
.max-w-lg { max-width: 580px; }
.avatar-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hover-elevate {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-elevate:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.08) !important;
}

.animate-scale {
  animation: scaleIn 0.2s ease-out;
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
</style>
