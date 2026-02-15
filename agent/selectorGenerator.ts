export function generateSelector(el: any) {

  if (!el) return null;   // ✅ FIX QUAN TRỌNG

  if (el.id) return `#${el.id}`;
  if (el.name) return `[name="${el.name}"]`;
  if (el.placeholder) return `[placeholder="${el.placeholder}"]`;

  return null;
}
