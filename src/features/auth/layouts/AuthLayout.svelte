<script>
  import { Link2 } from "lucide-svelte";

  let { children } = $props();
</script>

<main
  class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-sky-100 p-4"
>
  <div class="w-full max-w-md">
    <div class="flex flex-col items-center mb-6 text-center">
      <span
        class="grid place-items-center size-14 rounded-2xl bg-indigo-600 text-white shadow-lg"
      >
        <Link2 size={28} />
      </span>
      <h1 class="mt-3 text-2xl font-bold">Delcom Link Tree</h1>
      <p class="text-sm text-slate-600">
        Kumpulkan semua tautan pentingmu dalam satu halaman.
      </p>
    </div>
    <div class="bg-white rounded-2xl shadow-md p-6">
      {@render children()}
    </div>
  </div>
</main>
