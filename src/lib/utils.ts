import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // split an accented letter in the base letter and the accent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .replace(/[^a-z0-9]+/g, '-') // replace all non-alphanumeric characters with a hyphen
    .replace(/(^\-|\-$)/g, ''); // remove leading/trailing hyphens
}

export function getCategoryUrl(categoryName: string): string {
  return `/menu#${slugify(categoryName)}`;
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
}

export function isOpenNow(openingHours: { [key: string]: string }, closingHours: { [key: string]: string }): boolean {
  const now = new Date();
  const dayOfWeek = now.toLocaleDateString('ro-RO', { weekday: 'long' }).toLowerCase();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  
  const openTime = openingHours[dayOfWeek]?.replace(':', '') || '0000';
  const closeTime = closingHours[dayOfWeek]?.replace(':', '') || '0000';
  
  return currentTime >= parseInt(openTime) && currentTime <= parseInt(closeTime);
}
