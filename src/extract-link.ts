import { ElementType } from "domelementtype";
import * as domhandler from "domhandler";
import { extractText } from "./extract-text.js";

/**
 * Represents a link.
 */
export interface Link {
  /**
   * The URL of the link.
   */
  url: string;

  /**
   * The content of the link.
   */
  content: string;
}

/**
 * Extracts links from the contents.
 *
 * @param contents - The contents to extract links from
 *
 * @returns The extracted links
 */
export function extractLink(contents: domhandler.AnyNode[]): Link[] {
  const links: Link[] = [];

  for (const content of contents) {
    extractLinkFromNode(content, links);
  }

  return links;
}

function extractLinkFromNode(node: domhandler.AnyNode, links: Link[]): void {
  if (node.type !== ElementType.Tag) {
    return;
  }

  if (node.name !== "a") {
    for (const child of node.children) {
      extractLinkFromNode(child, links);
    }

    return;
  }

  const url = node.attribs.href.trim();

  if (url.length === 0) {
    return;
  }

  const content = extractText(node);

  links.push({ url, content });
}
