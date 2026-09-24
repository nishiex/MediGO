import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'INR') {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}

export function generateReservationCode() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `MED-${num}`;
}

export function getAvailabilityBadge(stock) {
  const count = typeof stock === 'number' ? stock : parseInt(stock, 10) || 0;
  if (count <= 0) {
    return {
      variant: 'danger',
      label: 'Out of Stock',
      color: 'rose'
    };
  }
  if (count <= 5) {
    return {
      variant: 'warning',
      label: 'Low Stock',
      color: 'amber'
    };
  }
  return {
    variant: 'success',
    label: 'In Stock',
    color: 'emerald'
  };
}
