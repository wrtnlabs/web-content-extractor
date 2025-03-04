import { ElementType } from "domelementtype";
import * as domhandler from "domhandler";
import { TextDensityStat } from "./compute-text-density.js";

export function extractContentFromTextDensityMap(
  root: domhandler.AnyNode,
  map: Map<domhandler.AnyNode, TextDensityStat>
): domhandler.AnyNode[] {
  if (map.size === 0) {
    return [];
  }

  const threshold = computeThreshold(map);
  const contents: domhandler.AnyNode[] = [];

  function markAsContent(node: domhandler.AnyNode): void {
    // Ignore the node if one of its parent is already in the contents
    for (const content of contents) {
      if (isParentOf(content, node)) {
        return;
      }
    }

    // Collect all the indices of the children of the node in the contents
    const childIndices: number[] = [];

    for (let i = 0; i < contents.length; ++i) {
      if (isParentOf(contents[i], node)) {
        childIndices.push(i);
      }
    }

    // Remove the children from the contents
    for (let index = childIndices.length - 1; 0 <= index; --index) {
      contents.splice(childIndices[index], 1);
    }

    // Add the node to the contents
    contents.push(node);
  }

  extractContentFromNode(root, map, threshold, markAsContent);

  return contents;
}

function computeThreshold(
  map: Map<domhandler.AnyNode, TextDensityStat>
): number {
  const maximumDensitySumStat = Array.from(map.values()).reduce(
    (prev, current) => (prev.densitySum < current.densitySum ? current : prev)
  );

  let candidateStats: TextDensityStat[] = [maximumDensitySumStat];
  let parent = maximumDensitySumStat.element.parent;

  while (parent != null && parent.type === ElementType.Tag) {
    const stat = map.get(parent);

    if (stat == null) {
      break;
    }

    candidateStats.push(stat);
    parent = parent.parent;
  }

  const minimumDensitySumStatInCandidateStats = candidateStats.reduce(
    (prev, current) => (prev.densitySum < current.densitySum ? prev : current)
  );

  return minimumDensitySumStatInCandidateStats.densitySum;
}

function extractContentFromNode(
  node: domhandler.AnyNode,
  map: Map<domhandler.AnyNode, TextDensityStat>,
  threshold: number,
  markAsContent: (node: domhandler.AnyNode) => void
): void {
  const stat = map.get(node);

  if (stat == null) {
    return;
  }

  if (stat.densitySum < threshold) {
    return;
  }

  markAsContent(node);

  if (node.type !== ElementType.Tag) {
    return;
  }

  for (const child of node.children) {
    extractContentFromNode(child, map, threshold, markAsContent);
  }
}

function isParentOf(
  parent: domhandler.AnyNode,
  child: domhandler.AnyNode
): boolean {
  let childParent = child.parent;

  while (childParent != null) {
    if (childParent === parent) {
      return true;
    }

    childParent = childParent.parent;
  }

  return false;
}
