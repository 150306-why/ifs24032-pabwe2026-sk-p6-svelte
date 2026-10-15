import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  apiRequest,
  getAccessToken,
  putAccessToken,
  removeAccessToken,
} from "./apiHelper.js";

const reply = (body) =>
  vi.fn().mockResolvedValue({ json: () => Promise.resolve(body) });

beforeEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe("token", () => {
  it("menyimpan, membaca, dan menghapus token", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });
});

describe("apiRequest", () => {
  it("GET tanpa token dan tanpa body", async () => {
    const fetchMock = reply({ status: "success", data: { a: 1 } });
    vi.stubGlobal("fetch", fetchMock);
    const result = await apiRequest("GET", "/x", {});
    expect(result.data.a).toBe(1);
    expect(fetchMock).toHaveBeenCalledWith(`${DELCOM_BASEURL}/x`, {
      method: "GET",
      headers: {},
    });
  });

  it("mengirim body JSON dengan token", async () => {
    putAccessToken("tok");
    const fetchMock = reply({ status: "success" });
    vi.stubGlobal("fetch", fetchMock);
    await apiRequest("POST", "/y", { json: { k: "v" } });
    expect(fetchMock).toHaveBeenCalledWith(`${DELCOM_BASEURL}/y`, {
      method: "POST",
      headers: { Authorization: "Bearer tok", "Content-Type": "application/json" },
      body: JSON.stringify({ k: "v" }),
    });
  });

  it("mengirim FormData", async () => {
    const fetchMock = reply({ status: "success" });
    vi.stubGlobal("fetch", fetchMock);
    const form = new FormData();
    await apiRequest("POST", "/z", { form });
    expect(fetchMock.mock.calls[0][1].body).toBe(form);
  });

  it("menerima success: true", async () => {
    vi.stubGlobal("fetch", reply({ success: true }));
    await expect(apiRequest("GET", "/x", {})).resolves.toEqual({ success: true });
  });

  it("melempar error bila respons gagal", async () => {
    vi.stubGlobal("fetch", reply({ status: "fail", message: "Gagal total" }));
    await expect(apiRequest("GET", "/x", {})).rejects.toThrow("Gagal total");
  });
});
