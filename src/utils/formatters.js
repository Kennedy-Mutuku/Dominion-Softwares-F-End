import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date) {
  return format(new Date(date), 'EEE, MMM d, yyyy');
}

export function formatDateTime(date) {
  return format(new Date(date), 'EEE, MMM d, yyyy • h:mm a');
}

export function formatTime(date) {
  return format(new Date(date), 'h:mm a');
}

export function formatCurrency(amount, currency = 'KES') {
  if (amount === 0) return 'Free';
  return `${currency} ${amount.toLocaleString()}`;
}

export function timeAgo(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}
