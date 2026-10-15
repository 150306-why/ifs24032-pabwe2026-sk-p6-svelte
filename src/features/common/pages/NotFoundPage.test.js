import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/svelte";
import { get } from "svelte/store";
import { renderWithProviders } from "../../../test-utils.js";
import { currentPath } from "../../../router.js";
import NotFoundPage from "./NotFoundPage.svelte";

describe("NotFoundPage", () => {
  it("menampilkan pesan dan tautan beranda", async () => {
    currentPath.set("/entah");
    renderWithProviders(NotFoundPage);
    expect(screen.getByText("404")).toBeInTheDocument();
    await fireEvent.click(screen.getByRole("link", { name: "Kembali ke Beranda" }));
    expect(get(currentPath)).toBe("/");
  });
});
