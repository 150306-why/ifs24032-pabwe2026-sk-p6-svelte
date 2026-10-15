import { beforeEach, describe, expect, it, vi } from "vitest";
import { get } from "svelte/store";
import Swal from "sweetalert2";
import { getMe, getUsers, updatePassword, updatePhoto, updateProfile } from "../api/userApi.js";
import { profile } from "../../auth/states/authStore.js";
import { fetchUsers, savePassword, savePhoto, saveProfile, users } from "./usersStore.js";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));
vi.mock("../api/userApi.js", () => ({
  getMe: vi.fn(),
  getUsers: vi.fn(),
  updatePassword: vi.fn(),
  updatePhoto: vi.fn(),
  updateProfile: vi.fn(),
}));
vi.mock("../../auth/states/authStore.js", async () => {
  const { writable } = await import("svelte/store");
  return { profile: writable(null) };
});

beforeEach(() => {
  vi.clearAllMocks();
  users.set([]);
  profile.set({ id: 1, name: "Lama", email: "l@x.c" });
});

describe("usersStore", () => {
  it("fetchUsers mengisi daftar pengguna", async () => {
    getUsers.mockResolvedValue({ data: { users: [{ id: 1 }] } });
    await fetchUsers();
    expect(get(users)).toEqual([{ id: 1 }]);
  });

  it("fetchUsers menampilkan error saat gagal", async () => {
    getUsers.mockRejectedValue(new Error("down"));
    await fetchUsers();
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error", text: "down" }));
  });

  it("saveProfile memperbarui profil", async () => {
    updateProfile.mockResolvedValue({});
    expect(await saveProfile("Baru", "b@x.c")).toBe(true);
    expect(get(profile)).toEqual({ id: 1, name: "Baru", email: "b@x.c" });
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "success" }));
  });

  it("saveProfile gagal tidak menampilkan dialog sukses", async () => {
    updateProfile.mockRejectedValue(new Error("invalid"));
    expect(await saveProfile("Baru", "b@x.c")).toBe(false);
    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error" }));
  });

  it("savePhoto memuat ulang profil", async () => {
    updatePhoto.mockResolvedValue({});
    getMe.mockResolvedValue({ data: { user: { id: 1, name: "Lama", photo: "p.png" } } });
    expect(await savePhoto(new File(["x"], "p.png"))).toBe(true);
    expect(get(profile).photo).toBe("p.png");
  });

  it("savePassword memanggil API", async () => {
    updatePassword.mockResolvedValue({});
    expect(await savePassword("lama", "baru")).toBe(true);
    expect(updatePassword).toHaveBeenCalledWith("lama", "baru");
  });
});
