import { describe, expect, it, vi } from "vitest";
import { apiRequest } from "../../../helpers/apiHelper.js";
import * as api from "./linkTreeApi.js";

vi.mock("../../../helpers/apiHelper.js", () => ({ apiRequest: vi.fn() }));

const payload = { title: "T", type: "public", description: "D" };

describe("linkTreeApi", () => {
  it("membaca daftar dan detail", () => {
    api.getLinkTrees();
    api.getLinkTree(3);
    expect(apiRequest).toHaveBeenCalledWith("GET", "/link-trees", {});
    expect(apiRequest).toHaveBeenCalledWith("GET", "/link-trees/3", {});
  });

  it("menambah dan mengubah link tree", () => {
    api.addLinkTree(payload);
    api.changeLinkTree(3, payload);
    expect(apiRequest).toHaveBeenCalledWith("POST", "/link-trees", { json: payload });
    expect(apiRequest).toHaveBeenCalledWith("PUT", "/link-trees/3", { json: payload });
  });

  it("mengubah cover dengan FormData", () => {
    api.changeCover(3, new File(["x"], "c.png"));
    const [method, path, options] = apiRequest.mock.calls.at(-1);
    expect([method, path]).toEqual(["POST", "/link-trees/3/cover"]);
    expect(options.form.get("cover")).toBeInstanceOf(File);
  });

  it("menghapus satu dan semua", () => {
    api.deleteLinkTree(3);
    api.deleteAllLinkTrees();
    expect(apiRequest).toHaveBeenCalledWith("DELETE", "/link-trees/3", {});
    expect(apiRequest).toHaveBeenCalledWith("DELETE", "/link-trees", {});
  });

  it("mengelola item", () => {
    const item = { title: "GitHub", url: "https://github.com" };
    const body = { title: "GitHub", label: "GitHub", url: "https://github.com" };
    api.addItem(3, item);
    api.changeItem(3, 9, item);
    api.deleteItem(3, 9);
    expect(apiRequest).toHaveBeenCalledWith("POST", "/link-trees/3/items", { json: body });
    expect(apiRequest).toHaveBeenCalledWith("PUT", "/link-trees/3/items/9", { json: body });
    expect(apiRequest).toHaveBeenCalledWith("DELETE", "/link-trees/3/items/9", {});
  });
});
