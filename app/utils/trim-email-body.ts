export function trimEmailBody(htmlContent: string): string {
  if (!htmlContent) return "";

  // Remove gmail signature sections if they exist
  htmlContent = htmlContent.replace(
    /<div class="gmail_signature"[\s\S]*?<\/div>/g,
    ""
  );
  htmlContent = htmlContent.replace(
    /<div class="gmail_signature_prefix"[\s\S]*?<\/div>/g,
    ""
  );

  // Remove all HTML tags and decode HTML entities
  const textContent = htmlContent
    .replace(/<p>|<\/p>/g, " ") // Replace paragraph tags with space
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ") // Replace common HTML entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"') // Replace HTML quote entity
    .replace(/&#34;/g, '"') // Replace numeric quote entity
    .replace(/&apos;/g, "'") // Replace HTML apostrophe
    .replace(/&#39;/g, "'") // Replace numeric apostrophe
    .replace(/&ldquo;|&rdquo;|&#8220;|&#8221;/g, '"') // Replace curly quotes
    .replace(/&lsquo;|&rsquo;|&#8216;|&#8217;/g, "'") // Replace curly apostrophes
    .replace(/\n\s*\n/g, "\n") // Normalize any consecutive line breaks to single line break
    .trim();

  return textContent;
}
