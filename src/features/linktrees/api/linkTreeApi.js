import { apiRequest } from "../../../helpers/apiHelper.js";

export function getLinkTrees() {
  return apiRequest("GET", "/link-trees", {});
}

export function getLinkTree(id) {
  return apiRequest("GET", `/link-trees/${id}`, {});
}

export function addLinkTree({ title, type, description }) {
  return apiRequest("POST", "/link-trees", {
    json: { title, type, description },
  });
}

export function changeLinkTree(id, { title, type, description }) {
  return apiRequest("PUT", `/link-trees/${id}`, {
    json: { title, type, description },
  });
}

export function changeCover(id, file) {
  const form = new FormData();
  form.append("cover", file);
  return apiRequest("POST", `/link-trees/${id}/cover`, { form });
}

export function deleteLinkTree(id) {
  return apiRequest("DELETE", `/link-trees/${id}`, {});
}

export function deleteAllLinkTrees() {
  return apiRequest("DELETE", "/link-trees", {});
}

// Catatan: nama field item (title/url) mengikuti dokumentasi Delcom Link Tree.
// Jika dokumentasi memakai nama lain, ubah hanya di fungsi ini.
function itemBody({ title, url }) {
  return { title, label: title, url };
}

export function addItem(id, item) {
  return apiRequest("POST", `/link-trees/${id}/items`, { json: itemBody(item) });
}

export function changeItem(id, itemId, item) {
  return apiRequest("PUT", `/link-trees/${id}/items/${itemId}`, {
    json: itemBody(item),
  });
}

export function deleteItem(id, itemId) {
  return apiRequest("DELETE", `/link-trees/${id}/items/${itemId}`, {});
}
