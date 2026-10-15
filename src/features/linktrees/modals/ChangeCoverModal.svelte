<script>
  import { editCover } from "../states/linkTreesStore.js";
  import { showWarningDialog } from "../../../helpers/toolsHelper.js";

  let { linkTreeId, onclose } = $props();

  let file = $state(null);

  async function submit(event) {
    event.preventDefault();
    if (!file) {
      await showWarningDialog("Pilih gambar terlebih dahulu");
      return;
    }
    const ok = await editCover(linkTreeId, file);
    if (ok) {
      onclose();
    }
  }
</script>

<div class="fixed inset-0 z-30 grid place-items-center bg-black/40 p-4">
  <div role="dialog" aria-modal="true" aria-labelledby="cover-modal-title" class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
    <h2 id="cover-modal-title" class="mb-4 text-lg font-semibold">Ubah Sampul</h2>
    <form onsubmit={submit} class="space-y-3">
      <div>
        <label for="cover-file" class="mb-1 block text-sm font-medium">Gambar sampul</label>
        <input id="cover-file" type="file" accept="image/*" onchange={(event) => (file = event.currentTarget.files[0])} />
      </div>
      <div class="flex justify-end gap-2">
        <button type="button" onclick={onclose} class="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100">Batal</button>
        <button type="submit" class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">Simpan</button>
      </div>
    </form>
  </div>
</div>
