import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/svelte";
import { get } from "svelte/store";
import { renderWithProviders } from "./test-utils.js";
import { currentPath, navigate } from "./router.js";
import { initAuth, ready, token } from "./features/auth/states/authStore.js";
import App from "./App.svelte";

const { stub } = vi.hoisted(() => ({
  stub: (label) => (anchor, props) => {
    const element = document.createElement("div");
    element.setAttribute("data-testid", label);
    element.setAttribute("data-props", JSON.stringify(props ? { ...props, children: undefined } : {}));
    anchor.before(element);
    if (props && props.children) {
      props.children(anchor);
    }
  },
}));

vi.mock("./features/auth/states/authStore.js", async () => {
  const { writable } = await import("svelte/store");
  return { token: writable(null), ready: writable(false), initAuth: vi.fn() };
});
vi.mock("./features/auth/layouts/AuthLayout.svelte", () => ({ default: stub("auth-layout") }));
vi.mock("./features/auth/pages/LoginPage.svelte", () => ({ default: stub("login") }));
vi.mock("./features/auth/pages/RegisterPage.svelte", () => ({ default: stub("register") }));
vi.mock("./features/linktrees/layouts/LinkTreeLayout.svelte", () => ({ default: stub("app-layout") }));
vi.mock("./features/linktrees/pages/HomePage.svelte", () => ({ default: stub("home") }));
vi.mock("./features/linktrees/pages/DetailPage.svelte", () => ({ default: stub("detail") }));
vi.mock("./features/users/pages/UsersPage.svelte", () => ({ default: stub("users") }));
vi.mock("./features/users/pages/ProfilePage.svelte", () => ({ default: stub("profile") }));
vi.mock("./features/common/pages/NotFoundPage.svelte", () => ({ default: stub("notfound") }));

beforeEach(() => {
  vi.clearAllMocks();
  token.set(null);
  ready.set(false);
  window.history.pushState({}, "", "/");
  currentPath.set("/");
});

describe("App", () => {
  it("belum merender apa pun sebelum autentikasi siap", () => {
    renderWithProviders(App);
    expect(initAuth).toHaveBeenCalled();
    expect(screen.queryByTestId("app-layout")).not.toBeInTheDocument();
    expect(screen.queryByTestId("auth-layout")).not.toBeInTheDocument();
  });

  it("pengguna anonim di rute app dialihkan ke login", async () => {
    ready.set(true);
    renderWithProviders(App);
    await waitFor(() => expect(screen.getByTestId("login")).toBeInTheDocument());
    expect(screen.getByTestId("auth-layout")).toBeInTheDocument();
    expect(window.location.pathname).toBe("/auth/login");
  });

  it("pengguna anonim bisa membuka halaman register", async () => {
    ready.set(true);
    navigate("/auth/register");
    renderWithProviders(App);
    await waitFor(() => expect(screen.getByTestId("register")).toBeInTheDocument());
  });

  it("pengguna login melihat layout aplikasi dan halaman beranda", async () => {
    ready.set(true);
    token.set("tok");
    renderWithProviders(App);
    await waitFor(() => expect(screen.getByTestId("home")).toBeInTheDocument());
    expect(screen.getByTestId("app-layout")).toBeInTheDocument();
  });

  it("pengguna login di rute auth dialihkan ke beranda", async () => {
    ready.set(true);
    token.set("tok");
    navigate("/auth/login");
    renderWithProviders(App);
    await waitFor(() => expect(screen.getByTestId("home")).toBeInTheDocument());
    expect(window.location.pathname).toBe("/");
  });

  it("memetakan rute detail, pengguna, profil, dan 404", async () => {
    ready.set(true);
    token.set("tok");
    renderWithProviders(App);
    navigate("/link-trees/42");
    await waitFor(() => expect(screen.getByTestId("detail")).toBeInTheDocument());
    expect(screen.getByTestId("detail").getAttribute("data-props")).toContain('"linkTreeId":"42"');
    navigate("/users");
    await waitFor(() => expect(screen.getByTestId("users")).toBeInTheDocument());
    navigate("/profile");
    await waitFor(() => expect(screen.getByTestId("profile")).toBeInTheDocument());
    navigate("/entah");
    await waitFor(() => expect(screen.getByTestId("notfound")).toBeInTheDocument());
  });

  it("logout mengalihkan kembali ke login", async () => {
    ready.set(true);
    token.set("tok");
    renderWithProviders(App);
    await waitFor(() => expect(screen.getByTestId("home")).toBeInTheDocument());
    token.set(null);
    await waitFor(() => expect(screen.getByTestId("login")).toBeInTheDocument());
    expect(get(currentPath)).toBe("/auth/login");
  });

  it("melepas listener router saat dilepas", () => {
    const { unmount } = renderWithProviders(App);
    unmount();
    window.history.pushState({}, "", "/users");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(get(currentPath)).toBe("/");
  });
});
