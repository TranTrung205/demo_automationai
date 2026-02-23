/**
 * Detect login page from DOM text
 */
export function isLoginPage(domText: string): boolean {

  const text = domText.toLowerCase();

  return (
    text.includes("user") &&
    text.includes("pass")
  );
}


/**
 * Detect cart page
 */
export function isCartPage(domText: string): boolean {

  const text = domText.toLowerCase();

  return (
    text.includes("cart") &&
    text.includes("checkout")
  );
}