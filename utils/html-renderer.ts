import { buildMenuHtml } from "./build-menu-html.js";
import { MenuItemType } from "./build-menu-tree.js";
import { escapeHtml } from "./escape-html.js";
import { mdToHtml } from "./md-to-html.js";

export async function renderHtml({
  menuTree,
  content,
  currentSlug,
}: {
  menuTree: MenuItemType[];
  content: string;
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
        <style>
            * {
              box-sizing: border-box;
              color: #B3B1B1;
            }
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              background-color: #2A2A2A
            }
            .layout {
              display: flex;
              min-height: 100vh;
            }
            a {
              text-decoration: none;
            }
            .active {
              color: #E75031;
              font-weight: 600;
            }
            a:hover {
              text-decoration: underline;
            }
            li {
              list-style: none;
            }
            .content{
              padding: 0px 10px 0px 10px;
            }
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
