<script>
  import { LayoutList, Users, User } from "lucide-svelte";
  import { currentPath, go } from "../../../router.js";

  const items = [
    { href: "/", label: "Semua Link Tree", icon: LayoutList },
    { href: "/users", label: "Pengguna", icon: Users },
    { href: "/profile", label: "Profil", icon: User },
  ];
</script>

<nav aria-label="Menu utama" class="flex gap-1 border-b border-slate-200 bg-white p-2 md:w-60 md:flex-col md:border-b-0 md:border-r md:p-4">
  {#each items as item (item.href)}
    <a
      href={item.href}
      onclick={(event) => go(event, item.href)}
      aria-current={$currentPath === item.href ? "page" : undefined}
      class={[
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
        $currentPath === item.href ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100",
      ]}
    >
      <item.icon size={18} />
      <span>{item.label}</span>
    </a>
  {/each}
</nav>