import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import Swal from 'sweetalert2';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// In-memory token cache (NEVER persist tokens in localStorage/sessionStorage)
let cachedAccessToken = null;
let currentGoogleUser = null;

// Configure Google Auth Provider with Calendar Scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar');
provider.addScope('https://www.googleapis.com/auth/calendar.events');

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

export async function signInWithGoogleCalendar() {
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
    console.error('Google Calendar OAuth error:', error);
    return {
      success: false,
      error: error.message || 'Gagal masuk dengan Google Calendar'
    };
  }
}

export async function signOutGoogle() {
  try {
    await signOut(auth);
    cachedAccessToken = null;
    currentGoogleUser = null;
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch events from Google Calendar
 */
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
    if (response.status === 401) {
      cachedAccessToken = null;
      throw new Error('Sesi Google Calendar berakhir. Silakan login ulang.');
    }
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Gagal mengambil agenda dari Google Calendar (${response.status})`);
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Create a new event on Google Calendar with explicit confirmation
 */
export async function createGoogleCalendarEvent(eventData) {
  if (!cachedAccessToken) {
    throw new Error('Belum login dengan akun Google Calendar.');
  }

  // Explicit confirmation as mandated by Skill rules
  const confirmResult = await Swal.fire({
    title: 'Konfirmasi Tambah ke Google Calendar',
    html: `Apakah Anda yakin ingin menambahkan event <strong>"${eventData.summary}"</strong> pada <strong>${eventData.start?.dateTime ? new Date(eventData.start.dateTime).toLocaleString('id-ID') : eventData.start?.date}</strong> langsung ke Google Calendar akun Anda?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Sinkronkan ke Google Calendar',
    cancelButtonText: 'Batal'
  });

  if (!confirmResult.isConfirmed) {
    return { cancelled: true };
  }

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

/**
 * Delete event from Google Calendar with explicit confirmation
 */
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

  if (!confirmResult.isConfirmed) {
    return { cancelled: true };
  }

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
