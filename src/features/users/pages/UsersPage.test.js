import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";
import { fetchUsers, users } from "../states/usersStore.js";
import UsersPage from "./UsersPage.svelte";

vi.mock("../states/usersStore.js", async () => {
  const { writable } = await import("svelte/store");
  return { users: writable([]), fetchUsers: vi.fn() };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("UsersPage", () => {
  it("memuat dan menampilkan pengguna dengan atau tanpa foto", () => {
    users.set([
      { id: 1, name: "Budi", email: "b@x.c", photo: "http://x/p.png" },
      { id: 2, name: "sari", email: "s@x.c", photo: null },
    ]);
    renderWithProviders(UsersPage);
    expect(fetchUsers).toHaveBeenCalled();
    expect(screen.getByAltText("Budi")).toBeInTheDocument();
    expect(screen.getByText("s@x.c")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument();
  });
});
