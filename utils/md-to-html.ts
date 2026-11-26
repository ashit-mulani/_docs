import { marked } from "marked";

export async function mdToHtml(content: string): Promise<string> {
  try {
    const html = await marked.parse(content);
    return html;
  } catch (error) {
    console.error(error);
    return "";
  }
}
