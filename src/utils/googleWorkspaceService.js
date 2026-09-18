import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import Swal from 'sweetalert2';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// In-memory token cache (NEVER persist tokens in localStorage/sessionStorage)
let cachedAccessToken = null;
let currentGoogleUser = null;

// Configure Google Auth Provider with all requested Google Workspace Scopes
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/meetings.space.created',
  'https://www.googleapis.com/auth/meetings.space.readonly',
  'https://www.googleapis.com/auth/meetings.space.settings',
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/user.emails.read',
  'https://www.googleapis.com/auth/user.phonenumbers.read'
];

const provider = new GoogleAuthProvider();
WORKSPACE_SCOPES.forEach(scope => provider.addScope(scope));

// Listen to auth state
onAuthStateChanged(auth, (user) => {
  currentGoogleUser = user;
});

export function getCachedToken() {
  return cachedAccessToken;
}

export function getCurrentGoogleUser() {
  return currentGoogleUser || auth.currentUser;
}

export function isGoogleConnected() {
  return !!(cachedAccessToken && (currentGoogleUser || auth.currentUser));
}

/**
 * Sign in to Google Workspace with popup
 */
export async function signInWithGoogleWorkspace() {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential ? credential.accessToken : null;
    currentGoogleUser = result.user;
    return {
      success: true,
      user: result.user,
      token: cachedAccessToken
    };
  } catch (error) {
    console.error('Google Workspace OAuth error:', error);
    return {
      success: false,
      error: error.message || 'Gagal masuk dengan Akun Google Workspace'
    };
  }
}

export async function signOutGoogleWorkspace() {
  try {
    await signOut(auth);
    cachedAccessToken = null;
    currentGoogleUser = null;
    return { success: true };
  } catch (error) {
    console.error('Google sign out error:', error);
    return { success: false, error: error.message };
  }
}

// -------------------------------------------------------------
// 1. GOOGLE CONTACTS (People API)
// -------------------------------------------------------------

/**
 * Fetch contacts list from Google Account
 */
export async function fetchGoogleContacts(pageSize = 100) {
  if (!cachedAccessToken) {
    throw new Error('Belum terhubung ke Akun Google. Silakan login terlebih dahulu.');
  }

  const url = `https://people.googleapis.com/v1/people/me/connections?pageSize=${pageSize}&personFields=names,emailAddresses,phoneNumbers,photos,organizations`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      cachedAccessToken = null;
      throw new Error('Sesi Google telah berakhir. Silakan login ulang.');
    }
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Gagal mengambil kontak dari Google (${response.status})`);
  }

  const data = await response.json();
  const connections = data.connections || [];

  return connections.map(person => {
    const primaryName = person.names?.[0]?.displayName || 'Tanpa Nama';
    const primaryEmail = person.emailAddresses?.[0]?.value || '';
    const primaryPhone = person.phoneNumbers?.[0]?.value || '';
    const photoUrl = person.photos?.[0]?.url || '';
    const org = person.organizations?.[0]?.name || '';
    const title = person.organizations?.[0]?.title || '';

    return {
      resourceName: person.resourceName,
      name: primaryName,
      email: primaryEmail,
      phone: primaryPhone,
      photo: photoUrl,
      company: org,
      role: title,
      raw: person
    };
  });
}

/**
 * Create a new contact in Google Contacts (with explicit user confirmation)
 */
export async function createGoogleContact(contactData) {
  if (!cachedAccessToken) {
    throw new Error('Belum terhubung ke Google Contacts.');
  }

  const confirm = await Swal.fire({
    title: 'Konfirmasi Tambah Kontak Google',
    html: `Apakah Anda ingin menyimpan kontak <strong>"${contactData.name}"</strong> ke Google Contacts akun Anda?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Simpan ke Google',
    cancelButtonText: 'Batal'
  });

  if (!confirm.isConfirmed) return { cancelled: true };

  const body = {
    names: [{ givenName: contactData.name }],
    emailAddresses: contactData.email ? [{ value: contactData.email, type: 'work' }] : [],
    phoneNumbers: contactData.phone ? [{ value: contactData.phone, type: 'mobile' }] : [],
    organizations: (contactData.company || contactData.role) ? [{
      name: contactData.company || '',
      title: contactData.role || ''
    }] : []
  };

  const response = await fetch('https://people.googleapis.com/v1/people:createContact', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal menyimpan kontak ke Google Contacts');
  }

  return await response.json();
}

/**
 * Delete a contact from Google Contacts (with explicit confirmation)
 */
export async function deleteGoogleContact(resourceName, contactName) {
  if (!cachedAccessToken) {
    throw new Error('Belum login dengan Akun Google.');
  }

  const confirm = await Swal.fire({
    title: 'Hapus Kontak Google?',
    html: `Kontak <strong>"${contactName || 'Kontak'}"</strong> akan dihapus secara permanen dari Google Contacts Anda. Tindakan ini tidak dapat dibatalkan.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Hapus Permanen',
    cancelButtonText: 'Batal'
  });

  if (!confirm.isConfirmed) return { cancelled: true };

  const response = await fetch(`https://people.googleapis.com/v1/${resourceName}:deleteContact`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`
    }
  });

  if (!response.ok && response.status !== 204) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal menghapus kontak dari Google Contacts');
  }

  return { success: true };
}

// -------------------------------------------------------------
// 2. GOOGLE DRIVE API
// -------------------------------------------------------------

/**
 * List files in Google Drive
 */
export async function fetchGoogleDriveFiles(query = "trashed = false", pageSize = 50) {
  if (!cachedAccessToken) {
    throw new Error('Belum terhubung ke Google Drive.');
  }

  const url = `https://www.googleapis.com/drive/v3/files?pageSize=${pageSize}&fields=files(id,name,mimeType,webViewLink,webContentLink,size,createdTime,modifiedTime,iconLink)&q=${encodeURIComponent(query)}&orderBy=modifiedTime desc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Gagal mengambil berkas Google Drive (${response.status})`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Upload JSON / text content to Google Drive (e.g. backup or export)
 */
export async function uploadJsonToGoogleDrive(fileName, contentObj, description = 'TaskArts Backup Data') {
  if (!cachedAccessToken) {
    throw new Error('Belum terhubung ke Google Drive.');
  }

  const confirm = await Swal.fire({
    title: 'Simpan ke Google Drive',
    html: `Apakah Anda ingin mengunggah berkas <strong>"${fileName}"</strong> ke Google Drive Anda?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    confirmButtonText: 'Ya, Unggah ke Drive',
    cancelButtonText: 'Batal'
  });

  if (!confirm.isConfirmed) return { cancelled: true };

  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    description: description
  };

  const fileContent = typeof contentObj === 'string' ? contentObj : JSON.stringify(contentObj, null, 2);
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`
    },
    body: multipartRequestBody
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal mengunggah berkas ke Google Drive');
  }

  return await response.json();
}

/**
 * Delete a file from Google Drive (with explicit confirmation)
 */
export async function deleteGoogleDriveFile(fileId, fileName) {
  if (!cachedAccessToken) {
    throw new Error('Belum login dengan Akun Google.');
  }

  const confirm = await Swal.fire({
    title: 'Hapus Berkas dari Google Drive?',
    html: `Berkas <strong>"${fileName || 'Berkas'}"</strong> akan dihapus dari Google Drive Anda.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Ya, Hapus Berkas',
    cancelButtonText: 'Batal'
  });

  if (!confirm.isConfirmed) return { cancelled: true };

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`
    }
  });

  if (!response.ok && response.status !== 204) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal menghapus berkas dari Google Drive');
  }

  return { success: true };
}

// -------------------------------------------------------------
// 3. GOOGLE SHEETS API
// -------------------------------------------------------------

/**
 * Create a new Google Spreadsheet and populate with table rows
 */
export async function createGoogleSpreadsheet(title, headers = [], rows = []) {
  if (!cachedAccessToken) {
    throw new Error('Belum terhubung ke Google Sheets.');
  }

  const confirm = await Swal.fire({
    title: 'Buat Google Spreadsheet',
    html: `Apakah Anda ingin membuat Spreadsheet baru berjudul <strong>"${title}"</strong> langsung di Google Drive Anda?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    confirmButtonText: 'Ya, Buat Google Sheet',
    cancelButtonText: 'Batal'
  });

  if (!confirm.isConfirmed) return { cancelled: true };

  // Step 1: Create the spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: title
      }
    })
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membuat Google Spreadsheet baru');
  }

  const spreadsheet = await createRes.json();
  const spreadsheetId = spreadsheet.spreadsheetId;
  const sheetUrl = spreadsheet.spreadsheetUrl;

  // Step 2: Write headers and data rows if provided
  if (headers.length > 0 || rows.length > 0) {
    const values = [];
    if (headers.length > 0) values.push(headers);
    if (rows.length > 0) values.push(...rows);

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cachedAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: values
      })
    });
  }

  return {
    success: true,
    spreadsheetId,
    spreadsheetUrl: sheetUrl
  };
}

/**
 * Read range values from Google Spreadsheet
 */
export async function readSpreadsheetValues(spreadsheetId, range = 'A1:Z100') {
  if (!cachedAccessToken) {
    throw new Error('Belum login dengan Akun Google.');
  }

  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}`, {
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal membaca isi Google Spreadsheet');
  }

  const data = await response.json();
  return data.values || [];
}

// -------------------------------------------------------------
// 4. GOOGLE MEET API
// -------------------------------------------------------------

/**
 * Create a Google Meet meeting space using Google Meet API v2 or Calendar conference fallback
 */
export async function createGoogleMeetSpace(meetingTopic = 'Rapat Tim TaskArts') {
  if (!cachedAccessToken) {
    throw new Error('Belum terhubung ke Akun Google.');
  }

  // Attempt 1: Call Google Meet API v2
  try {
    const response = await fetch('https://meet.googleapis.com/v2/spaces', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cachedAccessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        config: {
          accessType: 'OPEN'
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        meetingUri: data.meetingUri,
        meetingCode: data.meetingCode,
        spaceName: data.name
      };
    }
  } catch (meetErr) {
    console.warn('Google Meet API v2 direct creation fallback to Calendar Conference:', meetErr);
  }

  // Attempt 2: Fallback using Google Calendar conferenceData (guaranteed Hangouts/Meet generation)
  const now = new Date();
  const endTime = new Date(now.getTime() + 60 * 60 * 1000);

  const calBody = {
    summary: meetingTopic,
    description: 'Sesi Google Meet dibuat melalui TaskArts Integration Hub',
    start: { dateTime: now.toISOString() },
    end: { dateTime: endTime.toISOString() },
    conferenceData: {
      createRequest: {
        requestId: `taskarts-meet-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };

  const calRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(calBody)
  });

  if (calRes.ok) {
    const calData = await calRes.json();
    const entryPoint = calData.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video');
    const meetUrl = entryPoint?.uri || calData.hangoutLink || `https://meet.google.com/new`;
    const meetCode = meetUrl.split('/').pop() || '';

    return {
      success: true,
      meetingUri: meetUrl,
      meetingCode: meetCode,
      eventId: calData.id
    };
  }

  // Fallback direct URL if permissions are strictly client-side
  return {
    success: true,
    meetingUri: 'https://meet.google.com/new',
    meetingCode: 'instant-meet'
  };
}

// -------------------------------------------------------------
// 5. GOOGLE CALENDAR API (Integrated)
// -------------------------------------------------------------

export async function fetchGoogleCalendarEvents(timeMin, timeMax) {
  if (!cachedAccessToken) {
    throw new Error('Belum terhubung ke akun Google. Silakan login terlebih dahulu.');
  }

  const min = timeMin || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const max = timeMax || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(min)}&timeMax=${encodeURIComponent(max)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Gagal mengambil agenda dari Google Calendar (${response.status})`);
  }

  const data = await response.json();
  return data.items || [];
}

export async function createGoogleCalendarEvent(eventData) {
  if (!cachedAccessToken) {
    throw new Error('Belum login dengan akun Google Calendar.');
  }

  const confirmResult = await Swal.fire({
    title: 'Konfirmasi Tambah ke Google Calendar',
    html: `Apakah Anda yakin ingin menambahkan event <strong>"${eventData.summary}"</strong> ke Google Calendar akun Anda?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Sinkronkan',
    cancelButtonText: 'Batal'
  });

  if (!confirmResult.isConfirmed) return { cancelled: true };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal menambahkan event ke Google Calendar');
  }

  return await response.json();
}

export async function deleteGoogleCalendarEvent(eventId, eventTitle) {
  if (!cachedAccessToken) {
    throw new Error('Belum login dengan Google Calendar.');
  }

  const confirmResult = await Swal.fire({
    title: 'Hapus dari Google Calendar?',
    text: `Event "${eventTitle || 'Event'}" akan dihapus dari Google Calendar akun Anda.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Hapus Sekarang',
    cancelButtonText: 'Batal'
  });

  if (!confirmResult.isConfirmed) return { cancelled: true };

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`
    }
  });

  if (!response.ok && response.status !== 204) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal menghapus event dari Google Calendar');
  }

  return { success: true };
}
