import { beforeEach, describe, expect, it, vi } from "vitest";
import { get } from "svelte/store";
import { currentPath, go, initRouter, navigate, resolveRoute } from "./router.js";

beforeEach(() => {
  window.history.pushState({}, "", "/");
  currentPath.set("/");
});

describe("router", () => {
  it("navigate mengubah URL dan store", () => {
    navigate("/users");
    expect(window.location.pathname).toBe("/users");
    expect(get(currentPath)).toBe("/users");
  });

  it("go mencegah aksi bawaan lalu berpindah", () => {
    const event = { preventDefault: vi.fn() };
    go(event, "/profile");
    expect(event.preventDefault).toHaveBeenCalled();
    expect(get(currentPath)).toBe("/profile");
  });

  it("initRouter menyinkronkan path dan mendengarkan popstate", () => {
    window.history.pushState({}, "", "/users");
    const stop = initRouter();
    expect(get(currentPath)).toBe("/users");
    window.history.pushState({}, "", "/profile");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(get(currentPath)).toBe("/profile");
    stop();
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(get(currentPath)).toBe("/profile");
  });

  it("resolveRoute memetakan semua rute", () => {
    expect(resolveRoute("/auth/login")).toEqual({ layout: "auth", page: "login", params: {} });
    expect(resolveRoute("/auth/register").page).toBe("register");
    expect(resolveRoute("/").page).toBe("home");
    expect(resolveRoute("/users").page).toBe("users");
    expect(resolveRoute("/profile").page).toBe("profile");
    expect(resolveRoute("/link-trees/7")).toEqual({
      layout: "app",
      page: "detail",
      params: { linkTreeId: "7" },
    });
    expect(resolveRoute("/tidak-ada")).toEqual({ layout: "app", page: "notfound", params: {} });
  });
});
