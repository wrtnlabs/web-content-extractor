import { ElementType } from "domelementtype";
import * as domhandler from "domhandler";

export interface TextDensityStat {
  order: number;
  element: domhandler.AnyNode;
  density: number;
  densitySum: number;
  /**
   * The number of **child** tags.
   */
  tagCount: number;
  /**
   * The total text length of the node including all descendants.
   */
  textLength: number;
  /**
   * The number of **child** link tags.
   */
  linkTagCount: number;
  /**
   * The total link text length of the node including all descendants.
   */
  linkTextLength: number;
}

export function computeTextDensity(
  root: domhandler.AnyNode
): Map<domhandler.AnyNode, TextDensityStat> {
  const stats = collectStats(root);

  if (stats.size === 0) {
    return stats;
  }

  const rootTextLength = stats.get(root)!.textLength;
  const rootLinkTextLength = stats.get(root)!.linkTextLength;
  const rootLinkTextRatio = rootLinkTextLength / Math.max(1, rootTextLength);

  for (const stat of stats.values()) {
    stat.density = computeTextDensityOfNode(stat, rootLinkTextRatio);

    const parent = stat.element.parent;

    if (parent == null) {
      continue;
    }

    const parentStat = stats.get(parent);

    if (parentStat == null) {
      continue;
    }

    parentStat.densitySum += stat.density;
  }

  return stats;
}

function computeTextDensityOfNode(
  stat: TextDensityStat,
  rootLinkTextRatio: number
): number {
  if (stat.element.type === ElementType.Tag && stat.element.name === "a") {
    return computeLinkTextDensityOfNode(stat, rootLinkTextRatio);
  }

  return computeNormalTextDensityOfNode(stat);
}

function computeNormalTextDensityOfNode(stat: TextDensityStat): number {
  const tagCount = Math.max(1, stat.tagCount);
  const textLength = stat.textLength;
  return textLength / tagCount;
}

function computeLinkTextDensityOfNode(
  stat: TextDensityStat,
  rootLinkTextRatio: number
): number {
  const tagCount = Math.max(1, stat.tagCount);
  const textLength = stat.textLength;
  const linkTagCount = Math.max(1, stat.linkTagCount);
  const linkTextLength = stat.linkTextLength;

  const textDensity = textLength / tagCount;
  const logBase = Math.log(
    (textLength / Math.max(1, textLength - linkTextLength)) * linkTextLength +
      rootLinkTextRatio * textLength +
      1e-3
  );
  const logArg =
    ((textLength / Math.max(1, linkTextLength)) * tagCount) / linkTagCount;

  function logWithBase(x: number, base: number): number {
    return Math.log(x) / Math.log(base);
  }

  return textDensity * logWithBase(Math.max(1, logArg), Math.max(2, logBase));
}

function collectStats(
  root: domhandler.AnyNode
): Map<domhandler.AnyNode, TextDensityStat> {
  const stats = new Map<domhandler.AnyNode, TextDensityStat>();

  if (root != null) {
    augmentStats(root, stats);
  }

  return stats;
}

function augmentStats(
  node: domhandler.AnyNode,
  stats: Map<domhandler.AnyNode, TextDensityStat>
) {
  if (node.type !== ElementType.Tag) {
    return;
  }

  const textLength = computeTextLengthOfNode(node);
  const isLink = node.type === ElementType.Tag && node.name === "a";

  stats.set(node, {
    order: stats.size,
    element: node,
    density: 0,
    densitySum: 0,
    tagCount: 0,
    textLength,
    linkTagCount: 0,
    linkTextLength: isLink ? textLength : 0,
  });

  let parent = node.parent;

  while (parent != null && parent.type === ElementType.Tag) {
    const stat = stats.get(parent);

    if (stat == null) {
      break;
    }

    stat.tagCount += 1;
    stat.textLength += textLength;

    if (isLink) {
      stat.linkTagCount += 1;
      stat.linkTextLength += textLength;
    }

    parent = parent.parent;
  }

  for (const child of node.children) {
    augmentStats(child, stats);
  }
}

function computeTextLengthOfNode(node: domhandler.Element): number {
  let length = 0;

  for (const child of node.children) {
    let childLength = 0;

    if (child.type === ElementType.Text) {
      childLength = child.data.trim().length;
    } else if (child.type === ElementType.Tag) {
      childLength = computeTextLengthOfNode(child);
    }

    if (childLength === 0) {
      continue;
    }

    if (length !== 0) {
      length += 1;
    }

    length += childLength;
  }

  return length;
}
