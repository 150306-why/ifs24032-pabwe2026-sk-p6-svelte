<script>
  import { Pencil, Image as ImageIcon, Trash2, Plus, ExternalLink } from "lucide-svelte";
  import {
    linkTree,
    loading,
    isChanged,
    isCoverChanged,
    isItemMutated,
    fetchLinkTree,
    removeLinkTree,
    removeItem,
    resetFlags,
  } from "../states/linkTreesStore.js";
  import { showConfirmDialog } from "../../../helpers/toolsHelper.js";
  import { navigate } from "../../../router.js";
  import ChangeModal from "../modals/ChangeModal.svelte";
  import ChangeCoverModal from "../modals/ChangeCoverModal.svelte";
  import ItemModal from "../modals/ItemModal.svelte";

  let { linkTreeId } = $props();

  let showChange = $state(false);
  let showCover = $state(false);
  let showItem = $state(false);
  let editingItem = $state(null);

  $effect(() => {
    fetchLinkTree(linkTreeId);
  });

  $effect(() => {
    if ($isChanged || $isCoverChanged || $isItemMutated) {
      resetFlags();
      fetchLinkTree(linkTreeId);
    }
  });

  function openItem(item) {
    editingItem = item;
    showItem = true;
  }

  async function removeTree() {
    if (await showConfirmDialog("Hapus link tree ini?")) {
      if (await removeLinkTree($linkTree.id)) {
        navigate("/");
      }
    }
  }

  async function removeLink(item) {
    if (await showConfirmDialog(`Hapus tautan "${item.title}"?`)) {
      await removeItem($linkTree.id, item.id);
    }
  }
</script>

{#if $linkTree}
  <section class="space-y-5">
    {#if $linkTree.cover}
      <img src={$linkTree.cover} alt={$linkTree.title} class="h-48 w-full rounded-2xl object-cover" />
    {/if}
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">{$linkTree.title}</h1>
        <span class="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">{$linkTree.type}</span>
        <p class="mt-2 text-slate-600">{$linkTree.description}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button type="button" onclick={() => (showChange = true)} class="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"><Pencil size={14} /> Ubah Data</button>
        <button type="button" onclick={() => (showCover = true)} class="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"><ImageIcon size={14} /> Ubah Sampul</button>
        <button type="button" onclick={removeTree} class="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"><Trash2 size={14} /> Hapus</button>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Tautan</h2>
      <button type="button" onclick={() => openItem(null)} class="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"><Plus size={14} /> Tambah Item</button>
    </div>

    {#if $linkTree.items.length === 0}
      <p class="rounded-xl bg-white p-6 text-center text-slate-500">Belum ada tautan.</p>
    {:else}
      <ul class="space-y-2">
        {#each $linkTree.items as item (item.id)}
          <li class="flex items-center justify-between gap-2 rounded-xl bg-white p-3 shadow-sm">
            <a href={item.url} target="_blank" rel="noopener noreferrer" class="flex min-w-0 items-center gap-2 font-medium text-indigo-700 hover:underline">
              <ExternalLink size={14} /> <span class="truncate">{item.title}</span>
            </a>
            <div class="flex gap-1">
              <button type="button" aria-label={`Ubah ${item.title}`} onclick={() => openItem(item)} class="rounded-lg p-2 hover:bg-slate-100"><Pencil size={14} /></button>
              <button type="button" aria-label={`Hapus ${item.title}`} onclick={() => removeLink(item)} class="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </section>

  {#if showChange}
    <ChangeModal linkTree={$linkTree} onclose={() => (showChange = false)} />
  {/if}
  {#if showCover}
    <ChangeCoverModal linkTreeId={$linkTree.id} onclose={() => (showCover = false)} />
  {/if}
  {#if showItem}
    <ItemModal linkTreeId={$linkTree.id} item={editingItem} onclose={() => (showItem = false)} />
  {/if}
{:else if $loading}
  <p class="text-slate-500">Memuat...</p>
{:else}
  <p class="text-slate-500">Link tree tidak ditemukan.</p>
{/if}
