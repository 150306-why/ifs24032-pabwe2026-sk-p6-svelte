<script>
  import { onMount } from "svelte";
  import { users, fetchUsers } from "../states/usersStore.js";

  onMount(fetchUsers);
</script>

<section>
  <h1 class="text-2xl font-bold mb-4">Pengguna</h1>
  <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {#each $users as user (user.id)}
      <li class="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
        {#if user.photo}
          <img src={user.photo} alt={user.name} class="size-10 rounded-full object-cover" />
        {:else}
          <span
            aria-hidden="true"
            class="grid size-10 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700"
            >{user.name.charAt(0).toUpperCase()}</span
          >
        {/if}
        <div class="min-w-0">
          <p class="truncate font-medium">{user.name}</p>
          <p class="truncate text-sm text-slate-500">{user.email}</p>
        </div>
      </li>
    {/each}
  </ul>
</section>
