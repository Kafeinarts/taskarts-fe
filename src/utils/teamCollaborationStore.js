/**
 * Centralized Store for Team & Communication Suite (Kolaborasi Lintas Divisi)
 * Pure user-driven data persistence with NO DUMMY DATA.
 */

const STORAGE_KEYS = {
  BULLETINS: 'ft_team_bulletins',
  CHANNELS: 'ft_team_channels',
  MESSAGES: 'ft_team_messages',
  ASSETS: 'ft_team_shared_assets',
  TICKETS: 'ft_team_tickets',
  MEMBER_STATUS: 'ft_team_member_status',
  SHARED_EVENTS: 'ft_team_shared_events',
  EXPERT_PROFILES: 'ft_team_expert_profiles'
};

function safeGet(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    console.error('Error loading ' + key, e);
    return defaultVal;
  }
}

function safeSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Error saving ' + key, e);
  }
}

// 1. Company Bulletin & Broadcasts
export function getBulletins() {
  return safeGet(STORAGE_KEYS.BULLETINS, []);
}

export function saveBulletin(bulletin) {
  const list = getBulletins();
  if (bulletin.id) {
    const idx = list.findIndex(b => b.id === bulletin.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...bulletin, updatedAt: new Date().toISOString() };
    }
  } else {
    list.unshift({
      id: 'BLT-' + Date.now(),
      createdAt: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      ...bulletin
    });
  }
  safeSet(STORAGE_KEYS.BULLETINS, list);
  return list;
}

export function deleteBulletin(id) {
  const list = getBulletins().filter(b => b.id !== id);
  safeSet(STORAGE_KEYS.BULLETINS, list);
  return list;
}

// 2. Channels & Discussion
export function getChannels() {
  return safeGet(STORAGE_KEYS.CHANNELS, []);
}

export function createChannel(channelData) {
  const channels = getChannels();
  const newChan = {
    id: 'CHN-' + Date.now(),
    name: channelData.name.startsWith('#') ? channelData.name : '#' + channelData.name,
    topic: channelData.topic || '',
    divisions: channelData.divisions || ['Semua Tim'],
    createdBy: channelData.createdBy || 'Arif Permana Putrasuryana',
    createdAt: new Date().toISOString()
  };
  channels.push(newChan);
  safeSet(STORAGE_KEYS.CHANNELS, channels);
  return newChan;
}

export function deleteChannel(channelId) {
  const channels = getChannels().filter(c => c.id !== channelId);
  safeSet(STORAGE_KEYS.CHANNELS, channels);
  return channels;
}

export function getMessages(channelId) {
  const allMessages = safeGet(STORAGE_KEYS.MESSAGES, {});
  return allMessages[channelId] || [];
}

export function sendMessage(channelId, msg) {
  const allMessages = safeGet(STORAGE_KEYS.MESSAGES, {});
  if (!allMessages[channelId]) {
    allMessages[channelId] = [];
  }
  const newMsg = {
    id: 'MSG-' + Date.now(),
    channelId,
    senderName: msg.senderName || 'Arif Permana Putrasuryana',
    senderRole: msg.senderRole || 'Anggota Tim',
    senderDivision: msg.senderDivision || 'Umum',
    text: msg.text || '',
    attachmentUrl: msg.attachmentUrl || '',
    attachmentName: msg.attachmentName || '',
    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date().toISOString()
  };
  allMessages[channelId].push(newMsg);
  safeSet(STORAGE_KEYS.MESSAGES, allMessages);
  return newMsg;
}

// 3. Shared Asset & Document Hub
export function getSharedAssets() {
  return safeGet(STORAGE_KEYS.ASSETS, []);
}

export function saveSharedAsset(asset) {
  const list = getSharedAssets();
  const newAsset = {
    id: 'AST-' + Date.now(),
    title: asset.title,
    category: asset.category || 'Brand Guidelines',
    description: asset.description || '',
    fileUrl: asset.fileUrl || '',
    fileName: asset.fileName || 'berkas.pdf',
    fileType: asset.fileType || 'PDF',
    fileSize: asset.fileSize || '1.2 MB',
    uploadedBy: asset.uploadedBy || 'Arif Permana Putrasuryana',
    uploadDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  };
  list.unshift(newAsset);
  safeSet(STORAGE_KEYS.ASSETS, list);
  return list;
}

export function deleteSharedAsset(id) {
  const list = getSharedAssets().filter(a => a.id !== id);
  safeSet(STORAGE_KEYS.ASSETS, list);
  return list;
}

// 4. Internal Ticketing / Request System
export function getTickets() {
  return safeGet(STORAGE_KEYS.TICKETS, []);
}

export function saveTicket(ticket) {
  const list = getTickets();
  if (ticket.id) {
    const idx = list.findIndex(t => t.id === ticket.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...ticket, updatedAt: new Date().toISOString() };
    }
  } else {
    const count = list.length + 1;
    const pad = String(count).padStart(3, '0');
    list.unshift({
      id: 'TCK-' + Date.now(),
      ticketNumber: `TCK-${new Date().getFullYear()}-${pad}`,
      status: 'Menunggu', // Menunggu | Sedang Dikerjakan | Selesai | Ditolak
      createdAt: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      ...ticket
    });
  }
  safeSet(STORAGE_KEYS.TICKETS, list);
  return list;
}

export function updateTicketStatus(id, newStatus, resolutionNotes = '') {
  const list = getTickets();
  const idx = list.findIndex(t => t.id === id);
  if (idx !== -1) {
    list[idx].status = newStatus;
    if (resolutionNotes) {
      list[idx].resolutionNotes = resolutionNotes;
    }
    list[idx].updatedAt = new Date().toISOString();
    safeSet(STORAGE_KEYS.TICKETS, list);
  }
  return list;
}

export function deleteTicket(id) {
  const list = getTickets().filter(t => t.id !== id);
  safeSet(STORAGE_KEYS.TICKETS, list);
  return list;
}

// 5. Member Availability Status & Shared Events
export function getMemberStatuses() {
  return safeGet(STORAGE_KEYS.MEMBER_STATUS, []);
}

export function saveMemberStatus(statusData) {
  const list = getMemberStatuses();
  const idx = list.findIndex(m => m.id === statusData.id || m.name === statusData.name);
  const updatedObj = {
    id: statusData.id || 'MEM-' + Date.now(),
    name: statusData.name,
    division: statusData.division || 'Operasional',
    status: statusData.status || 'Di Kantor', // Di Kantor | WFH | Meeting | Dinas Luar | Cuti
    note: statusData.note || '',
    updatedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  };

  if (idx !== -1) {
    list[idx] = { ...list[idx], ...updatedObj };
  } else {
    list.push(updatedObj);
  }
  safeSet(STORAGE_KEYS.MEMBER_STATUS, list);
  return list;
}

export function deleteMemberStatus(id) {
  const list = getMemberStatuses().filter(m => m.id !== id);
  safeSet(STORAGE_KEYS.MEMBER_STATUS, list);
  return list;
}

export function getSharedEvents() {
  return safeGet(STORAGE_KEYS.SHARED_EVENTS, []);
}

export function saveSharedEvent(evt) {
  const list = getSharedEvents();
  if (evt.id) {
    const idx = list.findIndex(e => e.id === evt.id);
    if (idx !== -1) list[idx] = { ...list[idx], ...evt };
  } else {
    list.unshift({
      id: 'EVT-' + Date.now(),
      createdAt: new Date().toISOString(),
      ...evt
    });
  }
  safeSet(STORAGE_KEYS.SHARED_EVENTS, list);
  return list;
}

export function deleteSharedEvent(id) {
  const list = getSharedEvents().filter(e => e.id !== id);
  safeSet(STORAGE_KEYS.SHARED_EVENTS, list);
  return list;
}

// 6. Skill & Expertise Directory
export function getExpertProfiles() {
  return safeGet(STORAGE_KEYS.EXPERT_PROFILES, []);
}

export function saveExpertProfile(profile) {
  const list = getExpertProfiles();
  if (profile.id) {
    const idx = list.findIndex(p => p.id === profile.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...profile, updatedAt: new Date().toISOString() };
    }
  } else {
    list.unshift({
      id: 'EXP-' + Date.now(),
      createdAt: new Date().toISOString(),
      ...profile
    });
  }
  safeSet(STORAGE_KEYS.EXPERT_PROFILES, list);
  return list;
}

export function deleteExpertProfile(id) {
  const list = getExpertProfiles().filter(p => p.id !== id);
  safeSet(STORAGE_KEYS.EXPERT_PROFILES, list);
  return list;
}

export { STORAGE_KEYS };
