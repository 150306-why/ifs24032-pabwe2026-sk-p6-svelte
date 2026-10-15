import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/svelte";
import { get } from "svelte/store";
import { renderWithProviders } from "../../../test-utils.js";
import * as store from "../states/linkTreesStore.js";
import { showConfirmDialog } from "../../../helpers/toolsHelper.js";
import { currentPath } from "../../../router.js";
import DetailPage from "./DetailPage.svelte";

vi.mock("../states/linkTreesStore.js", async () => {
  const { writable } = await import("svelte/store");
  return {
    linkTree: writable(null),
    loading: writable(false),
    isChanged: writable(false),
    isCoverChanged: writable(false),
    isItemMutated: writable(false),
    fetchLinkTree: vi.fn(),
    removeLinkTree: vi.fn(),
    removeItem: vi.fn(),
    resetFlags: vi.fn(),
    editLinkTree: vi.fn(),
    editCover: vi.fn(),
    saveItem: vi.fn(),
  };
});
vi.mock("../../../helpers/toolsHelper.js", () => ({
  showConfirmDialog: vi.fn(),
  showWarningDialog: vi.fn(),
}));

const detail = {
  id: 7,
  title: "Portofolio",
  type: "public",
  description: "Deskripsi",
  cover: "http://x/c.png",
  items: [{ id: 11, title: "GitHub", url: "https://github.com" }],
};

beforeEach(() => {
  vi.clearAllMocks();
  store.linkTree.set(detail);
  store.loading.set(false);
  store.isChanged.set(false);
  store.isCoverChanged.set(false);
  store.isItemMutated.set(false);
  currentPath.set("/link-trees/7");
});

describe("DetailPage", () => {
  it("memuat detail dan menampilkan data lengkap", () => {
    renderWithProviders(DetailPage, { linkTreeId: "7" });
    expect(store.fetchLinkTree).toHaveBeenCalledWith("7");
    expect(screen.getByRole("heading", { name: "Portofolio" })).toBeInTheDocument();
    expect(screen.getByAltText("Portofolio")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", "https://github.com");
  });

  it("menampilkan keadaan tanpa cover dan tanpa item", () => {
    store.linkTree.set({ ...detail, cover: null, items: [] });
    renderWithProviders(DetailPage, { linkTreeId: "7" });
    expect(screen.queryByAltText("Portofolio")).not.toBeInTheDocument();
    expect(screen.getByText("Belum ada tautan.")).toBeInTheDocument();
  });

  it("menampilkan status memuat dan tidak ditemukan", () => {
    store.linkTree.set(null);
    store.loading.set(true);
    const first = renderWithProviders(DetailPage, { linkTreeId: "7" });
    expect(screen.getByText("Memuat...")).toBeInTheDocument();
    first.unmount();
    store.loading.set(false);
    renderWithProviders(DetailPage, { linkTreeId: "7" });
    expect(screen.getByText("Link tree tidak ditemukan.")).toBeInTheDocument();
  });

  it("membuka dan menutup modal ubah data, sampul, serta item", async () => {
    renderWithProviders(DetailPage, { linkTreeId: "7" });

    await fireEvent.click(screen.getByRole("button", { name: /Ubah Data/ }));
    expect(screen.getByRole("heading", { name: "Ubah Link Tree" })).toBeInTheDocument();
    await fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    await fireEvent.click(screen.getByRole("button", { name: /Ubah Sampul/ }));
    expect(screen.getByRole("heading", { name: "Ubah Sampul" })).toBeInTheDocument();
    await fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    await fireEvent.click(screen.getByRole("button", { name: /Tambah Item/ }));
    expect(screen.getByRole("heading", { name: "Tambah Item" })).toBeInTheDocument();
    await fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    await fireEvent.click(screen.getByRole("button", { name: "Ubah GitHub" }));
    expect(screen.getByRole("heading", { name: "Ubah Item" })).toBeInTheDocument();
  });

  it("menghapus link tree lalu kembali ke beranda", async () => {
    showConfirmDialog.mockResolvedValue(true);
    store.removeLinkTree.mockResolvedValue(true);
    renderWithProviders(DetailPage, { linkTreeId: "7" });
    await fireEvent.click(screen.getByRole("button", { name: /Hapus$/ }));
    await waitFor(() => expect(get(currentPath)).toBe("/"));
    expect(store.removeLinkTree).toHaveBeenCalledWith(7);
  });

  it("tetap di halaman bila penghapusan gagal", async () => {
    showConfirmDialog.mockResolvedValue(true);
    store.removeLinkTree.mockResolvedValue(false);
    renderWithProviders(DetailPage, { linkTreeId: "7" });
    await fireEvent.click(screen.getByRole("button", { name: /Hapus$/ }));
    await waitFor(() => expect(store.removeLinkTree).toHaveBeenCalled());
    expect(get(currentPath)).toBe("/link-trees/7");
  });

  it("tidak menghapus link tree bila dibatalkan", async () => {
    showConfirmDialog.mockResolvedValue(false);
    renderWithProviders(DetailPage, { linkTreeId: "7" });
    await fireEvent.click(screen.getByRole("button", { name: /Hapus$/ }));
    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
    expect(store.removeLinkTree).not.toHaveBeenCalled();
  });

  it("menghapus item dengan konfirmasi dan membatalkannya", async () => {
    renderWithProviders(DetailPage, { linkTreeId: "7" });
    showConfirmDialog.mockResolvedValueOnce(true);
    await fireEvent.click(screen.getByRole("button", { name: "Hapus GitHub" }));
    await waitFor(() => expect(store.removeItem).toHaveBeenCalledWith(7, 11));
    showConfirmDialog.mockResolvedValueOnce(false);
    await fireEvent.click(screen.getByRole("button", { name: "Hapus GitHub" }));
    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalledTimes(2));
    expect(store.removeItem).toHaveBeenCalledTimes(1);
  });

  it.each([["isChanged"], ["isCoverChanged"], ["isItemMutated"]])(
    "memuat ulang saat bendera %s naik",
    async (flag) => {
      renderWithProviders(DetailPage, { linkTreeId: "7" });
      store.fetchLinkTree.mockClear();
      store[flag].set(true);
      await waitFor(() => expect(store.resetFlags).toHaveBeenCalled());
      expect(store.fetchLinkTree).toHaveBeenCalledWith("7");
    }
  );
});
