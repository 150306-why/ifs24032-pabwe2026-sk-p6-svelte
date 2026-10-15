import { writable } from "svelte/store";

export const currentPath = writable(window.location.pathname);

export function navigate(path) {
  window.history.pushState({}, "", path);
  currentPath.set(path);
}

export function go(event, path) {
  event.preventDefault();
  navigate(path);
}

export function initRouter() {
  const sync = () => currentPath.set(window.location.pathname);
  sync();
  window.addEventListener("popstate", sync);
  return () => window.removeEventListener("popstate", sync);
}

const routes = {
  "/auth/login": { layout: "auth", page: "login", params: {} },
  "/auth/register": { layout: "auth", page: "register", params: {} },
  "/": { layout: "app", page: "home", params: {} },
  "/users": { layout: "app", page: "users", params: {} },
  "/profile": { layout: "app", page: "profile", params: {} },
};

export function resolveRoute(path) {
  const found = routes[path];
  if (found) {
    return found;
  }
  const match = path.match(/^\/link-trees\/([^/]+)$/);
  if (match) {
    return { layout: "app", page: "detail", params: { linkTreeId: match[1] } };
  }
  return { layout: "app", page: "notfound", params: {} };
}
