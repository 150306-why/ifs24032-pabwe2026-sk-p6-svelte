<script>
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/Sidebar.svelte";

  let { children } = $props();
</script>

<div class="min-h-screen bg-slate-50">
  <Navbar />
  <div class="flex flex-col md:flex-row">
    <Sidebar />
    <main class="flex-1 p-4 md:p-6">
      {@render children()}
    </main>
  </div>
</div>
