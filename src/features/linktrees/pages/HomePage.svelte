<script>
  import { onMount } from "svelte";
  import { Plus, Trash2, Search } from "lucide-svelte";
  import {
    linkTrees,
    isAdded,
    isDeleted,
    isDeletedAll,
    fetchLinkTrees,
    removeLinkTree,
    removeAllLinkTrees,
    resetFlags,
  } from "../states/linkTreesStore.js";
  import { profile } from "../../auth/states/authStore.js";
  import { showConfirmDialog } from "../../../helpers/toolsHelper.js";
  import { go } from "../../../router.js";
  import AddModal from "../modals/AddModal.svelte";

  let keyword = $state("");
  let onlyMine = $state(false);
  let showAdd = $state(false);

  onMount(fetchLinkTrees);

  $effect(() => {
    if ($isAdded || $isDeleted || $isDeletedAll) {
      resetFlags();
      fetchLinkTrees();
    }
  });

  const visible = $derived(
    $linkTrees.filter(
      (tree) =>
        tree.title.toLowerCase().includes(keyword.toLowerCase()) &&
        (!onlyMine || tree.user_id === $profile.id)
    )
  );

  const stats = $derived([
    { key: "total", label: "Total", value: $linkTrees.length },
    { key: "public", label: "Public", value: $linkTrees.filter((tree) => tree.type === "public").length },
    { key: "unlisted", label: "Unlisted", value: $linkTrees.filter((tree) => tree.type === "unlisted").length },
    { key: "private", label: "Private", value: $linkTrees.filter((tree) => tree.type === "private").length },
    { key: "mine", label: "Milik saya", value: $linkTrees.filter((tree) => tree.user_id === $profile.id).length },
  ]);

  async function remove(tree) {
    if (await showConfirmDialog(`Hapus "${tree.title}"?`)) {
      await removeLinkTree(tree.id);
    }
  }

  async function removeAll() {
    if (await showConfirmDialog("Hapus semua link tree?")) {
      await removeAllLinkTrees();
    }
  }
</script>

<section class="space-y-5">
  <div class="flex flex-wrap items-center justify-between gap-2">
    <h1 class="text-2xl font-bold">Semua Link Tree</h1>
    <div class="flex gap-2">
      <button type="button" onclick={removeAll} disabled={$linkTrees.length === 0}
        class="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50">
        Hapus Semua
      </button>
      <button type="button" onclick={() => (showAdd = true)}
        class="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">
        <Plus size={16} /> Tambah Link Tree
      </button>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-3 sm:grid-cols-5">
    {#each stats as stat (stat.key)}
      <div class="rounded-xl bg-white p-3 text-center shadow-sm">
        <p class="text-xs text-slate-500">{stat.label}</p>
        <p class="text-xl font-bold" data-testid={`stat-${stat.key}`}>{stat.value}</p>
      </div>
    {/each}
  </div>

  <div class="flex flex-wrap items-center gap-3">
    <div class="relative">
      <span class="pointer-events-none absolute left-2 top-2.5 text-slate-400"><Search size={16} /></span>
      <label for="search" class="sr-only">Cari</label>
      <input id="search" type="search" placeholder="Cari judul..." bind:value={keyword}
        class="rounded-lg border border-slate-300 py-2 pl-8 pr-3 text-sm" />
    </div>
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" bind:checked={onlyMine} /> Milik saya
    </label>
  </div>

  {#if visible.length === 0}
    <p class="rounded-xl bg-white p-8 text-center text-slate-500">Belum ada link tree.</p>
  {:else}
    <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each visible as tree (tree.id)}
        <li class="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm">
          {#if tree.cover}
            <img src={tree.cover} alt={tree.title} class="h-32 w-full object-cover" />
          {/if}
          <div class="flex-1 p-4">
            <div class="flex items-start justify-between gap-2">
              <a href={`/link-trees/${tree.id}`} onclick={(event) => go(event, `/link-trees/${tree.id}`)}
                class="font-semibold hover:underline">{tree.title}</a>
              <span class="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">{tree.type}</span>
            </div>
            <p class="mt-1 text-sm text-slate-600">{tree.description}</p>
          </div>
          <div class="flex justify-end border-t border-slate-100 p-2">
            <button type="button" aria-label={`Hapus ${tree.title}`} onclick={() => remove(tree)}
              class="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

{#if showAdd}
  <AddModal onclose={() => (showAdd = false)} />
{/if}
