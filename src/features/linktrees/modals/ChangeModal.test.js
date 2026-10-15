import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";
import { editLinkTree } from "../states/linkTreesStore.js";
import ChangeModal from "./ChangeModal.svelte";

vi.mock("../states/linkTreesStore.js", () => ({ editLinkTree: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ChangeModal", () => {
  it("menyimpan data awal dengan deskripsi kosong lalu menutup", async () => {
    editLinkTree.mockResolvedValue(true);
    const onclose = vi.fn();
    const { container } = renderWithProviders(ChangeModal, {
      linkTree: { id: 5, title: "A", type: "public", description: null },
      onclose,
    });
    await fireEvent.submit(container.querySelector("form"));
    await waitFor(() => expect(onclose).toHaveBeenCalled());
    expect(editLinkTree).toHaveBeenCalledWith(5, { title: "A", type: "public", description: "" });
  });

  it("mengirim perubahan dan tetap terbuka saat gagal", async () => {
    editLinkTree.mockResolvedValue(false);
    const onclose = vi.fn();
    const { container } = renderWithProviders(ChangeModal, {
      linkTree: { id: 5, title: "A", type: "public", description: "lama" },
      onclose,
    });
    await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: "B" } });
    await fireEvent.change(screen.getByLabelText("Tipe"), { target: { value: "unlisted" } });
    await fireEvent.input(screen.getByLabelText("Deskripsi"), { target: { value: "baru" } });
    await fireEvent.submit(container.querySelector("form"));
    await waitFor(() => expect(editLinkTree).toHaveBeenCalledWith(5, { title: "B", type: "unlisted", description: "baru" }));
    expect(onclose).not.toHaveBeenCalled();
  });

  it("tombol batal menutup modal", async () => {
    const onclose = vi.fn();
    renderWithProviders(ChangeModal, { linkTree: { id: 5, title: "A", type: "public", description: "d" }, onclose });
    await fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onclose).toHaveBeenCalled();
  });
});
