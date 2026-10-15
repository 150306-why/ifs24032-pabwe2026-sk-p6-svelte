import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";
import { profile } from "../../auth/states/authStore.js";
import { savePassword, savePhoto, saveProfile } from "../states/usersStore.js";
import { showWarningDialog } from "../../../helpers/toolsHelper.js";
import ProfilePage from "./ProfilePage.svelte";

vi.mock("../../auth/states/authStore.js", async () => {
  const { writable } = await import("svelte/store");
  return { profile: writable(null) };
});
vi.mock("../states/usersStore.js", () => ({
  saveProfile: vi.fn(),
  savePhoto: vi.fn(),
  savePassword: vi.fn(),
}));
vi.mock("../../../helpers/toolsHelper.js", () => ({ showWarningDialog: vi.fn() }));

const forms = (container) => container.querySelectorAll("form");

beforeEach(() => {
  vi.clearAllMocks();
  profile.set({ id: 1, name: "Budi", email: "b@x.c", photo: null });
});

describe("ProfilePage", () => {
  it("menampilkan inisial bila belum ada foto", () => {
    renderWithProviders(ProfilePage);
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("menampilkan foto bila tersedia", () => {
    profile.set({ id: 1, name: "Budi", email: "b@x.c", photo: "http://x/p.png" });
    renderWithProviders(ProfilePage);
    expect(screen.getByAltText("Budi")).toBeInTheDocument();
  });

  it("menyimpan data profil", async () => {
    saveProfile.mockResolvedValue(true);
    const { container } = renderWithProviders(ProfilePage);
    await fireEvent.input(screen.getByLabelText("Nama"), { target: { value: "Baru" } });
    await fireEvent.submit(forms(container)[0]);
    expect(saveProfile).toHaveBeenCalledWith("Baru", "b@x.c");
  });

  it("peringatan bila foto belum dipilih", async () => {
    const { container } = renderWithProviders(ProfilePage);
    await fireEvent.submit(forms(container)[1]);
    await waitFor(() => expect(showWarningDialog).toHaveBeenCalled());
    expect(savePhoto).not.toHaveBeenCalled();
  });

  it("mengunggah foto yang dipilih", async () => {
    savePhoto.mockResolvedValue(true);
    const { container } = renderWithProviders(ProfilePage);
    const file = new File(["x"], "p.png", { type: "image/png" });
    await fireEvent.change(container.querySelector('input[type="file"]'), { target: { files: [file] } });
    await fireEvent.submit(forms(container)[1]);
    await waitFor(() => expect(savePhoto).toHaveBeenCalledWith(file));
  });

  it("mengosongkan form kata sandi saat berhasil", async () => {
    savePassword.mockResolvedValue(true);
    const { container } = renderWithProviders(ProfilePage);
    const lama = screen.getByLabelText("Kata Sandi Lama");
    await fireEvent.input(lama, { target: { value: "lama" } });
    await fireEvent.input(screen.getByLabelText("Kata Sandi Baru"), { target: { value: "baru" } });
    await fireEvent.submit(forms(container)[2]);
    await waitFor(() => expect(savePassword).toHaveBeenCalledWith("lama", "baru"));
    await waitFor(() => expect(lama).toHaveValue(""));
  });

  it("mempertahankan form kata sandi saat gagal", async () => {
    savePassword.mockResolvedValue(false);
    const { container } = renderWithProviders(ProfilePage);
    const lama = screen.getByLabelText("Kata Sandi Lama");
    await fireEvent.input(lama, { target: { value: "lama" } });
    await fireEvent.input(screen.getByLabelText("Kata Sandi Baru"), { target: { value: "baru" } });
    await fireEvent.submit(forms(container)[2]);
    await waitFor(() => expect(savePassword).toHaveBeenCalled());
    expect(lama).toHaveValue("lama");
  });
});
