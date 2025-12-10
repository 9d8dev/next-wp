import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function stripHtmlTags(htmlString: string): string {
  if (!htmlString || typeof htmlString !== 'string') {
    return ''; 
  }
  return htmlString.replace(/<[^>]*>/g, '');
}

export function extractExcerptText(excerpt: string): string {
  if (!excerpt || typeof excerpt !== 'string') {
    return '';
  }
  const matches = excerpt.match(/<p>([\s\S]*)<\/p>/);
  return matches ? stripHtmlTags(matches[1]).trim() : '';
}