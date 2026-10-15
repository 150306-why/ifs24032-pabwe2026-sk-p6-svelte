import { beforeEach, describe, expect, it, vi } from "vitest";
import Swal from "sweetalert2";
import {
  attempt,
  formatDate,
  showConfirmDialog,
  showErrorDialog,
  showSuccessDialog,
  showWarningDialog,
} from "./toolsHelper.js";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("toolsHelper", () => {
  it("menampilkan dialog sukses, error, dan peringatan", () => {
    showSuccessDialog("ok");
    showErrorDialog("err");
    showWarningDialog("warn");
    expect(Swal.fire).toHaveBeenNthCalledWith(1, { icon: "success", title: "Berhasil", text: "ok" });
    expect(Swal.fire).toHaveBeenNthCalledWith(2, { icon: "error", title: "Gagal", text: "err" });
    expect(Swal.fire).toHaveBeenNthCalledWith(3, { icon: "warning", title: "Perhatian", text: "warn" });
  });

  it("dialog konfirmasi mengembalikan pilihan pengguna", async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
    expect(await showConfirmDialog("yakin?")).toBe(true);
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    expect(await showConfirmDialog("yakin?")).toBe(false);
  });

  it("memformat tanggal", () => {
    expect(formatDate("2026-10-15")).toContain("2026");
  });

  it("attempt mengembalikan true bila sukses", async () => {
    const action = vi.fn().mockResolvedValue();
    expect(await attempt(action)).toBe(true);
    expect(Swal.fire).not.toHaveBeenCalled();
  });

  it("attempt menampilkan error dan mengembalikan false bila gagal", async () => {
    expect(await attempt(() => Promise.reject(new Error("boom")))).toBe(false);
    expect(Swal.fire).toHaveBeenCalledWith({ icon: "error", title: "Gagal", text: "boom" });
  });
});
