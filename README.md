# web-content-extractor

A small and fast library for extracting content from HTML.

It is an one of implementation of the paper [DOM Based Content Extraction via Text Density](https://ofey.me/assets/pdf/cetd-sigir11.pdf).

## Installation

To install via NPM:

```bash
npm i @wrtnlabs/web-content-extractor
```

## Usage

```ts
import { extractContent } from "@wrtnlabs/web-content-extractor";

const { title, description, content, contentHtmls, links } =
  extractContent(html);

console.log("title", title);
console.log("description", description);

console.log("content", content); // The content of the page; string

for (const fragment of contentHtmls) {
  console.log("fragment", fragment); // The fragment of the content; string
}

for (const link of links) {
  console.log("url", link.url); // The URL of the link
  console.log("content", link.content); // The content of the link
}
```

## Note

It strips some tags that can be considered as non-content tags, including:

- `script`
- `noscript`
- `style`
- `nav`
- `header`
- `footer`
- `img`
- `svg`
- `video`
- `audio`
- `form`
- `label`
- `input`
- `select`
- `option`
- `button`
- `object`
- `embed`
- `iframe`
- `canvas`
- `map`
- `area`
