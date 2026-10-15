import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/svelte";
import { renderWithProviders, textSnippet } from "../../../test-utils.js";
import LinkTreeLayout from "./LinkTreeLayout.svelte";

vi.mock("../../auth/states/authStore.js", async () => {
  const { writable } = await import("svelte/store");
  return { profile: writable({ name: "Budi", photo: null }), logout: vi.fn() };
});

describe("LinkTreeLayout", () => {
  it("membungkus navbar, sidebar, dan konten", () => {
    renderWithProviders(LinkTreeLayout, { children: textSnippet("<p>konten halaman</p>") });
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Menu utama" })).toBeInTheDocument();
    expect(screen.getByText("konten halaman")).toBeInTheDocument();
  });
});
