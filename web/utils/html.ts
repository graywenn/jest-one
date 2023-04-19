import Convert from 'ansi-to-html';
export function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const convert = new Convert({
  colors: {
    1: '#FF4F56',
    2: '#19E28D',
  },
});
