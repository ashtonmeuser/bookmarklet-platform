Object.defineProperty(global, 'location', {
  writable: true,
  value: { href: '', hash: '' },
});
