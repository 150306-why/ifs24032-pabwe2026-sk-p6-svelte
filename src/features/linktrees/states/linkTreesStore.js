import { writable } from "svelte/store";
import * as api from "../api/linkTreeApi.js";
import { attempt, showSuccessDialog } from "../../../helpers/toolsHelper.js";

export const linkTrees = writable([]);
export const linkTree = writable(null);
export const loading = writable(false);

export const isAdded = writable(false);
export const isChanged = writable(false);
export const isCoverChanged = writable(false);
export const isDeleted = writable(false);
export const isDeletedAll = writable(false);
export const isItemMutated = writable(false);

export function resetFlags() {
  isAdded.set(false);
  isChanged.set(false);
  isCoverChanged.set(false);
  isDeleted.set(false);
  isDeletedAll.set(false);
  isItemMutated.set(false);
}

async function mutate(action, flag, message) {
  const ok = await attempt(action);
  if (ok) {
    flag.set(true);
    await showSuccessDialog(message);
  }
  return ok;
}

export async function fetchLinkTrees() {
  loading.set(true);
  await attempt(async () => {
    const result = await api.getLinkTrees();
    linkTrees.set(result.data.link_trees);
  });
  loading.set(false);
}

export async function fetchLinkTree(id) {
  loading.set(true);
  linkTree.set(null);
  await attempt(async () => {
    const result = await api.getLinkTree(id);
    const detail = result.data.link_tree;
    linkTree.set({ ...detail, items: detail.items ?? result.data.items ?? [] });
  });
  loading.set(false);
}

export function createLinkTree(payload) {
  return mutate(() => api.addLinkTree(payload), isAdded, "Link tree berhasil ditambahkan");
}

export function editLinkTree(id, payload) {
  return mutate(() => api.changeLinkTree(id, payload), isChanged, "Link tree berhasil diubah");
}

export function editCover(id, file) {
  return mutate(() => api.changeCover(id, file), isCoverChanged, "Sampul berhasil diubah");
}

export function removeLinkTree(id) {
  return mutate(() => api.deleteLinkTree(id), isDeleted, "Link tree berhasil dihapus");
}

export function removeAllLinkTrees() {
  return mutate(() => api.deleteAllLinkTrees(), isDeletedAll, "Semua link tree berhasil dihapus");
}

export function saveItem(id, item, payload) {
  if (item) {
    return mutate(() => api.changeItem(id, item.id, payload), isItemMutated, "Item berhasil diubah");
  }
  return mutate(() => api.addItem(id, payload), isItemMutated, "Item berhasil ditambahkan");
}

export function removeItem(id, itemId) {
  return mutate(() => api.deleteItem(id, itemId), isItemMutated, "Item berhasil dihapus");
}
