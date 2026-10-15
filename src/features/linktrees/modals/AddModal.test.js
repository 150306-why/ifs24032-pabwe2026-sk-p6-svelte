import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";
import { createLinkTree } from "../states/linkTreesStore.js";
import AddModal from "./AddModal.svelte";

vi.mock("../states/linkTreesStore.js", () => ({ createLinkTree: vi.fn() }));

async function submit(container) {
  await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: "Judul A" } });
  await fireEvent.change(screen.getByLabelText("Tipe"), { target: { value: "private" } });
  await fireEvent.input(screen.getByLabelText("Deskripsi"), { target: { value: "Desk A" } });
  await fireEvent.submit(container.querySelector("form"));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AddModal", () => {
  it("menyimpan lalu menutup saat sukses", async () => {
    createLinkTree.mockResolvedValue(true);
    const onclose = vi.fn();
    const { container } = renderWithProviders(AddModal, { onclose });
    await submit(container);
    await waitFor(() => expect(onclose).toHaveBeenCalled());
    expect(createLinkTree).toHaveBeenCalledWith({ title: "Judul A", type: "private", description: "Desk A" });
  });

  it("tetap terbuka saat gagal", async () => {
    createLinkTree.mockResolvedValue(false);
    const onclose = vi.fn();
    const { container } = renderWithProviders(AddModal, { onclose });
    await submit(container);
    await waitFor(() => expect(createLinkTree).toHaveBeenCalled());
    expect(onclose).not.toHaveBeenCalled();
  });

  it("tombol batal menutup modal", async () => {
    const onclose = vi.fn();
    renderWithProviders(AddModal, { onclose });
    await fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onclose).toHaveBeenCalled();
  });
});
