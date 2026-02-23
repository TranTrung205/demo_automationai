/**
 * Compress DOM for LLM consumption
 */
export function compressDOM(dom: any): string {

  if (!dom) return "";

  try {

    let text = JSON.stringify(dom);

    // remove long attributes
    text = text.replace(/"style":".*?"/g, "");
    text = text.replace(/"class":".*?"/g, "");

    // limit size
    if (text.length > 4000) {
      text = text.slice(0, 4000);
    }

    return text;

  } catch {
    return "";
  }
}