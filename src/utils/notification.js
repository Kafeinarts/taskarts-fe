// Utility for handling browser system notifications and dispatching in-app toasts

export function checkNotificationSupport() {
  return 'Notification' in window;
}

export function getNotificationPermission() {
  if (!checkNotificationSupport()) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission() {
  if (!checkNotificationSupport()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return 'denied';
  }
}

export function sendOnDeviceNotification(title, options = {}) {
  const isEnabled = localStorage.getItem('ft_notifications_enabled') !== 'false';
  
  const notifTitle = (typeof title === 'object' && title !== null)
    ? (title.title || 'Notifikasi Sistem')
    : (title || 'Notifikasi Sistem');

  const opts = (typeof title === 'object' && title !== null)
    ? title
    : (options || {});

  const notifBody = opts.body || opts.message || '';
  const notifType = opts.type || 'info';
  const notifIcon = opts.icon || 'bi-bell-fill';
  
  // 1. Dispatch custom event for in-app toast notification
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('app-toast-notification', {
        detail: {
          id: Date.now() + Math.random().toString(36).substr(2, 4),
          title: notifTitle,
          body: notifBody,
          type: notifType, // 'success', 'warning', 'danger', 'info'
          icon: notifIcon
        }
      })
    );
  }

  // 2. Trigger native device notification if permitted & enabled
  if (!isEnabled) return;

  if (typeof window !== 'undefined' && checkNotificationSupport() && Notification.permission === 'granted') {
    try {
      const notif = new Notification(notifTitle, {
        body: notifBody || 'RajinKerja Work Suite System Alert',
        icon: '/logo.svg',
        badge: '/logo.svg',
        tag: opts.tag || 'rajinkerja-notif-' + Date.now(),
        renotify: true,
        vibrate: [200, 100, 200]
      });

      notif.onclick = () => {
        window.focus();
        if (opts.url) {
          window.location.hash = opts.url;
        }
      };
    } catch (e) {
      console.warn('Browser system notification call error:', e);
    }
  }
}
