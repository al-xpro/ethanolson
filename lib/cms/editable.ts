// Storyblok marks every block in the draft with `_editable` (an HTML comment holding its
// ids). Spread on the element that shows the block, these attributes let the Visual Editor
// outline it and open its fields on click. Published content has no marker: nothing is added.
export function editable(block?: { _editable?: string } | null): Record<string, string> {
  const marker = block?._editable;
  if (!marker?.startsWith("<!--#storyblok#")) return {};
  try {
    const options = JSON.parse(marker.replace(/^<!--#storyblok#/, "").replace(/-->$/, "")) as { id: string; uid: string };
    return { "data-blok-c": JSON.stringify(options), "data-blok-uid": `${options.id}-${options.uid}` };
  } catch {
    return {};
  }
}

/** A short, stable key for some content: the page remounts when it changes in the Visual Editor */
export function fingerprint(value: unknown) {
  let hash = 0;
  for (const char of JSON.stringify(value)) hash = (Math.imul(31, hash) + char.charCodeAt(0)) | 0;
  return String(hash);
}
