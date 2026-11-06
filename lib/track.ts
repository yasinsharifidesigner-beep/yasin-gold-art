const sent = new Set<string>();

export function track(name: string, place = '') {
  if (typeof window === 'undefined') return;
  const once = name === 'page_view' || name === 'thankyou_view' || name === 'auth_state_resolved' || name === 'scroll_depth';
  const key = `${name}:${place}`;
  if (once && sent.has(key)) return;
  sent.add(key);
  const body = JSON.stringify({ name, place, path: window.location.pathname });
  fetch('/api/events', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
}
