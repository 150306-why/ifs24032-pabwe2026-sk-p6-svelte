import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";
import { logout, profile } from "../../auth/states/authStore.js";
import Navbar from "./Navbar.svelte";

vi.mock("../../auth/states/authStore.js", async () => {
  const { writable } = await import("svelte/store");
  return { profile: writable(null), logout: vi.fn() };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Navbar", () => {
  it("menampilkan inisial dan logout", async () => {
    profile.set({ name: "budi", photo: null });
    renderWithProviders(Navbar);
    expect(screen.getByText("Delcom Link Tree")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    await fireEvent.click(screen.getByRole("button", { name: "Keluar" }));
    expect(logout).toHaveBeenCalled();
  });

  it("menampilkan foto bila ada", () => {
    profile.set({ name: "Budi", photo: "http://x/p.png" });
    renderWithProviders(Navbar);
    expect(screen.getByAltText("Budi")).toBeInTheDocument();
  });
});
