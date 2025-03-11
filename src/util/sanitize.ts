import sanitizeHtml from 'sanitize-html';

export function sanitizeUserInput(input: string): string {
  // First sanitize HTML to remove any malicious tags/content
  const sanitized = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'escape'
  });

  // Decode HTML entities back to their original characters
  const decoded = sanitized
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#038;/g, '&')
    .replace(/&#38;/g, '&');

  return decoded;
}
