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
  
  // 1. Dispatch custom event for in-app toast notification
  window.dispatchEvent(
    new CustomEvent('app-toast-notification', {
      detail: {
        id: Date.now() + Math.random().toString(36).substr(2, 4),
        title,
        body: options.body || '',
        type: options.type || 'info', // 'success', 'warning', 'danger', 'info'
        icon: options.icon || 'bi-bell-fill'
      }
    })
  );

  // 2. Trigger native device notification if permitted & enabled
  if (!isEnabled) return;

  if (checkNotificationSupport() && Notification.permission === 'granted') {
    try {
      const notif = new Notification(title, {
        body: options.body || 'RajinKerja Work Suite System Alert',
        icon: '/logo.svg',
        badge: '/logo.svg',
        tag: options.tag || 'rajinkerja-notif-' + Date.now(),
        renotify: true,
        vibrate: [200, 100, 200]
      });

      notif.onclick = () => {
        window.focus();
        if (options.url) {
          window.location.hash = options.url;
        }
      };
    } catch (e) {
      console.warn('Browser system notification call error:', e);
    }
  }
}
