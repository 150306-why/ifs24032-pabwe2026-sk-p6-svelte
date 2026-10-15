import { beforeEach, describe, expect, it, vi } from "vitest";
import { get } from "svelte/store";
import Swal from "sweetalert2";
import * as api from "../api/linkTreeApi.js";
import * as store from "./linkTreesStore.js";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));
vi.mock("../api/linkTreeApi.js", () => ({
  getLinkTrees: vi.fn(),
  getLinkTree: vi.fn(),
  addLinkTree: vi.fn(),
  changeLinkTree: vi.fn(),
  changeCover: vi.fn(),
  deleteLinkTree: vi.fn(),
  deleteAllLinkTrees: vi.fn(),
  addItem: vi.fn(),
  changeItem: vi.fn(),
  deleteItem: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  store.resetFlags();
  store.linkTrees.set([]);
  store.linkTree.set(null);
});

describe("fetch", () => {
  it("fetchLinkTrees mengisi koleksi", async () => {
    api.getLinkTrees.mockResolvedValue({ data: { link_trees: [{ id: 1 }] } });
    await store.fetchLinkTrees();
    expect(get(store.linkTrees)).toEqual([{ id: 1 }]);
    expect(get(store.loading)).toBe(false);
  });

  it("fetchLinkTrees gagal menampilkan error", async () => {
    api.getLinkTrees.mockRejectedValue(new Error("down"));
    await store.fetchLinkTrees();
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error", text: "down" }));
    expect(get(store.loading)).toBe(false);
  });

  it("fetchLinkTree memakai items di dalam link_tree", async () => {
    api.getLinkTree.mockResolvedValue({ data: { link_tree: { id: 1, items: [{ id: 5 }] } } });
    await store.fetchLinkTree(1);
    expect(get(store.linkTree)).toEqual({ id: 1, items: [{ id: 5 }] });
  });

  it("fetchLinkTree memakai items di data bila tidak ada di link_tree", async () => {
    api.getLinkTree.mockResolvedValue({ data: { link_tree: { id: 1 }, items: [{ id: 6 }] } });
    await store.fetchLinkTree(1);
    expect(get(store.linkTree).items).toEqual([{ id: 6 }]);
  });

  it("fetchLinkTree default ke array kosong", async () => {
    api.getLinkTree.mockResolvedValue({ data: { link_tree: { id: 1 } } });
    await store.fetchLinkTree(1);
    expect(get(store.linkTree).items).toEqual([]);
  });

  it("fetchLinkTree gagal menyisakan detail kosong", async () => {
    api.getLinkTree.mockRejectedValue(new Error("404"));
    await store.fetchLinkTree(1);
    expect(get(store.linkTree)).toBeNull();
  });
});

describe("mutasi", () => {
  const cases = [
    ["createLinkTree", () => store.createLinkTree({ title: "T" }), api.addLinkTree, store.isAdded],
    ["editLinkTree", () => store.editLinkTree(1, { title: "T" }), api.changeLinkTree, store.isChanged],
    ["editCover", () => store.editCover(1, "file"), api.changeCover, store.isCoverChanged],
    ["removeLinkTree", () => store.removeLinkTree(1), api.deleteLinkTree, store.isDeleted],
    ["removeAllLinkTrees", () => store.removeAllLinkTrees(), api.deleteAllLinkTrees, store.isDeletedAll],
    ["removeItem", () => store.removeItem(1, 2), api.deleteItem, store.isItemMutated],
  ];

  it.each(cases)("%s menaikkan bendera saat sukses", async (_name, run, apiFn, flag) => {
    apiFn.mockResolvedValue({});
    expect(await run()).toBe(true);
    expect(get(flag)).toBe(true);
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "success" }));
  });

  it("mutasi gagal tidak menaikkan bendera", async () => {
    api.addLinkTree.mockRejectedValue(new Error("invalid"));
    expect(await store.createLinkTree({})).toBe(false);
    expect(get(store.isAdded)).toBe(false);
    expect(Swal.fire).toHaveBeenCalledTimes(1);
  });

  it("saveItem menambah item baru bila item kosong", async () => {
    api.addItem.mockResolvedValue({});
    expect(await store.saveItem(1, null, { title: "A", url: "u" })).toBe(true);
    expect(api.addItem).toHaveBeenCalledWith(1, { title: "A", url: "u" });
    expect(get(store.isItemMutated)).toBe(true);
  });

  it("saveItem mengubah item yang ada", async () => {
    api.changeItem.mockResolvedValue({});
    expect(await store.saveItem(1, { id: 9 }, { title: "B", url: "u" })).toBe(true);
    expect(api.changeItem).toHaveBeenCalledWith(1, 9, { title: "B", url: "u" });
  });

  it("resetFlags menurunkan semua bendera", () => {
    [store.isAdded, store.isChanged, store.isCoverChanged, store.isDeleted, store.isDeletedAll, store.isItemMutated]
      .forEach((flag) => flag.set(true));
    store.resetFlags();
    expect(get(store.isAdded) || get(store.isChanged) || get(store.isCoverChanged)
      || get(store.isDeleted) || get(store.isDeletedAll) || get(store.isItemMutated)).toBe(false);
  });
});
