import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

export async function mdToHtml(content: string): Promise<string> {
  const html = await marked.parse(content);
  return sanitizeHtml(html);
}
