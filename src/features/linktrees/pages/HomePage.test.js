import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/svelte";
import { get } from "svelte/store";
import { renderWithProviders } from "../../../test-utils.js";
import * as store from "../states/linkTreesStore.js";
import { profile } from "../../auth/states/authStore.js";
import { showConfirmDialog } from "../../../helpers/toolsHelper.js";
import { currentPath } from "../../../router.js";
import HomePage from "./HomePage.svelte";

vi.mock("../states/linkTreesStore.js", async () => {
  const { writable } = await import("svelte/store");
  return {
    linkTrees: writable([]),
    isAdded: writable(false),
    isDeleted: writable(false),
    isDeletedAll: writable(false),
    fetchLinkTrees: vi.fn(),
    removeLinkTree: vi.fn(),
    removeAllLinkTrees: vi.fn(),
    resetFlags: vi.fn(),
    createLinkTree: vi.fn(),
  };
});
vi.mock("../../auth/states/authStore.js", async () => {
  const { writable } = await import("svelte/store");
  return { profile: writable({ id: 1 }) };
});
vi.mock("../../../helpers/toolsHelper.js", () => ({ showConfirmDialog: vi.fn() }));

const trees = [
  { id: 1, user_id: 1, title: "Portofolio", type: "public", description: "d1", cover: "http://x/c.png" },
  { id: 2, user_id: 2, title: "Kampus", type: "private", description: null, cover: null },
  { id: 3, user_id: 1, title: "Rahasia", type: "unlisted", description: "x", cover: null },
];

beforeEach(() => {
  vi.clearAllMocks();
  store.linkTrees.set(trees);
  store.isAdded.set(false);
  store.isDeleted.set(false);
  store.isDeletedAll.set(false);
  profile.set({ id: 1 });
});

describe("HomePage", () => {
  it("memuat data, menampilkan daftar dan statistik", () => {
    renderWithProviders(HomePage);
    expect(store.fetchLinkTrees).toHaveBeenCalled();
    expect(screen.getByText("Portofolio")).toBeInTheDocument();
    expect(screen.getByAltText("Portofolio")).toBeInTheDocument();
    expect(screen.getByTestId("stat-total")).toHaveTextContent("3");
    expect(screen.getByTestId("stat-public")).toHaveTextContent("1");
    expect(screen.getByTestId("stat-unlisted")).toHaveTextContent("1");
    expect(screen.getByTestId("stat-private")).toHaveTextContent("1");
    expect(screen.getByTestId("stat-mine")).toHaveTextContent("2");
  });

  it("mencari berdasarkan judul", async () => {
    renderWithProviders(HomePage);
    await fireEvent.input(screen.getByPlaceholderText("Cari judul..."), { target: { value: "kamp" } });
    expect(screen.getByText("Kampus")).toBeInTheDocument();
    expect(screen.queryByText("Portofolio")).not.toBeInTheDocument();
  });

  it("memfilter milik saya", async () => {
    renderWithProviders(HomePage);
    await fireEvent.click(screen.getByLabelText("Milik saya", { selector: 'input[type="checkbox"]' }));
    expect(screen.queryByText("Kampus")).not.toBeInTheDocument();
    expect(screen.getByText("Rahasia")).toBeInTheDocument();
  });

  it("menampilkan keadaan kosong dan menonaktifkan hapus semua", () => {
    store.linkTrees.set([]);
    renderWithProviders(HomePage);
    expect(screen.getByText("Belum ada link tree.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hapus Semua" })).toBeDisabled();
  });

  it("menghapus satu link tree setelah konfirmasi", async () => {
    showConfirmDialog.mockResolvedValue(true);
    renderWithProviders(HomePage);
    await fireEvent.click(screen.getByRole("button", { name: "Hapus Kampus" }));
    await waitFor(() => expect(store.removeLinkTree).toHaveBeenCalledWith(2));
  });

  it("tidak menghapus bila konfirmasi dibatalkan", async () => {
    showConfirmDialog.mockResolvedValue(false);
    renderWithProviders(HomePage);
    await fireEvent.click(screen.getByRole("button", { name: "Hapus Kampus" }));
    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
    expect(store.removeLinkTree).not.toHaveBeenCalled();
  });

  it("hapus semua dengan dan tanpa konfirmasi", async () => {
    renderWithProviders(HomePage);
    showConfirmDialog.mockResolvedValueOnce(true);
    await fireEvent.click(screen.getByRole("button", { name: "Hapus Semua" }));
    await waitFor(() => expect(store.removeAllLinkTrees).toHaveBeenCalled());
    showConfirmDialog.mockResolvedValueOnce(false);
    await fireEvent.click(screen.getByRole("button", { name: "Hapus Semua" }));
    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalledTimes(2));
    expect(store.removeAllLinkTrees).toHaveBeenCalledTimes(1);
  });

  it.each([["isAdded"], ["isDeleted"], ["isDeletedAll"]])(
    "memuat ulang saat bendera %s naik",
    async (flag) => {
      renderWithProviders(HomePage);
      store.fetchLinkTrees.mockClear();
      store[flag].set(true);
      await waitFor(() => expect(store.resetFlags).toHaveBeenCalled());
      expect(store.fetchLinkTrees).toHaveBeenCalled();
    }
  );

  it("membuka dan menutup modal tambah", async () => {
    renderWithProviders(HomePage);
    await fireEvent.click(screen.getByRole("button", { name: /Tambah Link Tree/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("tautan judul berpindah ke halaman detail", async () => {
    renderWithProviders(HomePage);
    await fireEvent.click(screen.getByRole("link", { name: "Portofolio" }));
    expect(get(currentPath)).toBe("/link-trees/1");
  });
});
