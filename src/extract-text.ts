import { ElementType } from "domelementtype";
import * as domhandler from "domhandler";

export function extractText(node: domhandler.AnyNode): string {
  if (node.type === ElementType.Text) {
    return node.data;
  }

  if (node.type !== ElementType.Tag) {
    return "";
  }

  let fragments: string[] = [];

  for (const child of node.children) {
    fragments.push(extractText(child));
  }

  return fragments
    .map((str) => str.trim())
    .filter((str) => str.length !== 0)
    .join(" ");
}
