import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";
import { doLogin } from "../states/authStore.js";
import { showErrorDialog } from "../../../helpers/toolsHelper.js";
import { currentPath } from "../../../router.js";
import { get } from "svelte/store";
import LoginPage from "./LoginPage.svelte";

vi.mock("../states/authStore.js", () => ({ doLogin: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({ showErrorDialog: vi.fn() }));

async function fillAndSubmit(container) {
  await fireEvent.input(screen.getByLabelText("Email"), { target: { value: "a@b.c" } });
  await fireEvent.input(screen.getByLabelText("Kata Sandi"), { target: { value: "pw" } });
  await fireEvent.submit(container.querySelector("form"));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("LoginPage", () => {
  it("login berhasil memanggil doLogin", async () => {
    doLogin.mockResolvedValue();
    const { container } = renderWithProviders(LoginPage);
    await fillAndSubmit(container);
    await waitFor(() => expect(doLogin).toHaveBeenCalledWith("a@b.c", "pw"));
    expect(showErrorDialog).not.toHaveBeenCalled();
  });

  it("login gagal menampilkan dialog error", async () => {
    doLogin.mockRejectedValue(new Error("Salah"));
    const { container } = renderWithProviders(LoginPage);
    await fillAndSubmit(container);
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Salah"));
  });

  it("tautan daftar berpindah ke /auth/register", async () => {
    renderWithProviders(LoginPage);
    await fireEvent.click(screen.getByRole("link", { name: "Daftar" }));
    expect(get(currentPath)).toBe("/auth/register");
  });
});
