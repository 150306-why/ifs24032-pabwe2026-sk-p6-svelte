import { beforeEach, describe, expect, it, vi } from "vitest";
import { get } from "svelte/store";
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
} from "../../../helpers/apiHelper.js";
import { login, register } from "../api/authApi.js";
import { getMe } from "../../users/api/userApi.js";
import { doLogin, doRegister, initAuth, logout, profile, ready, token } from "./authStore.js";

vi.mock("../../../helpers/apiHelper.js", () => ({
  getAccessToken: vi.fn(() => null),
  putAccessToken: vi.fn(),
  removeAccessToken: vi.fn(),
}));
vi.mock("../api/authApi.js", () => ({ login: vi.fn(), register: vi.fn() }));
vi.mock("../../users/api/userApi.js", () => ({ getMe: vi.fn() }));

// Dicatat saat modul dimuat, sebelum vi.clearAllMocks() menghapus riwayat panggilan.
const getAccessTokenCallsAtLoad = getAccessToken.mock.calls.length;

beforeEach(() => {
  vi.clearAllMocks();
  token.set(null);
  profile.set(null);
  ready.set(false);
});

describe("authStore", () => {
  it("token awal diambil dari helper", () => {
    expect(getAccessTokenCallsAtLoad).toBeGreaterThan(0);
  });

  it("initAuth tanpa token hanya menandai siap", async () => {
    await initAuth();
    expect(getMe).not.toHaveBeenCalled();
    expect(get(ready)).toBe(true);
  });

  it("initAuth dengan token memuat profil", async () => {
    token.set("tok");
    getMe.mockResolvedValue({ data: { user: { id: 1, name: "Budi" } } });
    await initAuth();
    expect(get(profile)).toEqual({ id: 1, name: "Budi" });
    expect(get(ready)).toBe(true);
  });

  it("initAuth dengan token tidak valid melakukan logout", async () => {
    token.set("rusak");
    getMe.mockRejectedValue(new Error("401"));
    await initAuth();
    expect(removeAccessToken).toHaveBeenCalled();
    expect(get(token)).toBeNull();
    expect(get(ready)).toBe(true);
  });

  it("doLogin menyimpan token dan profil", async () => {
    login.mockResolvedValue({ data: { token: "baru" } });
    getMe.mockResolvedValue({ data: { user: { id: 2, name: "Sari" } } });
    await doLogin("a@b.c", "pw");
    expect(putAccessToken).toHaveBeenCalledWith("baru");
    expect(get(profile)).toEqual({ id: 2, name: "Sari" });
    expect(get(token)).toBe("baru");
  });

  it("doRegister memanggil API register", async () => {
    register.mockResolvedValue({});
    await doRegister("Budi", "a@b.c", "pw");
    expect(register).toHaveBeenCalledWith("Budi", "a@b.c", "pw");
  });

  it("logout membersihkan sesi", () => {
    token.set("tok");
    profile.set({ id: 1 });
    logout();
    expect(removeAccessToken).toHaveBeenCalled();
    expect(get(token)).toBeNull();
    expect(get(profile)).toBeNull();
  });
});