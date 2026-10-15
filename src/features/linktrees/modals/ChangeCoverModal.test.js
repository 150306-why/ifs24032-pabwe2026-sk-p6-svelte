import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";
import { editCover } from "../states/linkTreesStore.js";
import { showWarningDialog } from "../../../helpers/toolsHelper.js";
import ChangeCoverModal from "./ChangeCoverModal.svelte";

vi.mock("../states/linkTreesStore.js", () => ({ editCover: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({ showWarningDialog: vi.fn() }));

const file = new File(["x"], "c.png", { type: "image/png" });

async function pick(container) {
  await fireEvent.change(container.querySelector('input[type="file"]'), { target: { files: [file] } });
  await fireEvent.submit(container.querySelector("form"));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ChangeCoverModal", () => {
  it("memperingatkan bila gambar belum dipilih", async () => {
    const onclose = vi.fn();
    const { container } = renderWithProviders(ChangeCoverModal, { linkTreeId: 4, onclose });
    await fireEvent.submit(container.querySelector("form"));
    await waitFor(() => expect(showWarningDialog).toHaveBeenCalled());
    expect(editCover).not.toHaveBeenCalled();
  });

  it("mengunggah lalu menutup saat sukses", async () => {
    editCover.mockResolvedValue(true);
    const onclose = vi.fn();
    const { container } = renderWithProviders(ChangeCoverModal, { linkTreeId: 4, onclose });
    await pick(container);
    await waitFor(() => expect(onclose).toHaveBeenCalled());
    expect(editCover).toHaveBeenCalledWith(4, file);
  });

  it("tetap terbuka saat gagal", async () => {
    editCover.mockResolvedValue(false);
    const onclose = vi.fn();
    const { container } = renderWithProviders(ChangeCoverModal, { linkTreeId: 4, onclose });
    await pick(container);
    await waitFor(() => expect(editCover).toHaveBeenCalled());
    expect(onclose).not.toHaveBeenCalled();
  });

  it("tombol batal menutup modal", async () => {
    const onclose = vi.fn();
    renderWithProviders(ChangeCoverModal, { linkTreeId: 4, onclose });
    await fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onclose).toHaveBeenCalled();
  });
});
