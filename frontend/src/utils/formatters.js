export function formatNumber(value) {
  return new Intl.NumberFormat('es-AR').format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function teamLabel(team) {
  return team === 'Dictadores' ? 'Dictadores' : 'Tramposos';
}
