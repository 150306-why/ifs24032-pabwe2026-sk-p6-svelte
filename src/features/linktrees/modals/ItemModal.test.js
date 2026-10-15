import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";
import { saveItem } from "../states/linkTreesStore.js";
import ItemModal from "./ItemModal.svelte";

vi.mock("../states/linkTreesStore.js", () => ({ saveItem: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ItemModal", () => {
  it("menambah item baru lalu menutup", async () => {
    saveItem.mockResolvedValue(true);
    const onclose = vi.fn();
    const { container } = renderWithProviders(ItemModal, { linkTreeId: 2, item: null, onclose });
    expect(screen.getByRole("heading", { name: "Tambah Item" })).toBeInTheDocument();
    await fireEvent.input(screen.getByLabelText("Judul tautan"), { target: { value: "GitHub" } });
    await fireEvent.input(screen.getByLabelText("URL"), { target: { value: "https://github.com" } });
    await fireEvent.submit(container.querySelector("form"));
    await waitFor(() => expect(onclose).toHaveBeenCalled());
    expect(saveItem).toHaveBeenCalledWith(2, null, { title: "GitHub", url: "https://github.com" });
  });

  it("mengubah item yang ada dan tetap terbuka saat gagal", async () => {
    saveItem.mockResolvedValue(false);
    const onclose = vi.fn();
    const item = { id: 9, title: "Lama", url: "https://lama.id" };
    const { container } = renderWithProviders(ItemModal, { linkTreeId: 2, item, onclose });
    expect(screen.getByRole("heading", { name: "Ubah Item" })).toBeInTheDocument();
    await fireEvent.submit(container.querySelector("form"));
    await waitFor(() => expect(saveItem).toHaveBeenCalledWith(2, item, { title: "Lama", url: "https://lama.id" }));
    expect(onclose).not.toHaveBeenCalled();
  });

  it("tombol batal menutup modal", async () => {
    const onclose = vi.fn();
    renderWithProviders(ItemModal, { linkTreeId: 2, item: null, onclose });
    await fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onclose).toHaveBeenCalled();
  });
});
