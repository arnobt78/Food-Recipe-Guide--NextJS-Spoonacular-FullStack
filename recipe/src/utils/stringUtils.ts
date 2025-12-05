/**
 * String Utility Functions
 * 
 * Reusable string manipulation functions
 */

/**
 * Capitalize each word in a string
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalizeWords(str: string | undefined): string {
  if (!str) return "";
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Add target="_blank" to all links in HTML string
 * 
 * @param html - HTML string containing links
 * @returns HTML string with target="_blank" added to links
 */
export function addTargetBlankToLinks(html: string | undefined): string {
  if (!html) return "";
  return html.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
}

