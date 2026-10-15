<script>
  import { useInput } from "../../../hooks/useInput.js";
  import { createLinkTree } from "../states/linkTreesStore.js";

  let { onclose } = $props();

  const title = useInput("");
  const type = useInput("public");
  const description = useInput("");

  async function submit(event) {
    event.preventDefault();
    const ok = await createLinkTree({
      title: $title,
      type: $type,
      description: $description,
    });
    if (ok) {
      onclose();
    }
  }
</script>

<div class="fixed inset-0 z-30 grid place-items-center bg-black/40 p-4">
  <div role="dialog" aria-modal="true" aria-labelledby="add-modal-title" class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
    <h2 id="add-modal-title" class="mb-4 text-lg font-semibold">Tambah Link Tree</h2>
    <form onsubmit={submit} class="space-y-3">
      <div>
        <label for="add-title" class="mb-1 block text-sm font-medium">Judul</label>
        <input id="add-title" type="text" required bind:value={$title} class="w-full rounded-lg border border-slate-300 px-3 py-2" />
      </div>
      <div>
        <label for="add-type" class="mb-1 block text-sm font-medium">Tipe</label>
        <select id="add-type" bind:value={$type} class="w-full rounded-lg border border-slate-300 px-3 py-2">
          <option value="public">Public</option>
          <option value="unlisted">Unlisted</option>
          <option value="private">Private</option>
        </select>
      </div>
      <div>
        <label for="add-description" class="mb-1 block text-sm font-medium">Deskripsi</label>
        <textarea id="add-description" required bind:value={$description} class="w-full rounded-lg border border-slate-300 px-3 py-2"></textarea>
      </div>
      <div class="flex justify-end gap-2">
        <button type="button" onclick={onclose} class="rounded-lg px-4 py-2 text-slate-600 hover:bg-slate-100">Batal</button>
        <button type="submit" class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">Simpan</button>
      </div>
    </form>
  </div>
</div>
