<script>
  import { useInput } from "../../../hooks/useInput.js";
  import { saveItem } from "../states/linkTreesStore.js";

  let { linkTreeId, item, onclose } = $props();

  const title = useInput(item ? item.title : "");
  const url = useInput(item ? item.url : "");

  async function submit(event) {
    event.preventDefault();
    const ok = await saveItem(linkTreeId, item, { title: $title, url: $url });
    if (ok) {
      onclose();
    }
  }
</script>

<div class="fixed inset-0 z-30 grid place-items-center bg-black/40 p-4">
  <div role="dialog" aria-modal="true" aria-labelledby="item-modal-title" class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
    <h2 id="item-modal-title" class="mb-4 text-lg font-semibold">{item ? "Ubah Item" : "Tambah Item"}</h2>
    <form onsubmit={submit} class="space-y-3">
      <div>
        <label for="item-title" class="mb-1 block text-sm font-medium">Judul tautan</label>
        <input id="item-title" type="text" required bind:value={$title} class="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label for="item-url" class="mb-1 block text-sm font-medium">URL</label>
        <input id="item-url" type="url" required bind:value={$url} class="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>
      <div class="flex justify-end gap-2">
        <button type="button" onclick={onclose} class="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100">Batal</button>
        <button type="submit" class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">Simpan</button>
      </div>
    </form>
  </div>
</div>
