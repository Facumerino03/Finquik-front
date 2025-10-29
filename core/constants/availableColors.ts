export const AVAILABLE_COLORS = [
  { name: 'Zinc', value: '#71717a', bg: '#f4f4f5' },      // zinc-500 / zinc-100
  { name: 'Blue', value: '#3b82f6', bg: '#dbeafe' },      // blue-500 / blue-100
  { name: 'Sky', value: '#0ea5e9', bg: '#e0f2fe' },       // sky-500 / sky-100
  { name: 'Green', value: '#22c55e', bg: '#dcfce7' },     // green-500 / green-100
  { name: 'Orange', value: '#f97316', bg: '#ffedd5' },    // orange-500 / orange-100
  { name: 'Red', value: '#ef4444', bg: '#fee2e2' },       // red-500 / red-100
  { name: 'Pink', value: '#ec4899', bg: '#fce7f3' },      // pink-500 / pink-100
  { name: 'Purple', value: '#a855f7', bg: '#f3e8ff' },    // purple-500 / purple-100
  { name: 'Violet', value: '#8b5cf6', bg: '#ede9fe' },    // violet-500 / violet-100
  { name: 'Indigo', value: '#6366f1', bg: '#e0e7ff' },    // indigo-500 / indigo-100
] as const;

export type AvailableColor = typeof AVAILABLE_COLORS[number];