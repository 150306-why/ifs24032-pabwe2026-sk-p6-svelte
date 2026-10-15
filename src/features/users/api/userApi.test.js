import { describe, expect, it, vi } from "vitest";
import { apiRequest } from "../../../helpers/apiHelper.js";
import { getMe, getUsers, updatePassword, updatePhoto, updateProfile } from "./userApi.js";

vi.mock("../../../helpers/apiHelper.js", () => ({ apiRequest: vi.fn() }));

describe("userApi", () => {
  it("getMe dan getUsers", () => {
    getMe();
    getUsers();
    expect(apiRequest).toHaveBeenCalledWith("GET", "/users/me", {});
    expect(apiRequest).toHaveBeenCalledWith("GET", "/users", {});
  });

  it("updateProfile", () => {
    updateProfile("Budi", "a@b.c");
    expect(apiRequest).toHaveBeenCalledWith("PUT", "/users/me", {
      json: { name: "Budi", email: "a@b.c" },
    });
  });

  it("updatePhoto mengirim FormData", () => {
    const file = new File(["x"], "f.png", { type: "image/png" });
    updatePhoto(file);
    const [method, path, options] = apiRequest.mock.calls.at(-1);
    expect([method, path]).toEqual(["POST", "/users/photo"]);
    expect(options.form.get("photo")).toBeInstanceOf(File);
  });

  it("updatePassword", () => {
    updatePassword("lama", "baru");
    expect(apiRequest).toHaveBeenCalledWith("PUT", "/users/password", {
      json: { password: "lama", new_password: "baru" },
    });
  });
});
