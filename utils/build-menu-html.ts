import { MenuItemType } from "./build-menu-tree.js";
import { escapeHtml } from "./escape-html.js";

export function buildMenuHtml({
  currentSlug,
  items,
}: {
  items: MenuItemType[];
  currentSlug: string;
}): string {
  return `
      <ul>
        ${items
          .map((item) => {
            const active = item.slug === currentSlug;
            return `
              <li>
                <a
                  href="${escapeHtml(item.slug)}"
                  class="${active ? "active" : ""}"
                >
                  ${escapeHtml(item.title)}
                </a>
                ${
                  item.children?.length
                    ? buildMenuHtml({
                        currentSlug,
                        items: item.children,
                      })
                    : ""
                }
              </li>
            `;
          })
          .join("")}
      </ul>
    `;
}
