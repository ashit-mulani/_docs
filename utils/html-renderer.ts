import { buildMenuHtml } from "./build-menu-html.js";
import { MenuItemType } from "./build-menu-tree.js";
import { mdToHtml } from "./md-to-html.js";

export async function renderHtml({
  menuTree,
  content,
  cssContent,
  currentSlug,
}: {
  menuTree: MenuItemType[];
  content: string;
  cssContent?: string;
  currentSlug: string;
}): Promise<string> {
  const contentHtml = await mdToHtml(content);
  const menuHtml = buildMenuHtml({
    items: menuTree,
    currentSlug,
  });
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Documentation</title>
        <link rel="stylesheet" href="/_index.css" />
        <style>
         ${cssContent}
        </style>
      </head>
      <body>
        <div class="layout">
          <aside class="sidebar">
            ${menuHtml}
          </aside>
          <main class="content">
            ${contentHtml}
          </main>
        </div>
      </body>
    </html>
  `;
}
