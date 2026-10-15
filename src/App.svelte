<script>
  import { onMount } from "svelte";
  import { currentPath, initRouter, navigate, resolveRoute } from "./router.js";
  import { token, ready, initAuth } from "./features/auth/states/authStore.js";
  import AuthLayout from "./features/auth/layouts/AuthLayout.svelte";
  import LoginPage from "./features/auth/pages/LoginPage.svelte";
  import RegisterPage from "./features/auth/pages/RegisterPage.svelte";
  import LinkTreeLayout from "./features/linktrees/layouts/LinkTreeLayout.svelte";
  import HomePage from "./features/linktrees/pages/HomePage.svelte";
  import DetailPage from "./features/linktrees/pages/DetailPage.svelte";
  import UsersPage from "./features/users/pages/UsersPage.svelte";
  import ProfilePage from "./features/users/pages/ProfilePage.svelte";
  import NotFoundPage from "./features/common/pages/NotFoundPage.svelte";

  const pages = {
    login: LoginPage,
    register: RegisterPage,
    home: HomePage,
    detail: DetailPage,
    users: UsersPage,
    profile: ProfilePage,
    notfound: NotFoundPage,
  };

  onMount(() => {
    const stop = initRouter();
    initAuth();
    return stop;
  });

  const route = $derived(resolveRoute($currentPath));
  const Layout = $derived(route.layout === "auth" ? AuthLayout : LinkTreeLayout);
  const Page = $derived(pages[route.page]);
  const allowed = $derived(
    $ready &&
      ((Boolean($token) && route.layout === "app") ||
        (!$token && route.layout === "auth"))
  );

  $effect(() => {
    if ($ready && !allowed) {
      navigate($token ? "/" : "/auth/login");
    }
  });
</script>

{#if allowed}
  <Layout>
    <Page {...route.params} />
  </Layout>
{/if}
