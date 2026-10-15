<script>
  import { Link2, LogOut } from "lucide-svelte";
  import { profile, logout } from "../../auth/states/authStore.js";
</script>

<header class="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
  <div class="flex items-center gap-2 font-bold text-indigo-600">
    <Link2 size={22} />
    <span>Delcom Link Tree</span>
  </div>
  <div class="flex items-center gap-3">
    {#if $profile.photo}
      <img src={$profile.photo} alt={$profile.name} class="size-8 rounded-full object-cover" />
    {:else}
      <span
        aria-hidden="true"
        class="grid size-8 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700"
        >{$profile.name.charAt(0).toUpperCase()}</span
      >
    {/if}
    <span class="hidden text-sm font-medium sm:inline">{$profile.name}</span>
    <button
      type="button"
      aria-label="Keluar"
      onclick={logout}
      class="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
    >
      <LogOut size={18} />
    </button>
  </div>
</header>
