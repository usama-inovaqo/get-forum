export function trimEmailHtml(html: string): string {
  // Remove gmail signature sections if they exist
  html = html.replace(/<div class="gmail_signature"[\s\S]*?<\/div>/g, "");
  html = html.replace(
    /<div class="gmail_signature_prefix"[\s\S]*?<\/div>/g,
    ""
  );
  // Remove Gmail quote and attribution elements
  html = html.replace(/<div class="gmail_quote"[\s\S]*?<\/div>/g, "");
  html = html.replace(/<div class="gmail_quote_container"[\s\S]*?<\/div>/g, "");
  html = html.replace(/<div class="gmail_attr"[\s\S]*?<\/div>/g, "");
  // Remove blockquote elements
  html = html.replace(/<blockquote[\s\S]*?<\/blockquote>/gi, "");
  return (
    html
      // Remove DOCTYPE declaration
      .replace(/<!DOCTYPE[^>]*>/i, "")
      // Remove html tag and its attributes
      .replace(/<html[^>]*>|<\/html>/gi, "")
      // Remove head section completely
      .replace(/<head[\s\S]*?<\/head>/i, "")
      // Replace body tag (with attributes) with div
      .replace(/<body([^>]*)>/i, "<div$1>")
      .replace(/<\/body>/i, "</div>")
      // Clean up any excessive whitespace
      .trim()
  );
}
