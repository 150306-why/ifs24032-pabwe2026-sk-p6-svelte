import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/svelte";
import { get } from "svelte/store";
import { renderWithProviders } from "../../../test-utils.js";
import { doRegister } from "../states/authStore.js";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";
import { currentPath } from "../../../router.js";
import RegisterPage from "./RegisterPage.svelte";

vi.mock("../states/authStore.js", () => ({ doRegister: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

async function fillAndSubmit(container) {
  await fireEvent.input(screen.getByLabelText("Nama"), { target: { value: "Budi" } });
  await fireEvent.input(screen.getByLabelText("Email"), { target: { value: "a@b.c" } });
  await fireEvent.input(screen.getByLabelText("Kata Sandi"), { target: { value: "pw" } });
  await fireEvent.submit(container.querySelector("form"));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("RegisterPage", () => {
  it("registrasi berhasil lalu menuju halaman login", async () => {
    doRegister.mockResolvedValue();
    const { container } = renderWithProviders(RegisterPage);
    await fillAndSubmit(container);
    await waitFor(() => expect(get(currentPath)).toBe("/auth/login"));
    expect(doRegister).toHaveBeenCalledWith("Budi", "a@b.c", "pw");
    expect(showSuccessDialog).toHaveBeenCalled();
  });

  it("registrasi gagal menampilkan dialog error", async () => {
    doRegister.mockRejectedValue(new Error("Email dipakai"));
    const { container } = renderWithProviders(RegisterPage);
    await fillAndSubmit(container);
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Email dipakai"));
  });

  it("tautan masuk berpindah ke /auth/login", async () => {
    currentPath.set("/auth/register");
    renderWithProviders(RegisterPage);
    await fireEvent.click(screen.getByRole("link", { name: "Masuk" }));
    expect(get(currentPath)).toBe("/auth/login");
  });
});
