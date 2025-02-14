import { ElementType } from "domelementtype";
import * as domhandler from "domhandler";

export function extractLink(contents: domhandler.AnyNode[]): string[] {
  const links: string[] = [];

  for (const content of contents) {
    extractLinkFromNode(content, links);
  }

  return links;
}

function extractLinkFromNode(node: domhandler.AnyNode, links: string[]): void {
  if (node.type !== ElementType.Tag) {
    return;
  }

  if (node.name !== "a") {
    for (const child of node.children) {
      extractLinkFromNode(child, links);
    }

    return;
  }

  const link = node.attribs.href.trim();

  if (link.length === 0) {
    return;
  }

  links.push(link);
}
