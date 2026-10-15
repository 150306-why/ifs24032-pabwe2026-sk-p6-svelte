import { describe, expect, it } from "vitest";
import { get } from "svelte/store";
import { useInput } from "./useInput.js";

describe("useInput", () => {
  it("menyimpan nilai awal, mengubah, dan mereset", () => {
    const input = useInput("awal");
    expect(get(input)).toBe("awal");
    input.set("baru");
    expect(get(input)).toBe("baru");
    input.update((value) => `${value}!`);
    expect(get(input)).toBe("baru!");
    input.reset();
    expect(get(input)).toBe("awal");
  });
});
