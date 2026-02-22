/**
 * Compress DOM to reduce LLM tokens
 * Keep only important / interactive elements
 */

export interface DOMElement {
  tag?: string;
  text?: string;
  id?: string;
  class?: string;
  name?: string;
  placeholder?: string;
  role?: string;
}

/**
 * Detect interactive element
 */
function isInteractive(el: DOMElement) {

  const interactiveTags = [
    "button",
    "input",
    "a",
    "select",
    "textarea"
  ];

  if (!el) return false;

  if (interactiveTags.includes((el.tag || "").toLowerCase()))
    return true;

  if (el.role) return true;

  if (el.id) return true;

  if (el.class?.toLowerCase().includes("btn"))
    return true;

  return false;
}

/**
 * Clean text
 */
function clean(text?: string) {

  if (!text) return "";

  return text
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

/**
 * Main compressor
 */
export function compressDOM(
  elements: DOMElement[]
) {

  if (!elements || !Array.isArray(elements))
    return [];

  const filtered = elements.filter(isInteractive);

  const sliced = filtered.slice(0, 25); // ⭐ sweet spot for LLM

  return sliced.map((el) => ({
    tag: el.tag,
    text: clean(el.text),
    id: el.id,
    class: el.class,
    placeholder: el.placeholder,
    role: el.role
  }));
}