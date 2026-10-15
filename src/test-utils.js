import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";

export function renderWithProviders(Component, props = {}) {
  return render(Component, { props });
}

export function textSnippet(html) {
  return createRawSnippet(() => ({ render: () => html }));
}
