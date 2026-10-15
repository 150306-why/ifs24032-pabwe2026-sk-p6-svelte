import { describe, expect, it, vi } from "vitest";
import { apiRequest } from "../../../helpers/apiHelper.js";
import { login, register } from "./authApi.js";

vi.mock("../../../helpers/apiHelper.js", () => ({ apiRequest: vi.fn() }));

describe("authApi", () => {
  it("login memanggil POST /auth/login", () => {
    login("a@b.c", "pw");
    expect(apiRequest).toHaveBeenCalledWith("POST", "/auth/login", {
      json: { email: "a@b.c", password: "pw" },
    });
  });

  it("register memanggil POST /auth/register", () => {
    register("Budi", "a@b.c", "pw");
    expect(apiRequest).toHaveBeenCalledWith("POST", "/auth/register", {
      json: { name: "Budi", email: "a@b.c", password: "pw" },
    });
  });
});
