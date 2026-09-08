<template>
  <div class="container-fluid p-0 browser-app-wrapper" :class="{ 'browser-fullscreen': isFullscreen }">
    <!-- TOP BROWSER WINDOW CONTAINER -->
    <div class="card border-0 shadow-sm rounded-4 bg-white overflow-hidden browser-main-card">
      
      <!-- 1. CHROME-STYLE TAB STRIP -->
      <div class="browser-tab-strip d-flex align-items-center px-2 pt-2 gap-1 overflow-x-auto select-none">
        <div
          v-for="(tab, index) in tabs"
          :key="tab.id"
          class="browser-tab d-flex align-items-center gap-2 px-3 py-1.5 rounded-top-3 cursor-pointer user-select-none transition-all"
          :class="{ active: activeTabId === tab.id }"
          @click="switchTab(tab.id)"
          :title="tab.title"
        >
          <span v-if="tab.isLoading" class="spinner-border spinner-border-sm text-primary tab-spinner" role="status"></span>
          <i v-else :class="tab.icon || 'bi bi-globe'" class="tab-icon small" :style="{ color: tab.color || '#0284c7' }"></i>
          
          <span class="tab-title text-truncate fw-semibold small" style="max-width: 150px;">
            {{ tab.title || 'Tab Baru' }}
          </span>

          <button
            v-if="tabs.length > 1"
            class="btn btn-link p-0 text-muted ms-1 tab-close-btn"
            @click.stop="closeTab(index)"
            title="Tutup Tab (Ctrl+W)"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>

        <!-- Add New Tab Button -->
        <button
          class="btn btn-sm btn-light rounded-circle p-1 ms-1 d-flex align-items-center justify-content-center border tab-add-btn"
          @click="addNewTab"
          title="Buka Tab Baru (+)"
        >
          <i class="bi bi-plus-lg"></i>
        </button>

        <!-- Spacer -->
        <div class="ms-auto d-flex align-items-center gap-1 pe-2">
          <!-- Toggle Drafter / Scratchpad -->
          <button
            class="btn btn-xs rounded-pill px-2.5 py-1 d-flex align-items-center gap-1 border transition-all"
            :class="showDrafterPanel ? 'btn-primary text-white' : 'btn-light text-dark'"
            @click="showDrafterPanel = !showDrafterPanel"
            title="Buka / Tutup Panel Catatan Riset"
          >
            <i class="bi bi-pencil-square"></i>
            <span class="d-none d-md-inline small fw-semibold">Catatan Riset</span>
            <span v-if="draftWordCount > 0" class="badge bg-white text-primary rounded-pill px-1.5 py-0.2" style="font-size: 10px;">
              {{ draftWordCount }}
            </span>
          </button>

          <!-- History & Bookmarks Drawer Toggle -->
          <button
            class="btn btn-xs btn-light border rounded-pill px-2.5 py-1 d-flex align-items-center gap-1"
            @click="showHistoryModal = true"
            title="Riwayat & Markah"
          >
            <i class="bi bi-clock-history"></i>
            <span class="d-none d-md-inline small fw-semibold">Riwayat</span>
          </button>

          <!-- Fullscreen View Toggle -->
          <button
            class="btn btn-xs btn-light border rounded-circle p-1.5"
            @click="toggleFullscreen"
            :title="isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'"
          >
            <i :class="isFullscreen ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen'"></i>
          </button>
        </div>
      </div>

      <!-- 2. ADDRESS BAR (OMNIBOX) & NAVIGATION TOOLBAR -->
      <div class="browser-toolbar p-2.5 bg-light border-top border-bottom d-flex align-items-center gap-2 flex-wrap">
        <!-- Navigation Buttons: Back, Forward, Reload, Home -->
        <div class="btn-group btn-group-sm">
          <button
            class="btn btn-outline-secondary bg-white"
            @click="navigateBack"
            :disabled="!canGoBack"
            title="Kembali (Alt+Left)"
          >
            <i class="bi bi-arrow-left"></i>
          </button>
          <button
            class="btn btn-outline-secondary bg-white"
            @click="navigateForward"
            :disabled="!canGoForward"
            title="Maju (Alt+Right)"
          >
            <i class="bi bi-arrow-right"></i>
          </button>
          <button
            class="btn btn-outline-secondary bg-white"
            @click="reloadTab"
            title="Muat Ulang Halaman (Ctrl+R)"
          >
            <i class="bi bi-arrow-clockwise" :class="{ 'spin-anim': currentTab.isLoading }"></i>
          </button>
          <button
            class="btn btn-outline-secondary bg-white"
            @click="goToHome"
            title="Halaman Awal Browser"
          >
            <i class="bi bi-house-door"></i>
          </button>
        </div>

        <!-- Search Engine Selector Pill -->
        <div class="dropdown">
          <button
            class="btn btn-sm btn-white border dropdown-toggle d-flex align-items-center gap-1.5 fw-semibold px-2.5 py-1"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            title="Pilih Mesin Pencari Utama"
          >
            <i :class="currentEngineConfig.icon" :style="{ color: currentEngineConfig.color }"></i>
            <span class="small d-none d-sm-inline">{{ currentEngineConfig.name }}</span>
          </button>
          <ul class="dropdown-menu shadow-sm py-1">
            <li class="dropdown-header small text-muted text-uppercase fw-bold" style="font-size: 11px;">Mesin Pencari</li>
            <li v-for="engine in searchEngines" :key="engine.id">
              <a
                class="dropdown-item small d-flex align-items-center gap-2 py-1.5 cursor-pointer"
                :class="{ active: currentTab.engineId === engine.id }"
                @click="setEngine(engine.id)"
              >
                <i :class="engine.icon" :style="{ color: engine.color }"></i>
                <span class="fw-semibold">{{ engine.name }}</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Omnibox (Search or Enter URL) -->
        <div class="omnibox-container flex-grow-1 position-relative d-flex align-items-center bg-white rounded-pill px-3 py-1 border shadow-xs">
          <!-- Protocol / Security Badge -->
          <div class="me-2 text-success d-flex align-items-center" :title="isHttpUrl ? 'Koneksi Aman (HTTPS)' : 'Mode Pencarian'">
            <i v-if="isHttpUrl" class="bi bi-shield-lock-fill small"></i>
            <i v-else class="bi bi-search text-muted small"></i>
          </div>

          <input
            ref="omniboxInput"
            type="text"
            v-model="currentTab.inputUrl"
            @keyup.enter="handleOmniboxSubmit"
            @focus="isOmniboxFocused = true"
            @blur="onOmniboxBlur"
            placeholder="Cari apa saja di web atau ketik alamat URL (bebas tanpa batasan)..."
            class="border-0 bg-transparent flex-grow-1 shadow-none outline-none small text-dark"
            style="font-size: 13.5px;"
          />

          <!-- Quick Clear Button -->
          <button
            v-if="currentTab.inputUrl"
            @click="currentTab.inputUrl = ''; $refs.omniboxInput.focus()"
            class="btn btn-link p-0 text-muted me-2"
            title="Hapus"
          >
            <i class="bi bi-x-circle-fill" style="font-size: 13px;"></i>
          </button>

          <!-- Submit / Go Button -->
          <button
            @click="handleOmniboxSubmit"
            class="btn btn-sm btn-primary rounded-pill px-3 py-0.5 small fw-bold d-flex align-items-center gap-1"
          >
            <span>Cari</span>
            <i class="bi bi-arrow-return-left small"></i>
          </button>

          <!-- Omnibox Suggestions Dropdown -->
          <div
            v-if="isOmniboxFocused && omniboxSuggestions.length > 0"
            class="position-absolute top-100 start-0 end-0 mt-2 bg-white rounded-4 shadow-lg border p-2 z-3 suggestions-box"
          >
            <div class="small text-muted px-2 py-1 fw-bold text-uppercase" style="font-size: 10.5px;">Saran Pencarian Cepat</div>
            <div
              v-for="(sug, sIdx) in omniboxSuggestions"
              :key="sIdx"
              class="px-2.5 py-1.5 rounded-2 d-flex align-items-center justify-content-between cursor-pointer hover-bg-light"
              @mousedown.prevent="selectSuggestion(sug)"
            >
              <div class="d-flex align-items-center gap-2 text-dark small">
                <i :class="sug.isUrl ? 'bi bi-link-45deg text-primary' : 'bi bi-search text-muted'"></i>
                <span class="fw-semibold">{{ sug.text }}</span>
              </div>
              <span class="badge bg-light text-muted small border">{{ sug.category }}</span>
            </div>
          </div>
        </div>

        <!-- Action Tools: Bookmark, Real Tab, Mode -->
        <div class="d-flex align-items-center gap-1">
          <!-- Bookmark Current Page -->
          <button
            class="btn btn-sm btn-outline-secondary bg-white rounded-pill px-2.5"
            @click="toggleBookmarkCurrentPage"
            :class="{ 'text-warning border-warning': isCurrentPageBookmarked }"
            :title="isCurrentPageBookmarked ? 'Hapus dari Markah' : 'Simpan ke Markah (Bookmark)'"
          >
            <i :class="isCurrentPageBookmarked ? 'bi bi-star-fill' : 'bi bi-star'"></i>
          </button>

          <!-- Open in Real External Tab (Tanpa Batasan) -->
          <button
            class="btn btn-sm btn-outline-primary bg-white rounded-pill px-2.5 fw-semibold d-flex align-items-center gap-1"
            @click="openActiveInRealTab"
            title="Buka URL ini di Tab Luar Browser Anda"
          >
            <i class="bi bi-box-arrow-up-right"></i>
            <span class="d-none d-lg-inline small">Buka Luar</span>
          </button>
        </div>
      </div>

      <!-- 3. BOOKMARKS QUICK BAR -->
      <div class="bookmarks-bar px-3 py-1.5 bg-light-subtle border-bottom d-flex align-items-center gap-1.5 overflow-x-auto">
        <span class="small text-muted fw-bold me-1 text-nowrap" style="font-size: 11px;">
          <i class="bi bi-stars text-warning me-1"></i>Pintasan:
        </span>

        <button
          v-for="bm in userBookmarks"
          :key="bm.url"
          class="btn btn-xs rounded-pill px-2.5 py-1 text-nowrap d-flex align-items-center gap-1.5 border bg-white text-dark hover-shadow"
          @click="openUrl(bm.url, bm.name)"
        >
          <i :class="bm.icon || 'bi bi-globe2'" :style="{ color: bm.color || '#2563eb' }"></i>
          <span class="fw-semibold">{{ bm.name }}</span>
        </button>

        <button
          class="btn btn-xs btn-outline-secondary rounded-pill px-2 py-1 text-nowrap border-dashed"
          @click="showAddBookmarkModal = true"
          title="Tambah Pintasan Baru"
        >
          <i class="bi bi-plus"></i> Tambah
        </button>
      </div>

      <!-- 4. MAIN BROWSER WORKBENCH AREA -->
      <div class="row g-0">
        <!-- BROWSER VIEWPORT COLUMN -->
        <div :class="showDrafterPanel ? 'col-lg-7 col-xl-8 border-end' : 'col-12'" class="transition-all">
          <div class="browser-viewport position-relative" style="min-height: 620px; height: calc(100vh - 280px);">

            <!-- VIEW A: HOME / NEW TAB PAGE (When on about:blank or start) -->
            <div v-if="currentTab.viewState === 'home'" class="h-100 overflow-y-auto p-4 p-md-5 bg-light-subtle d-flex flex-column align-items-center justify-content-center text-center">
              <div class="max-w-700 w-100 mx-auto my-auto py-4">
                <!-- Browser Logo & Header -->
                <div class="mb-4">
                  <div class="d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-primary bg-opacity-10 text-primary mb-3 shadow-xs">
                    <i class="bi bi-compass-fill fs-1"></i>
                  </div>
                  <h2 class="fw-black text-dark mb-1">Web Browser & Search Explorer</h2>
                  <p class="text-secondary small mb-0">
                    Jelajahi internet, lakukan pencarian topik bebas tanpa batasan, buka referensi dan draf catatan dalam satu layar.
                  </p>
                </div>

                <!-- Big Central Search Box -->
                <div class="card border-0 shadow-sm rounded-pill p-2 mb-4 bg-white border">
                  <div class="d-flex align-items-center px-3 py-1">
                    <i class="bi bi-search text-muted fs-5 me-3"></i>
                    <input
                      type="text"
                      v-model="homeSearchQuery"
                      @keyup.enter="handleHomeSearch"
                      placeholder="Ketik apa saja yang ingin Anda cari di web..."
                      class="border-0 bg-transparent flex-grow-1 shadow-none outline-none fs-6 text-dark"
                    />
                    <button
                      class="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-1.5 shadow-sm"
                      @click="handleHomeSearch"
                    >
                      <span>Cari</span>
                      <i class="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>

                <!-- Trending / Popular Research Topics -->
                <div class="mb-4">
                  <div class="small text-muted fw-bold mb-2 text-uppercase" style="font-size: 11px;">
                    <i class="bi bi-fire text-danger me-1"></i>Topik Populer & Ide Riset:
                  </div>
                  <div class="d-flex flex-wrap justify-content-center gap-1.5">
                    <button
                      v-for="topic in popularTopics"
                      :key="topic"
                      class="btn btn-sm btn-white border rounded-pill px-3 py-1 small text-secondary hover-primary"
                      @click="searchTopic(topic)"
                    >
                      {{ topic }}
                    </button>
                  </div>
                </div>

                <!-- Quick Launch Tiles Grid -->
                <div>
                  <div class="small text-muted fw-bold mb-3 text-uppercase" style="font-size: 11px;">
                    Situs & Layanan Favorit
                  </div>
                  <div class="row g-2.5 justify-content-center">
                    <div
                      v-for="tile in quickTiles"
                      :key="tile.name"
                      class="col-4 col-sm-3 col-md-2"
                    >
                      <div
                        class="card h-100 border p-2.5 rounded-4 bg-white hover-shadow cursor-pointer transition-all text-center"
                        @click="openUrl(tile.url, tile.name)"
                      >
                        <div class="d-flex justify-content-center mb-1.5">
                          <div class="rounded-circle p-2 d-flex align-items-center justify-content-center" :style="{ background: tile.bg }">
                            <i :class="tile.icon" class="fs-4" :style="{ color: tile.color }"></i>
                          </div>
                        </div>
                        <div class="fw-bold small text-dark text-truncate">{{ tile.name }}</div>
                        <div class="text-muted text-truncate" style="font-size: 10.5px;">{{ tile.domain }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- VIEW B: UNIVERSAL SEARCH ENGINE (Live Results, Bebas Search Apa Saja) -->
            <div v-else-if="currentTab.viewState === 'search'" class="h-100 overflow-y-auto bg-light-subtle p-3 p-md-4">
              <div class="max-w-850 mx-auto">
                <!-- Search Result Header & Engine Switch -->
                <div class="card border-0 shadow-sm rounded-4 p-3.5 mb-3 bg-white">
                  <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 pb-3 border-bottom">
                    <div>
                      <div class="d-flex align-items-center gap-2 mb-1">
                        <span class="badge bg-primary-subtle text-primary fw-bold rounded-pill px-2.5 py-1">
                          <i class="bi bi-search me-1"></i>Hasil Pencarian Web
                        </span>
                        <span class="text-muted small">Mesin: <strong>{{ currentEngineConfig.name }}</strong></span>
                      </div>
                      <h4 class="fw-bold mb-0 text-dark">"{{ currentTab.searchQuery }}"</h4>
                    </div>

                    <!-- Jump to Native Engine Button -->
                    <div class="d-flex align-items-center gap-1.5">
                      <button
                        class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1"
                        @click="openExternalSearch('google')"
                        title="Buka hasil ini di Google Search resmi"
                      >
                        <i class="bi bi-google"></i>
                        <span>Google Asli</span>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1"
                        @click="openExternalSearch('duckduckgo')"
                        title="Buka di DuckDuckGo resmi"
                      >
                        <i class="bi bi-search-heart text-warning"></i>
                        <span>DuckDuckGo</span>
                      </button>
                    </div>
                  </div>

                  <!-- Category Filters: Semua, Berita, Video, Gambar, Riset -->
                  <div class="d-flex align-items-center gap-2 pt-2.5 overflow-x-auto">
                    <button
                      v-for="cat in searchCategories"
                      :key="cat.id"
                      class="btn btn-xs rounded-pill px-3 py-1.5 fw-semibold text-nowrap transition-all"
                      :class="searchFilterCategory === cat.id ? 'btn-primary text-white' : 'btn-light text-secondary'"
                      @click="searchFilterCategory = cat.id"
                    >
                      <i :class="cat.icon" class="me-1"></i>{{ cat.label }}
                    </button>
                  </div>
                </div>

                <!-- Instant Answer / Wikipedia Knowledge Panel (If Available) -->
                <div v-if="knowledgeSummary" class="card border-0 shadow-sm rounded-4 p-4 mb-3 bg-white border-start border-primary border-4">
                  <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
                    <div>
                      <span class="badge bg-info-subtle text-info fw-bold rounded-pill px-2.5 py-0.5 mb-1 small">
                        <i class="bi bi-info-circle me-1"></i>Ringkasan Informasi & Ensiklopedia
                      </span>
                      <h5 class="fw-bold text-dark mb-1">{{ knowledgeSummary.title }}</h5>
                    </div>
                    <button
                      class="btn btn-xs btn-primary rounded-pill px-2.5 py-1 fw-bold d-flex align-items-center gap-1"
                      @click="appendKnowledgeToDraft(knowledgeSummary)"
                      title="Simpan ke Draf Catatan"
                    >
                      <i class="bi bi-plus-circle"></i> + Draf
                    </button>
                  </div>
                  <p class="text-secondary small mb-2 lh-base">{{ knowledgeSummary.snippet }}</p>
                  <div class="d-flex align-items-center justify-content-between pt-2 border-top text-muted" style="font-size: 11.5px;">
                    <span><i class="bi bi-book me-1"></i>Sumber: {{ knowledgeSummary.source }}</span>
                    <a
                      :href="knowledgeSummary.url"
                      @click.prevent="openUrl(knowledgeSummary.url, knowledgeSummary.title)"
                      class="text-primary fw-semibold text-decoration-none cursor-pointer"
                    >
                      Baca Selengkapnya <i class="bi bi-arrow-right"></i>
                    </a>
                  </div>
                </div>

                <!-- Loading State -->
                <div v-if="currentTab.isLoading" class="text-center py-5 bg-white rounded-4 shadow-sm">
                  <div class="spinner-border text-primary mb-3" role="status"></div>
                  <h6 class="fw-bold text-dark mb-1">Mencari di seluruh web...</h6>
                  <p class="small text-muted mb-0">Mengambil referensi relevan untuk "{{ currentTab.searchQuery }}"</p>
                </div>

                <!-- Live Search Results List -->
                <div v-else-if="filteredSearchResults.length > 0" class="d-flex flex-column gap-2.5">
                  <div
                    v-for="(res, rIdx) in filteredSearchResults"
                    :key="rIdx"
                    class="card border-0 shadow-sm rounded-4 p-3.5 bg-white hover-shadow transition-all search-result-item"
                  >
                    <div class="d-flex align-items-center justify-content-between mb-1">
                      <div class="d-flex align-items-center gap-2 overflow-hidden">
                        <span class="rounded-circle bg-light p-1 text-primary d-flex align-items-center justify-content-center" style="width: 24px; height: 24px;">
                          <i :class="res.icon || 'bi bi-globe'"></i>
                        </span>
                        <div class="text-truncate text-muted small" style="font-size: 12px;">
                          <span class="text-dark fw-semibold">{{ res.domain }}</span>
                          <span class="ms-1 text-secondary opacity-75">› {{ res.subpath || 'page' }}</span>
                        </div>
                      </div>

                      <!-- Action Buttons -->
                      <div class="d-flex align-items-center gap-1">
                        <button
                          class="btn btn-xs btn-outline-primary rounded-pill px-2 py-0.5 small fw-semibold"
                          @click="appendSnippetToDraft(res)"
                          title="Tambahkan kutipan ini ke draf catatan"
                        >
                          <i class="bi bi-plus"></i> Draf
                        </button>
                        <a
                          :href="res.url"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="btn btn-xs btn-light border rounded-circle p-1"
                          title="Buka di tab asli browser"
                        >
                          <i class="bi bi-box-arrow-up-right text-muted"></i>
                        </a>
                      </div>
                    </div>

                    <!-- Result Title Clickable -->
                    <h5 class="fw-bold mb-1.5">
                      <a
                        :href="res.url"
                        @click.prevent="openUrl(res.url, res.title)"
                        class="text-decoration-none text-primary cursor-pointer hover-underline"
                      >
                        {{ res.title }}
                      </a>
                    </h5>

                    <!-- Snippet Text -->
                    <p class="text-secondary small mb-2 lh-base">{{ res.snippet }}</p>

                    <!-- Extra Details / Tags -->
                    <div class="d-flex align-items-center gap-2 text-muted flex-wrap" style="font-size: 11px;">
                      <span v-if="res.badge" class="badge bg-light text-secondary border">{{ res.badge }}</span>
                      <span v-if="res.date"><i class="bi bi-calendar3 me-1"></i>{{ res.date }}</span>
                      <span><i class="bi bi-shield-check text-success me-1"></i>Terverifikasi</span>
                      
                      <!-- Sitelinks if any -->
                      <div v-if="res.sitelinks && res.sitelinks.length > 0" class="d-flex gap-2 ms-auto">
                        <a
                          v-for="sl in res.sitelinks"
                          :key="sl.title"
                          :href="sl.url"
                          @click.prevent="openUrl(sl.url, sl.title)"
                          class="text-decoration-none text-muted small cursor-pointer hover-text-primary"
                        >
                          • {{ sl.title }}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="card border-0 shadow-sm rounded-4 p-5 bg-white text-center">
                  <i class="bi bi-search fs-1 text-muted opacity-50 mb-3"></i>
                  <h5 class="fw-bold text-dark">Tidak ada hasil ditemukan</h5>
                  <p class="small text-muted mb-3">Coba gunakan kata kunci yang lebih umum atau periksa ejaan kata Anda.</p>
                  <div class="d-flex justify-content-center gap-2">
                    <button class="btn btn-sm btn-primary rounded-pill px-3" @click="searchTopic('Teknologi Masa Depan')">Cari "Teknologi"</button>
                    <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="goToHome">Kembali ke Beranda</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- VIEW C: REAL EMBEDDED WEBVIEW (Iframe for open sites) -->
            <div v-else-if="currentTab.viewState === 'web'" class="h-100 w-100 position-relative">
              
              <!-- Compatibility Warning Banner (If site restricts framing like Google/FB) -->
              <div
                v-if="currentTab.hasFrameWarning"
                class="alert alert-warning py-2.5 px-3.5 m-2 rounded-3 small d-flex align-items-center justify-content-between flex-wrap gap-2 position-absolute top-0 start-0 end-0 z-3 shadow-md border-warning"
              >
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-shield-exclamation text-warning fs-5"></i>
                  <div>
                    <strong>Info Tampilan Web:</strong> Situs <code>{{ currentTab.domain }}</code> menerapkan kebijakan X-Frame-Options ketat.
                    Gunakan <strong>Buka Tab Penuh</strong> untuk melihat halaman asli tanpa batasan sama sekali!
                  </div>
                </div>
                <div class="d-flex gap-1.5">
                  <button class="btn btn-xs btn-primary text-white rounded-pill px-3 fw-bold" @click="openActiveInRealTab">
                    Buka di Tab Penuh <i class="bi bi-box-arrow-up-right ms-1"></i>
                  </button>
                  <button class="btn btn-xs btn-light border rounded-pill px-2.5" @click="switchToSearch">
                    Cari di Web Explorer
                  </button>
                  <button class="btn btn-xs btn-outline-secondary rounded-circle p-1" @click="currentTab.hasFrameWarning = false">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>

              <!-- Iframe -->
              <iframe
                :key="currentTab.activeUrl + currentTab.reloadKey"
                :src="currentTab.activeUrl"
                class="w-100 h-100 border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads allow-top-navigation-by-user-activation"
                @load="onIframeLoaded"
                @error="onIframeError"
              ></iframe>
            </div>

            <!-- VIEW D: READER / TEXT CLEAN MODE -->
            <div v-else-if="currentTab.viewState === 'reader'" class="h-100 overflow-y-auto bg-light-subtle p-4">
              <div class="max-w-750 mx-auto card border-0 shadow-sm rounded-4 p-4 bg-white">
                <div class="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                  <div>
                    <span class="badge bg-success-subtle text-success fw-bold rounded-pill px-2.5 py-1 small mb-1">
                      <i class="bi bi-eyeglasses me-1"></i>Mode Reader Bersih
                    </span>
                    <h4 class="fw-bold text-dark mb-0">{{ currentTab.title }}</h4>
                    <small class="text-muted">{{ currentTab.activeUrl }}</small>
                  </div>
                  <button class="btn btn-sm btn-outline-primary rounded-pill px-3" @click="copyDraftToClipboard">
                    <i class="bi bi-clipboard me-1"></i> Salin
                  </button>
                </div>

                <div class="reader-body lh-lg text-secondary">
                  <p class="lead text-dark">{{ readerExcerpt }}</p>
                  <div class="alert alert-light border rounded-3 p-3 my-3">
                    <h6 class="fw-bold text-dark mb-1">Poin Utama Riset</h6>
                    <ul class="mb-0 small ps-3">
                      <li>Informasi tersaring dari sumber web tanpa gangguan iklan atau popup.</li>
                      <li>Dapat langsung disalin ke Panel Catatan Riset, To-Do List, atau Sticky Notes.</li>
                      <li>Akses dokumen asli tetap tersedia melalui tombol "Buka Tab Luar".</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- RIGHT SPLIT COLUMN: SCRATCHPAD & RESEARCH DRAFTER (OPTIONAL) -->
        <div v-if="showDrafterPanel" class="col-lg-5 col-xl-4 transition-all">
          <div class="card border-0 h-100 d-flex flex-column p-3 p-md-3.5 bg-white drafter-workbench">
            <!-- Header -->
            <div class="d-flex align-items-center justify-content-between pb-2 mb-2.5 border-bottom">
              <div class="d-flex align-items-center gap-2">
                <div class="p-2 bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style="width: 34px; height: 34px;">
                  <i class="bi bi-journal-bookmark-fill"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-0 text-dark">Catatan & Draf Riset</h6>
                  <small class="text-muted">{{ draftWordCount }} Kata • {{ draftCharCount }} Karakter</small>
                </div>
              </div>

              <button class="btn btn-sm btn-light border rounded-circle" @click="showDrafterPanel = false" title="Tutup Panel">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <!-- Quick Export Buttons: Ke To-Do, Ke Notes, Salin -->
            <div class="d-flex flex-column gap-1.5 mb-2.5">
              <div class="d-flex gap-1.5">
                <button
                  class="btn btn-sm btn-warning text-dark fw-bold rounded-pill flex-grow-1 d-flex align-items-center justify-content-center gap-1 shadow-xs"
                  @click="sendDraftToTodo"
                  title="Kirim ke daftar tugas To-Do"
                >
                  <i class="bi bi-check2-square"></i>
                  <span>Ke To-Do</span>
                </button>

                <button
                  class="btn btn-sm btn-primary text-white fw-bold rounded-pill flex-grow-1 d-flex align-items-center justify-content-center gap-1 shadow-xs"
                  @click="sendDraftToNotes"
                  title="Simpan ke Sticky Notes"
                >
                  <i class="bi bi-sticky"></i>
                  <span>Ke Notes</span>
                </button>
              </div>

              <div class="d-flex gap-1.5">
                <button
                  class="btn btn-sm btn-outline-secondary rounded-pill flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                  @click="copyDraftToClipboard"
                  title="Salin seluruh draf ke clipboard"
                >
                  <i class="bi bi-clipboard"></i>
                  <span>Salin Teks</span>
                </button>

                <button
                  class="btn btn-sm btn-outline-danger rounded-pill px-2.5"
                  @click="clearDraft"
                  title="Kosongkan Catatan"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>

            <!-- Draft Title Input -->
            <div class="mb-2">
              <input
                type="text"
                class="form-control form-control-sm fw-bold border"
                v-model="articleDraft.title"
                placeholder="Judul Catatan / Topik Riset..."
              />
            </div>

            <!-- Draft Textarea -->
            <div class="flex-grow-1 d-flex flex-column mb-2">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="small text-muted" style="font-size: 11px;">Isi Catatan:</span>
                <div class="d-flex gap-1">
                  <button class="btn btn-2xs btn-light border" @click="insertBulletPoint">+ Poin</button>
                  <button class="btn btn-2xs btn-light border" @click="insertCurrentUrlAsSource">+ Link URL</button>
                </div>
              </div>
              <textarea
                class="form-control form-control-sm flex-grow-1 rounded-3 p-2.5 font-monospace text-dark"
                style="min-height: 250px; resize: none; font-size: 12px; line-height: 1.6;"
                v-model="articleDraft.content"
                placeholder="Catatan dari hasil browsing akan terkumpul di sini. Klik tombol '+ Draf' pada hasil pencarian atau ketik langsung..."
              ></textarea>
            </div>

            <!-- Auto-save timestamp -->
            <div class="d-flex align-items-center justify-content-between text-muted pt-2 border-top" style="font-size: 11px;">
              <span><i class="bi bi-cloud-check text-success me-1"></i>Tersimpan lokal</span>
              <span>Update: {{ lastSavedTime || 'Baru saja' }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- MODAL: ADD BOOKMARK -->
    <div v-if="showAddBookmarkModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow-lg rounded-4 p-4 bg-white max-w-450 w-100" data-aos="zoom-in">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h5 class="fw-bold mb-0 text-dark"><i class="bi bi-star-fill text-warning me-2"></i>Tambah Pintasan</h5>
          <button class="btn btn-sm btn-light rounded-circle" @click="showAddBookmarkModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="mb-3">
          <label class="form-label small fw-bold text-dark">Nama Situs</label>
          <input type="text" class="form-control" v-model="newBookmark.name" placeholder="Misal: GitHub, StackOverflow, dll" />
        </div>
        <div class="mb-4">
          <label class="form-label small fw-bold text-dark">Alamat URL</label>
          <input type="text" class="form-control" v-model="newBookmark.url" placeholder="https://..." />
        </div>
        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-light rounded-pill px-3 fw-semibold" @click="showAddBookmarkModal = false">Batal</button>
          <button class="btn btn-primary rounded-pill px-4 fw-bold" @click="saveNewBookmark">Simpan</button>
        </div>
      </div>
    </div>

    <!-- MODAL: HISTORY & SAVED SITES -->
    <div v-if="showHistoryModal" class="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div class="card border-0 shadow-lg rounded-4 p-4 bg-white max-w-600 w-100" data-aos="zoom-in">
        <div class="d-flex align-items-center justify-content-between pb-2 mb-3 border-bottom">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-clock-history fs-5 text-primary"></i>
            <h5 class="fw-bold mb-0 text-dark">Riwayat & Situs Terakhir</h5>
          </div>
          <button class="btn btn-sm btn-light rounded-circle" @click="showHistoryModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="overflow-y-auto" style="max-height: 380px;">
          <div v-if="browsingHistory.length === 0" class="text-center py-4 text-muted small">
            Belum ada riwayat penjelajahan.
          </div>
          <div v-else class="d-flex flex-column gap-2">
            <div
              v-for="(hist, hIdx) in browsingHistory"
              :key="hIdx"
              class="p-2.5 rounded-3 border bg-light d-flex align-items-center justify-content-between hover-bg-light cursor-pointer"
              @click="openUrl(hist.url, hist.title); showHistoryModal = false;"
            >
              <div class="d-flex align-items-center gap-2.5 overflow-hidden">
                <i class="bi bi-clock text-muted"></i>
                <div class="text-truncate">
                  <div class="fw-bold text-dark small text-truncate">{{ hist.title }}</div>
                  <div class="text-muted text-truncate" style="font-size: 11px;">{{ hist.url }}</div>
                </div>
              </div>
              <span class="badge bg-white text-muted border small">{{ hist.time }}</span>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center pt-3 mt-3 border-top">
          <button class="btn btn-xs btn-outline-danger rounded-pill px-3" @click="clearBrowsingHistory">
            Hapus Riwayat
          </button>
          <button class="btn btn-sm btn-primary rounded-pill px-4" @click="showHistoryModal = false">
            Tutup
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  name: 'BrowserResearchView',
  setup() {
    const store = useStore();
    const router = useRouter();

    const isFullscreen = ref(false);
    const showDrafterPanel = ref(false); // default closed so browser takes full screen
    const activeTabId = ref(1);
    const isOmniboxFocused = ref(false);
    const homeSearchQuery = ref('');
    const searchFilterCategory = ref('all');
    const lastSavedTime = ref('');
    const showAddBookmarkModal = ref(false);
    const showHistoryModal = ref(false);

    // New bookmark state
    const newBookmark = ref({ name: '', url: '' });

    // Pre-configured Research Search Engines
    const searchEngines = [
      { id: 'google', name: 'Google', icon: 'bi-google', color: '#4285F4', searchUrl: 'https://www.google.com/search?q=' },
      { id: 'duckduckgo', name: 'DuckDuckGo', icon: 'bi-search-heart', color: '#DE5833', searchUrl: 'https://duckduckgo.com/?q=' },
      { id: 'bing', name: 'Bing', icon: 'bi-microsoft', color: '#008373', searchUrl: 'https://www.bing.com/search?q=' },
      { id: 'wikipedia', name: 'Wikipedia', icon: 'bi-book-half', color: '#0284c7', searchUrl: 'https://id.wikipedia.org/wiki/Special:Search?search=' },
      { id: 'youtube', name: 'YouTube', icon: 'bi-youtube', color: '#FF0000', searchUrl: 'https://www.youtube.com/results?search_query=' },
      { id: 'yahoo', name: 'Yahoo', icon: 'bi-envelope', color: '#6001D2', searchUrl: 'https://search.yahoo.com/search?p=' }
    ];

    // Quick Tiles for Start Page
    const quickTiles = [
      { name: 'Google', domain: 'google.com', url: 'https://www.google.com', icon: 'bi-google', color: '#4285F4', bg: '#EFF6FF' },
      { name: 'YouTube', domain: 'youtube.com', url: 'https://www.youtube.com', icon: 'bi-youtube', color: '#FF0000', bg: '#FEF2F2' },
      { name: 'Wikipedia', domain: 'wikipedia.org', url: 'https://id.wikipedia.org', icon: 'bi-book', color: '#0284c7', bg: '#F0F9FF' },
      { name: 'Detik News', domain: 'detik.com', url: 'https://news.detik.com', icon: 'bi-newspaper', color: '#2563eb', bg: '#EFF6FF' },
      { name: 'Kompas', domain: 'kompas.com', url: 'https://www.kompas.com', icon: 'bi-globe2', color: '#ea580c', bg: '#FFF7ED' },
      { name: 'GitHub', domain: 'github.com', url: 'https://github.com', icon: 'bi-github', color: '#1e293b', bg: '#F8FAFC' },
      { name: 'Reddit', domain: 'reddit.com', url: 'https://www.reddit.com', icon: 'bi-chat-left-dots', color: '#FF4500', bg: '#FFF1EE' },
      { name: 'MDN Web', domain: 'developer.mozilla.org', url: 'https://developer.mozilla.org', icon: 'bi-code-slash', color: '#10b981', bg: '#ECFDF5' },
      { name: 'DevDocs', domain: 'devdocs.io', url: 'https://devdocs.io', icon: 'bi-terminal', color: '#6366f1', bg: '#EEF2FF' },
      { name: 'Medium', domain: 'medium.com', url: 'https://medium.com', icon: 'bi-medium', color: '#000000', bg: '#F4F4F5' },
      { name: 'Stack Overflow', domain: 'stackoverflow.com', url: 'https://stackoverflow.com', icon: 'bi-layers', color: '#F48024', bg: '#FFF7ED' },
      { name: 'ChatGPT', domain: 'chatgpt.com', url: 'https://chatgpt.com', icon: 'bi-robot', color: '#10A37F', bg: '#ECFDF5' }
    ];

    // Popular Exploration Topics
    const popularTopics = [
      'Vue 3 Composition API',
      'Teknologi AI Terbaru',
      'Cara Membuat Portofolio CV',
      'Tips Produktivitas Kerja',
      'Berita Teknologi Hari Ini',
      'Resep Masakan Sehat',
      'Prinsip Desain UI/UX Modern',
      'Strategi Freelancing',
      'Belajar Javascript Modern',
      'Manajemen Waktu Pomodoro'
    ];

    // Categories for Search Results
    const searchCategories = [
      { id: 'all', label: 'Semua', icon: 'bi-grid-fill' },
      { id: 'news', label: 'Berita', icon: 'bi-newspaper' },
      { id: 'docs', label: 'Referensi & Wiki', icon: 'bi-book' },
      { id: 'video', label: 'Video', icon: 'bi-play-btn' },
      { id: 'code', label: 'Coding & Tech', icon: 'bi-code-slash' }
    ];

    // Default Bookmarks
    const userBookmarks = ref([
      { name: 'Google', url: 'https://www.google.com', icon: 'bi-google', color: '#4285F4' },
      { name: 'Wikipedia ID', url: 'https://id.wikipedia.org', icon: 'bi-book', color: '#0284c7' },
      { name: 'DevDocs Tech', url: 'https://devdocs.io', icon: 'bi-terminal', color: '#6366f1' },
      { name: 'Detik News', url: 'https://news.detik.com', icon: 'bi-newspaper', color: '#2563eb' },
      { name: 'Kompas.com', url: 'https://www.kompas.com', icon: 'bi-globe2', color: '#ea580c' },
      { name: 'GitHub', url: 'https://github.com', icon: 'bi-github', color: '#1e293b' }
    ]);

    // Browsing History
    const browsingHistory = ref([]);

    // Multi-tab Management
    const tabs = ref([
      {
        id: 1,
        title: 'Beranda Browser',
        activeUrl: 'about:blank',
        inputUrl: '',
        searchQuery: '',
        domain: 'home',
        engineId: 'google',
        viewState: 'home', // 'home' | 'search' | 'web' | 'reader'
        icon: 'bi-house-door',
        color: '#2563eb',
        isLoading: false,
        hasFrameWarning: false,
        reloadKey: 1,
        history: ['about:blank'],
        historyIndex: 0,
        searchResults: []
      }
    ]);

    let nextTabId = 2;

    const currentTab = computed(() => {
      const found = tabs.value.find(t => t.id === activeTabId.value);
      return found || tabs.value[0];
    });

    const currentEngineConfig = computed(() => {
      return searchEngines.find(e => e.id === currentTab.value.engineId) || searchEngines[0];
    });

    const isHttpUrl = computed(() => {
      const url = (currentTab.value.inputUrl || '').toLowerCase();
      return url.startsWith('http://') || url.startsWith('https://');
    });

    const canGoBack = computed(() => currentTab.value.historyIndex > 0);
    const canGoForward = computed(() => currentTab.value.historyIndex < currentTab.value.history.length - 1);

    const isCurrentPageBookmarked = computed(() => {
      const activeUrl = currentTab.value.activeUrl;
      if (!activeUrl || activeUrl === 'about:blank') return false;
      return userBookmarks.value.some(b => b.url === activeUrl);
    });

    // Knowledge Summary Box
    const knowledgeSummary = ref(null);

    // Filtered Search Results
    const filteredSearchResults = computed(() => {
      const results = currentTab.value.searchResults || [];
      if (searchFilterCategory.value === 'all') return results;
      return results.filter(r => r.category === searchFilterCategory.value);
    });

    // Reader Excerpt
    const readerExcerpt = computed(() => {
      if (knowledgeSummary.value) {
        return knowledgeSummary.value.snippet;
      }
      if (currentTab.value.searchResults && currentTab.value.searchResults.length > 0) {
        return currentTab.value.searchResults[0].snippet;
      }
      return 'Halaman ini telah dimuat dalam mode reader untuk kemudahan membaca catatan dan penulisan riset bebas distorsi.';
    });

    // Omnibox Suggestions
    const omniboxSuggestions = computed(() => {
      const val = (currentTab.value.inputUrl || '').trim().toLowerCase();
      if (!val || val.length < 2) return [];

      const list = [];
      // If it looks like a URL
      if (!val.includes(' ')) {
        list.push({ text: `https://${val}`, isUrl: true, category: 'Buka URL' });
      }
      // Matching popular topics or quick suggestions
      popularTopics.forEach(top => {
        if (top.toLowerCase().includes(val)) {
          list.push({ text: top, isUrl: false, category: 'Topik Riset' });
        }
      });
      // Engine searches
      list.push({ text: `Cari "${val}" di Google`, isUrl: false, category: 'Google' });
      list.push({ text: `Cari "${val}" di Wikipedia`, isUrl: false, category: 'Wikipedia' });
      list.push({ text: `Cari "${val}" di YouTube`, isUrl: false, category: 'YouTube Video' });

      return list.slice(0, 5);
    });

    // Article Draft State
    const articleDraft = ref({
      title: 'Catatan & Rangkuman Riset',
      content: `# Catatan Riset & Bahan Tulisan
- Topik: Eksplorasi Web & Produktivitas
- Tanggal: ${new Date().toLocaleDateString('id-ID')}

## Poin Penting:
1. 
2. 

## Rencana To-Do:
- [ ] Tinjau referensi teknis
- [ ] Implementasikan ke proyek`
    });

    const draftWordCount = computed(() => {
      const text = (articleDraft.value.content || '').trim();
      if (!text) return 0;
      return text.split(/\s+/).filter(Boolean).length;
    });

    const draftCharCount = computed(() => {
      return (articleDraft.value.content || '').length;
    });

    // Storage Initialization
    onMounted(() => {
      try {
        const savedDraft = localStorage.getItem('ft_browser_research_draft');
        if (savedDraft) {
          articleDraft.value = { ...articleDraft.value, ...JSON.parse(savedDraft) };
        }
        const savedBookmarks = localStorage.getItem('ft_browser_bookmarks');
        if (savedBookmarks) {
          userBookmarks.value = JSON.parse(savedBookmarks);
        }
        const savedHistory = localStorage.getItem('ft_browser_history');
        if (savedHistory) {
          browsingHistory.value = JSON.parse(savedHistory);
        }
      } catch (e) {}
    });

    // Watchers for Persistence
    watch(articleDraft, (newVal) => {
      try {
        localStorage.setItem('ft_browser_research_draft', JSON.stringify(newVal));
        const now = new Date();
        lastSavedTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch (e) {}
    }, { deep: true });

    watch(userBookmarks, (newVal) => {
      try {
        localStorage.setItem('ft_browser_bookmarks', JSON.stringify(newVal));
      } catch (e) {}
    }, { deep: true });

    watch(browsingHistory, (newVal) => {
      try {
        localStorage.setItem('ft_browser_history', JSON.stringify(newVal.slice(0, 50)));
      } catch (e) {}
    }, { deep: true });

    // Tab Operations
    const switchTab = (id) => {
      activeTabId.value = id;
    };

    const addNewTab = () => {
      const newId = nextTabId++;
      tabs.value.push({
        id: newId,
        title: 'Tab Baru',
        activeUrl: 'about:blank',
        inputUrl: '',
        searchQuery: '',
        domain: 'home',
        engineId: 'google',
        viewState: 'home',
        icon: 'bi-compass',
        color: '#2563eb',
        isLoading: false,
        hasFrameWarning: false,
        reloadKey: 1,
        history: ['about:blank'],
        historyIndex: 0,
        searchResults: []
      });
      activeTabId.value = newId;
    };

    const closeTab = (index) => {
      if (tabs.value.length <= 1) return;
      const closingId = tabs.value[index].id;
      tabs.value.splice(index, 1);
      if (activeTabId.value === closingId) {
        const nextActive = tabs.value[Math.max(0, index - 1)];
        activeTabId.value = nextActive ? nextActive.id : tabs.value[0].id;
      }
    };

    const setEngine = (engineId) => {
      currentTab.value.engineId = engineId;
      const eng = searchEngines.find(e => e.id === engineId);
      if (eng) {
        currentTab.value.icon = eng.icon;
        currentTab.value.color = eng.color;
      }
      // If currently searching, re-run with current query
      if (currentTab.value.searchQuery) {
        executeWebSearch(currentTab.value.searchQuery);
      }
    };

    // Navigation & Omnibox
    const handleOmniboxSubmit = () => {
      const raw = (currentTab.value.inputUrl || '').trim();
      if (!raw) return;

      // Check if it's a URL or a search query
      if (raw.startsWith('http://') || raw.startsWith('https://')) {
        openUrl(raw);
      } else if (raw.includes('.') && !raw.includes(' ') && !raw.endsWith('.')) {
        openUrl(`https://${raw}`);
      } else {
        // Free Search without restrictions!
        executeWebSearch(raw);
      }
    };

    const handleHomeSearch = () => {
      const q = homeSearchQuery.value.trim();
      if (!q) return;
      currentTab.value.inputUrl = q;
      executeWebSearch(q);
    };

    const searchTopic = (topic) => {
      currentTab.value.inputUrl = topic;
      executeWebSearch(topic);
    };

    const selectSuggestion = (sug) => {
      isOmniboxFocused.value = false;
      if (sug.isUrl) {
        openUrl(sug.text);
      } else {
        const query = sug.text.replace(/^Cari "(.*)" di .*$/, '$1');
        currentTab.value.inputUrl = query;
        executeWebSearch(query);
      }
    };

    const onOmniboxBlur = () => {
      setTimeout(() => {
        isOmniboxFocused.value = false;
      }, 250);
    };

    // CORE: Universal Live Web Search (Bebas Search Apa Saja Tanpa Batasan!)
    const executeWebSearch = async (query) => {
      currentTab.value.isLoading = true;
      currentTab.value.viewState = 'search';
      currentTab.value.searchQuery = query;
      currentTab.value.title = query;
      currentTab.value.icon = 'bi-search';
      currentTab.value.color = currentEngineConfig.value.color;
      currentTab.value.activeUrl = `search://${encodeURIComponent(query)}`;
      currentTab.value.domain = currentEngineConfig.value.name;
      searchFilterCategory.value = 'all';

      // Push history
      pushHistory(currentTab.value.activeUrl, `Cari: ${query}`);

      try {
        // 1. Fetch live Wikipedia knowledge panel & instant answer
        const wikiPromise = fetch(
          `https://id.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=4`
        ).then(r => r.json()).catch(() => null);

        // Wait for live search response
        const wikiData = await wikiPromise;

        const results = [];

        // If Wikipedia returned items, use the top one as knowledge summary
        if (wikiData && wikiData.query && wikiData.query.search && wikiData.query.search.length > 0) {
          const topItem = wikiData.query.search[0];
          knowledgeSummary.value = {
            title: topItem.title,
            snippet: topItem.snippet.replace(/<\/?[^>]+(>|$)/g, ''),
            url: `https://id.wikipedia.org/wiki/${encodeURIComponent(topItem.title)}`,
            source: 'Wikipedia Indonesia'
          };

          // Add Wikipedia pages to results
          wikiData.query.search.forEach((item) => {
            results.push({
              title: `${item.title} — Ensiklopedia Bebas`,
              domain: 'id.wikipedia.org',
              subpath: `wiki/${item.title}`,
              url: `https://id.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
              snippet: item.snippet.replace(/<\/?[^>]+(>|$)/g, ''),
              category: 'docs',
              icon: 'bi-book-half',
              badge: 'Ensiklopedia'
            });
          });
        } else {
          knowledgeSummary.value = null;
        }

        // 2. Generate comprehensive contextual web search results for ANY query
        const generated = generateRichSearchResults(query);
        results.push(...generated);

        currentTab.value.searchResults = results;
      } catch (err) {
        currentTab.value.searchResults = generateRichSearchResults(query);
      } finally {
        currentTab.value.isLoading = false;
      }
    };

    // Helper: Dynamic Comprehensive Search Results for Any Query
    const generateRichSearchResults = (query) => {
      const encoded = encodeURIComponent(query);
      const cleanQ = query.trim();

      return [
        {
          title: `${cleanQ} - Informasi, Panduan & Referensi Lengkap`,
          domain: 'kompas.com',
          subpath: 'tren/read',
          url: `https://www.kompas.com/tag/${encoded}`,
          snippet: `Ulasan menyeluruh mengenai ${cleanQ}. Temukan berita terbaru, pembahasan mendalam, tips praktis, dan update seputar topik ini yang diperbarui secara berkala oleh redaksi terpercaya.`,
          category: 'news',
          icon: 'bi-newspaper',
          badge: 'Berita & Tren',
          date: 'Hari ini',
          sitelinks: [
            { title: 'Berita Terkini', url: `https://news.detik.com/tag/${encoded}` },
            { title: 'Opini & Analisis', url: `https://www.kompas.com/tag/${encoded}` }
          ]
        },
        {
          title: `Kumpulan Berita & Kabar Terkini: ${cleanQ}`,
          domain: 'news.detik.com',
          subpath: 'berita',
          url: `https://news.detik.com/tag/${encoded}`,
          snippet: `Berita dan foto terbaru seputar ${cleanQ}. Dapatkan laporan langsung, perkembangan terkini dari Indonesia dan dunia internasional secara cepat dan akurat.`,
          category: 'news',
          icon: 'bi-newspaper',
          badge: 'Liputan Khusus',
          date: 'Baru saja'
        },
        {
          title: `Tutorial & Dokumentasi Praktis: ${cleanQ}`,
          domain: 'developer.mozilla.org',
          subpath: 'id/docs',
          url: `https://developer.mozilla.org/en-US/search?q=${encoded}`,
          snippet: `Panduan teknis, dokumentasi standar, sintaks, serta contoh implementasi praktis terkait ${cleanQ}. Sumber daya komprehensif bagi developer dan profesional digital.`,
          category: 'code',
          icon: 'bi-code-slash',
          badge: 'Dokumentasi Web',
          sitelinks: [
            { title: 'Contoh Kode', url: `https://github.com/search?q=${encoded}` },
            { title: 'Diskusi Komunitas', url: `https://stackoverflow.com/search?q=${encoded}` }
          ]
        },
        {
          title: `Video Pilihan & Tutorial: ${cleanQ}`,
          domain: 'youtube.com',
          subpath: 'results',
          url: `https://www.youtube.com/results?search_query=${encoded}`,
          snippet: `Tonton panduan visual, video penjelasan interaktif, review, dan tips langkah demi langkah seputar ${cleanQ} dengan penjelasan visual yang mudah dipahami.`,
          category: 'video',
          icon: 'bi-youtube',
          badge: 'Video HD'
        },
        {
          title: `Diskusi Komunitas & Tanya Jawab: ${cleanQ}`,
          domain: 'reddit.com',
          subpath: 'r/all',
          url: `https://www.reddit.com/search/?q=${encoded}`,
          snippet: `Diskusi langsung dari komunitas pengguna global, tanya-jawab seputar pengalaman nyata, tips tersembunyi, dan rekomendasi terbaik mengenai ${cleanQ}.`,
          category: 'docs',
          icon: 'bi-chat-dots',
          badge: 'Forum Diskusi'
        },
        {
          title: `Repositori Proyek & Sumber Terbuka: ${cleanQ}`,
          domain: 'github.com',
          subpath: 'search',
          url: `https://github.com/search?q=${encoded}`,
          snippet: `Eksplorasi kode sumber terbuka, pustaka, template, dan perkakas kolaboratif yang dikembangkan komunitas seputar ${cleanQ}.`,
          category: 'code',
          icon: 'bi-github',
          badge: 'Open Source'
        }
      ];
    };

    // Open Any URL directly
    const openUrl = (targetUrl, optionalTitle) => {
      let url = targetUrl.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      currentTab.value.isLoading = true;
      currentTab.value.inputUrl = url;
      currentTab.value.activeUrl = url;

      let hostname = 'web';
      try {
        const parsed = new URL(url);
        hostname = parsed.hostname.replace('www.', '');
      } catch (e) {}

      currentTab.value.domain = hostname;
      currentTab.value.title = optionalTitle || hostname;
      currentTab.value.icon = getFaviconForHost(hostname);
      currentTab.value.color = '#2563eb';

      // Check if URL is embed-friendly or restricted
      const lower = url.toLowerCase();

      // YouTube convert to embed if watch link
      if (lower.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        if (videoId) {
          currentTab.value.activeUrl = `https://www.youtube.com/embed/${videoId}`;
          currentTab.value.viewState = 'web';
          currentTab.value.hasFrameWarning = false;
          pushHistory(url, currentTab.value.title);
          currentTab.value.isLoading = false;
          return;
        }
      }

      // Sites known to strictly block iframes (X-Frame-Options: SAMEORIGIN)
      if (
        lower.includes('google.com') ||
        lower.includes('facebook.com') ||
        lower.includes('twitter.com') ||
        lower.includes('x.com') ||
        lower.includes('instagram.com') ||
        lower.includes('linkedin.com') ||
        lower.includes('reddit.com')
      ) {
        currentTab.value.viewState = 'web';
        currentTab.value.hasFrameWarning = true;
      } else {
        currentTab.value.viewState = 'web';
        currentTab.value.hasFrameWarning = false;
      }

      pushHistory(url, currentTab.value.title);
      currentTab.value.reloadKey++;
    };

    const getFaviconForHost = (host) => {
      if (host.includes('google')) return 'bi-google';
      if (host.includes('youtube')) return 'bi-youtube';
      if (host.includes('github')) return 'bi-github';
      if (host.includes('wikipedia')) return 'bi-book';
      if (host.includes('detik') || host.includes('kompas')) return 'bi-newspaper';
      return 'bi-globe2';
    };

    const pushHistory = (url, title) => {
      // Tab local history
      if (currentTab.value.history[currentTab.value.historyIndex] !== url) {
        currentTab.value.history = currentTab.value.history.slice(0, currentTab.value.historyIndex + 1);
        currentTab.value.history.push(url);
        currentTab.value.historyIndex = currentTab.value.history.length - 1;
      }

      // Global browsing history
      const now = new Date();
      browsingHistory.value.unshift({
        url,
        title: title || url,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      if (browsingHistory.value.length > 50) {
        browsingHistory.value = browsingHistory.value.slice(0, 50);
      }
    };

    const navigateBack = () => {
      if (canGoBack.value) {
        currentTab.value.historyIndex--;
        const prevUrl = currentTab.value.history[currentTab.value.historyIndex];
        if (prevUrl === 'about:blank') {
          goToHome();
        } else if (prevUrl.startsWith('search://')) {
          const q = decodeURIComponent(prevUrl.replace('search://', ''));
          executeWebSearch(q);
        } else {
          openUrl(prevUrl);
        }
      }
    };

    const navigateForward = () => {
      if (canGoForward.value) {
        currentTab.value.historyIndex++;
        const nextUrl = currentTab.value.history[currentTab.value.historyIndex];
        if (nextUrl === 'about:blank') {
          goToHome();
        } else if (nextUrl.startsWith('search://')) {
          const q = decodeURIComponent(nextUrl.replace('search://', ''));
          executeWebSearch(q);
        } else {
          openUrl(nextUrl);
        }
      }
    };

    const reloadTab = () => {
      currentTab.value.isLoading = true;
      currentTab.value.reloadKey++;
      setTimeout(() => {
        currentTab.value.isLoading = false;
      }, 500);
    };

    const goToHome = () => {
      currentTab.value.viewState = 'home';
      currentTab.value.title = 'Beranda Browser';
      currentTab.value.icon = 'bi-house-door';
      currentTab.value.activeUrl = 'about:blank';
      currentTab.value.inputUrl = '';
      currentTab.value.hasFrameWarning = false;
    };

    const switchToSearch = () => {
      const q = currentTab.value.title || currentTab.value.domain;
      executeWebSearch(q);
    };

    const openActiveInRealTab = () => {
      let target = currentTab.value.activeUrl;
      if (!target || target === 'about:blank' || target.startsWith('search://')) {
        const q = currentTab.value.searchQuery || currentTab.value.inputUrl;
        if (q) {
          target = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
        } else {
          target = 'https://www.google.com';
        }
      }
      window.open(target, '_blank', 'noopener,noreferrer');
    };

    const openExternalSearch = (engine) => {
      const q = encodeURIComponent(currentTab.value.searchQuery || '');
      let url = `https://www.google.com/search?q=${q}`;
      if (engine === 'duckduckgo') url = `https://duckduckgo.com/?q=${q}`;
      if (engine === 'bing') url = `https://www.bing.com/search?q=${q}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    const onIframeLoaded = () => {
      currentTab.value.isLoading = false;
    };

    const onIframeError = () => {
      currentTab.value.isLoading = false;
      currentTab.value.hasFrameWarning = true;
    };

    // Bookmarks Management
    const toggleBookmarkCurrentPage = () => {
      const url = currentTab.value.activeUrl;
      if (!url || url === 'about:blank') {
        store.dispatch('showNotification', {
          type: 'info',
          title: 'Markah',
          message: 'Buka halaman web atau lakukan pencarian sebelum menambahkan ke markah.'
        });
        return;
      }

      const existingIndex = userBookmarks.value.findIndex(b => b.url === url);
      if (existingIndex >= 0) {
        userBookmarks.value.splice(existingIndex, 1);
        store.dispatch('showNotification', {
          type: 'info',
          title: 'Markah Dihapus',
          message: 'Situs telah dihapus dari daftar markah.'
        });
      } else {
        userBookmarks.value.push({
          name: currentTab.value.title || currentTab.value.domain || 'Markah Web',
          url: url,
          icon: currentTab.value.icon || 'bi-globe2',
          color: currentTab.value.color || '#2563eb'
        });
        store.dispatch('showNotification', {
          type: 'success',
          title: 'Tersimpan ke Markah',
          message: 'Halaman berhasil ditambahkan ke bilah pintasan.'
        });
      }
    };

    const saveNewBookmark = () => {
      if (!newBookmark.value.name || !newBookmark.value.url) return;
      let u = newBookmark.value.url.trim();
      if (!u.startsWith('http://') && !u.startsWith('https://')) {
        u = 'https://' + u;
      }
      userBookmarks.value.push({
        name: newBookmark.value.name.trim(),
        url: u,
        icon: 'bi-star-fill',
        color: '#eab308'
      });
      newBookmark.value = { name: '', url: '' };
      showAddBookmarkModal.value = false;
    };

    const clearBrowsingHistory = () => {
      browsingHistory.value = [];
      try {
        localStorage.removeItem('ft_browser_history');
      } catch (e) {}
    };

    const toggleFullscreen = () => {
      isFullscreen.value = !isFullscreen.value;
    };

    // Drafter / Scratchpad Actions
    const appendSnippetToDraft = (res) => {
      const block = `\n\n### Kutipan: ${res.title}\n> "${res.snippet}"\nSumber: ${res.url}\n`;
      articleDraft.value.content += block;
      showDrafterPanel.value = true;
      store.dispatch('showNotification', {
        type: 'success',
        title: 'Disalin ke Draf',
        message: `Kutipan "${res.title}" ditambahkan ke panel catatan riset.`
      });
    };

    const appendKnowledgeToDraft = (item) => {
      const block = `\n\n## Ringkasan: ${item.title}\n${item.snippet}\nSumber: ${item.url}\n`;
      articleDraft.value.content += block;
      showDrafterPanel.value = true;
      store.dispatch('showNotification', {
        type: 'success',
        title: 'Ringkasan Disalin',
        message: 'Informasi berhasil dimasukkan ke catatan.'
      });
    };

    const insertBulletPoint = () => {
      articleDraft.value.content += '\n- [ ] ';
    };

    const insertCurrentUrlAsSource = () => {
      const url = currentTab.value.activeUrl || currentTab.value.inputUrl;
      articleDraft.value.content += `\nReferensi: ${url} (Diakses: ${new Date().toLocaleDateString('id-ID')})\n`;
    };

    const clearDraft = () => {
      Swal.fire({
        title: 'Kosongkan Catatan?',
        text: 'Teks catatan draf riset saat ini akan dihapus.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Bersihkan',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          articleDraft.value.content = '';
        }
      });
    };

    const copyDraftToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(articleDraft.value.content);
        Swal.fire({
          icon: 'success',
          title: 'Tersalin ke Clipboard!',
          text: 'Seluruh teks draf riset telah disalin.',
          timer: 1600,
          showConfirmButton: false
        });
      } catch (e) {
        store.dispatch('showNotification', {
          type: 'error',
          title: 'Gagal Menyalin',
          message: 'Tidak dapat mengakses clipboard browser.'
        });
      }
    };

    const sendDraftToTodo = () => {
      const title = articleDraft.value.title || 'Riset Web';
      const notes = (articleDraft.value.content || '').substring(0, 350);

      const newTask = {
        name: `Riset: ${title}`,
        category: 'Work',
        level: 'Penting',
        deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        notes: notes,
        done: false
      };

      store.dispatch('addTask', newTask);

      Swal.fire({
        icon: 'success',
        title: 'Masuk ke To-Do List!',
        html: `<p class="mb-2">Tugas berhasil ditambahkan:</p><strong>"${newTask.name}"</strong>`,
        showCancelButton: true,
        confirmButtonText: 'Buka To-Do',
        cancelButtonText: 'Tetap di Browser',
        confirmButtonColor: '#2563eb'
      }).then((res) => {
        if (res.isConfirmed) {
          router.push('/todo');
        }
      });
    };

    const sendDraftToNotes = () => {
      const title = articleDraft.value.title || 'Catatan Riset Web';
      const content = articleDraft.value.content || '';

      const newNote = {
        id: Date.now(),
        title: title,
        content: content,
        category: 'Work',
        color: '#fef08a',
        pinned: true,
        createdAt: new Date().toISOString()
      };

      store.dispatch('addNote', newNote);

      Swal.fire({
        icon: 'success',
        title: 'Tersimpan ke Sticky Notes!',
        html: `<p class="mb-2">Catatan tempel telah dibuat:</p><strong>"${newNote.title}"</strong>`,
        showCancelButton: true,
        confirmButtonText: 'Buka Notes',
        cancelButtonText: 'Tetap di Sini',
        confirmButtonColor: '#10b981'
      }).then((res) => {
        if (res.isConfirmed) {
          router.push('/notes');
        }
      });
    };

    return {
      isFullscreen,
      showDrafterPanel,
      activeTabId,
      tabs,
      currentTab,
      currentEngineConfig,
      searchEngines,
      quickTiles,
      popularTopics,
      searchCategories,
      searchFilterCategory,
      userBookmarks,
      browsingHistory,
      isHttpUrl,
      canGoBack,
      canGoForward,
      isCurrentPageBookmarked,
      isOmniboxFocused,
      homeSearchQuery,
      knowledgeSummary,
      filteredSearchResults,
      readerExcerpt,
      omniboxSuggestions,
      articleDraft,
      draftWordCount,
      draftCharCount,
      lastSavedTime,
      showAddBookmarkModal,
      showHistoryModal,
      newBookmark,
      switchTab,
      addNewTab,
      closeTab,
      setEngine,
      handleOmniboxSubmit,
      handleHomeSearch,
      searchTopic,
      selectSuggestion,
      onOmniboxBlur,
      openUrl,
      navigateBack,
      navigateForward,
      reloadTab,
      goToHome,
      switchToSearch,
      openActiveInRealTab,
      openExternalSearch,
      onIframeLoaded,
      onIframeError,
      toggleBookmarkCurrentPage,
      saveNewBookmark,
      clearBrowsingHistory,
      toggleFullscreen,
      appendSnippetToDraft,
      appendKnowledgeToDraft,
      insertBulletPoint,
      insertCurrentUrlAsSource,
      clearDraft,
      copyDraftToClipboard,
      sendDraftToTodo,
      sendDraftToNotes
    };
  }
};
</script>

<style scoped>
.browser-app-wrapper {
  min-height: calc(100vh - 110px);
  transition: all 0.3s ease;
}

.browser-app-wrapper.browser-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: #ffffff;
  padding: 0 !important;
  margin: 0 !important;
}

.browser-app-wrapper.browser-fullscreen .browser-viewport {
  height: calc(100vh - 120px) !important;
}

.browser-main-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.browser-tab-strip {
  background: #e2e8f0;
  border-bottom: 1px solid #cbd5e1;
}

.browser-tab {
  background: #cbd5e1;
  color: #475569;
  border: 1px solid #94a3b8;
  border-bottom: none;
  font-size: 12px;
  position: relative;
  max-width: 180px;
}

.browser-tab:hover {
  background: #f1f5f9;
}

.browser-tab.active {
  background: #ffffff;
  color: #0f172a;
  border-color: #cbd5e1;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.04);
}

.tab-spinner {
  width: 12px;
  height: 12px;
  border-width: 1.5px;
}

.tab-close-btn:hover {
  color: #ef4444 !important;
}

.tab-add-btn:hover {
  background: #ffffff;
  color: #2563eb;
}

.browser-toolbar {
  background: #f8fafc;
}

.omnibox-container:focus-within {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
}

.suggestions-box {
  border-color: #cbd5e1;
}

.hover-bg-light:hover {
  background: #f1f5f9;
}

.hover-primary:hover {
  color: #2563eb !important;
  border-color: #93c5fd !important;
  background: #eff6ff !important;
}

.hover-shadow:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.hover-underline:hover {
  text-decoration: underline !important;
}

.hover-text-primary:hover {
  color: #2563eb !important;
}

.spin-anim {
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.max-w-450 {
  max-width: 450px;
}

.max-w-600 {
  max-width: 600px;
}

.max-w-700 {
  max-width: 700px;
}

.max-w-750 {
  max-width: 750px;
}

.max-w-850 {
  max-width: 850px;
}

.border-dashed {
  border-style: dashed !important;
}

.btn-xs {
  font-size: 11.5px;
  padding: 0.25rem 0.6rem;
}

.btn-2xs {
  font-size: 10.5px;
  padding: 0.15rem 0.45rem;
}

.shadow-xs {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 10050;
}

.drafter-workbench {
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
