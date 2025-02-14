# web-content-extractor

A small and fast library for extracting content from HTML.

It is an one of implementation of the paper [DOM Based Content Extraction via Text Density](https://ofey.me/assets/pdf/cetd-sigir11.pdf).

## Usage

```ts
import { extractContent } from "@wrtnlabs/web-content-extractor";

const content = extractContent(html);
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
