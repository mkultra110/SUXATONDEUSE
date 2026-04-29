// Notifications push web (idee #427). Wrapper minimal autour de l'API
// Notification standard. Demande la permission une seule fois lors du
// premier opt-in, puis envoie des notifications "offline ready".

let askedRef = false;

export async function requestNotificationPermission(): Promise<boolean> {
  if (askedRef) return Notification.permission === 'granted';
  if (typeof window === 'undefined') return false;
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  askedRef = true;
  try {
    const result = await Notification.requestPermission();
    return result === 'granted';
  } catch {
    return false;
  }
}

export function notify(title: string, body: string, opts: NotificationOptions = {}) {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body, icon: '/favicon.svg', ...opts });
  } catch {
    /* ignore */
  }
}
