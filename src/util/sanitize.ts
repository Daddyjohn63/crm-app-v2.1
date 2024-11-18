import sanitizeHtml from 'sanitize-html';

export function sanitizeUserInput(input: string): string {
  // Remove all HTML tags and their content
  const noTagsOrContent = input
    // Remove pairs of tags and their content
    .replace(/<[^>]*>[^<]*<\/[^>]*>/g, '')
    // Remove self-closing tags
    .replace(/<[^>]*\/>/g, '')
    // Remove incomplete/broken tags
    .replace(/<[^>]*>/g, '')
    // Remove any remaining < or >
    .replace(/[<>]/g, '');

  // Use sanitizeHtml as final safety net
  return sanitizeHtml(noTagsOrContent, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'recursiveEscape'
  });
}
