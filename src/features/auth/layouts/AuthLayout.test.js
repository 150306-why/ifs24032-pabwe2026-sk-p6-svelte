import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/svelte";
import { renderWithProviders, textSnippet } from "../../../test-utils.js";
import AuthLayout from "./AuthLayout.svelte";

describe("AuthLayout", () => {
  it("menampilkan identitas aplikasi dan isi", () => {
    renderWithProviders(AuthLayout, { children: textSnippet("<p>isi form</p>") });
    expect(screen.getByRole("heading", { name: "Delcom Link Tree" })).toBeInTheDocument();
    expect(screen.getByText(/Kumpulkan semua tautan/)).toBeInTheDocument();
    expect(screen.getByText("isi form")).toBeInTheDocument();
  });
});
