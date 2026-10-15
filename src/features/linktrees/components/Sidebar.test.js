import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/svelte";
import { get } from "svelte/store";
import { renderWithProviders } from "../../../test-utils.js";
import { currentPath } from "../../../router.js";
import Sidebar from "./Sidebar.svelte";

describe("Sidebar", () => {
  it("menandai menu aktif dan berpindah halaman", async () => {
    currentPath.set("/");
    renderWithProviders(Sidebar);
    expect(screen.getByRole("link", { name: /Semua Link Tree/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /Pengguna/ })).not.toHaveAttribute("aria-current");
    await fireEvent.click(screen.getByRole("link", { name: /Pengguna/ }));
    expect(get(currentPath)).toBe("/users");
    expect(screen.getByRole("link", { name: /Pengguna/ })).toHaveAttribute("aria-current", "page");
  });
});
