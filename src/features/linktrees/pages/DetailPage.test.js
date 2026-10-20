import Swal from "sweetalert2";
import { get } from "svelte/store";
import { currentPath } from "../../../router.js";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import DetailPage from "./DetailPage.svelte";
import { renderWithProviders, mockApi, okResponse, sampleTree } from "../../../test-utils.js";

const withCover = { ...sampleTree, cover: "http://x/c.png" };
const empty = { ...sampleTree, items: [] };
const routes = (tree = sampleTree) => ({
  "GET /link-trees/t1": okResponse({ link_tree: tree }),
  "DELETE /link-trees/t1/items/i1": okResponse({}, "Tautan dihapus"),
  "POST /link-trees/t1/cover": okResponse({}, "Sampul diubah"),
  "POST /link-trees/t1/items": okResponse({}, "Tautan ditambah"),
});

describe("DetailPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menampilkan status memuat lalu detail dengan placeholder sampul", async () => {
    mockApi(routes());
    renderWithProviders(DetailPage, { linkTreeId: "t1" });
    expect(screen.getByTestId("loading")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId("detail-title")).toHaveTextContent("Portofolio"));
    expect(screen.getAllByTestId("item")).toHaveLength(1);
    expect(screen.getByText("&larr; Semua Link Tree".replace("&larr;", "←"))).toBeInTheDocument();
  });

  it("tautan kembali menuju beranda", async () => {
    mockApi(routes());
    renderWithProviders(DetailPage, { linkTreeId: "t1" });
    currentPath.set("/link-trees/t1");
    await fireEvent.click(screen.getByText(/Semua Link Tree/));
    expect(get(currentPath)).toBe("/");
  });

  it("menampilkan sampul dan keadaan tanpa tautan", async () => {
    mockApi(routes({ ...withCover, items: [] }));
    renderWithProviders(DetailPage, { linkTreeId: "t1" });
    await waitFor(() => expect(screen.getByAltText("Portofolio")).toBeInTheDocument());
    expect(screen.getByTestId("no-items")).toBeInTheDocument();
  });

  it("membuka modal ubah data, ubah sampul, dan tambah tautan", async () => {
    mockApi(routes(empty));
    renderWithProviders(DetailPage, { linkTreeId: "t1" });
    await waitFor(() => expect(screen.getByTestId("detail-title")).toBeInTheDocument());

    // 1. Ubah Data (Gunakan findByRole agar menunggu modal muncul)
    await fireEvent.click(screen.getByText("Ubah data"));
    expect(await screen.findByRole("dialog", { name: "Ubah Link Tree" })).toBeInTheDocument();
    await fireEvent.click(screen.getByLabelText("Tutup"));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    // 2. Ubah Sampul
    await fireEvent.click(screen.getByText("Ubah sampul"));
    expect(await screen.findByRole("dialog", { name: "Ubah Sampul" })).toBeInTheDocument();
    await fireEvent.click(screen.getByLabelText("Tutup"));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    // 3. Tambah Tautan
    await fireEvent.click(screen.getByText("Tambah tautan"));
    expect(await screen.findByRole("dialog", { name: "Tambah Tautan" })).toBeInTheDocument();
    await fireEvent.click(screen.getByLabelText("Tutup"));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("mengunggah sampul dan menambah tautan sampai modal tertutup", async () => {
    mockApi(routes(empty));
    renderWithProviders(DetailPage, { linkTreeId: "t1" });
    await waitFor(() => expect(screen.getByTestId("detail-title")).toBeInTheDocument());

    await fireEvent.click(screen.getByText("Ubah sampul"));
    // Gunakan findByTestId untuk menunggu input dari modal yang di-lazy load
    const input = await screen.findByTestId("cover-input");
    const file = new File(["x"], "c.png", { type: "image/png" });
    await fireEvent.change(input, { target: { files: [file] } });
    await fireEvent.submit(screen.getByTestId("cover-form"));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());

    await fireEvent.click(screen.getByText("Tambah tautan"));
    // Tunggu modal form tautan muncul sebelum mengisi input
    await screen.findByRole("dialog", { name: "Tambah Tautan" });
    await fireEvent.input(screen.getByLabelText("Judul tautan"), { target: { value: "Blog" } });
    await fireEvent.input(screen.getByLabelText("URL"), { target: { value: "https://blog.dev" } });
    await fireEvent.submit(screen.getByTestId("item-form"));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("mengubah tautan lewat modal", async () => {
    mockApi(routes());
    renderWithProviders(DetailPage, { linkTreeId: "t1" });
    await waitFor(() => expect(screen.getAllByTestId("item")).toHaveLength(1));
    await fireEvent.click(screen.getByLabelText("Ubah GitHub"));
    // Gunakan findByRole
    expect(await screen.findByRole("dialog", { name: "Ubah Tautan" })).toBeInTheDocument();
  });

  it("hapus tautan (dibatalkan lalu dikonfirmasi)", async () => {
    const fetchMock = mockApi(routes());
    renderWithProviders(DetailPage, { linkTreeId: "t1" });
    await waitFor(() => expect(screen.getAllByTestId("item")).toHaveLength(1));
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    await fireEvent.click(screen.getByLabelText("Hapus GitHub"));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    expect(fetchMock.mock.calls.some(([, o]) => o.method === "DELETE")).toBe(false);
    await fireEvent.click(screen.getByLabelText("Hapus GitHub"));
    await waitFor(() => expect(fetchMock.mock.calls.some(([, o]) => o.method === "DELETE")).toBe(true));
  });
});