<script>
  import { useInput } from "../../../hooks/useInput.js";
  import { doLogin } from "../states/authStore.js";
  import { showErrorDialog } from "../../../helpers/toolsHelper.js";
  import { go } from "../../../router.js";

  const email = useInput("");
  const password = useInput("");
  let loading = $state(false);

  async function submit(event) {
    event.preventDefault();
    loading = true;
    try {
      await doLogin($email, $password);
    } catch (error) {
      await showErrorDialog(error.message);
    }
    loading = false;
  }
</script>

<h2 class="text-xl font-semibold mb-4">Masuk</h2>
<form onsubmit={submit} class="space-y-4">
  <div>
    <label for="login-email-input" class="block text-sm font-medium mb-1">Email</label>
    <input
      id="login-email-input"
      autocomplete="username"
      type="email"
      required
      bind:value={$email}
      class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
  <div>
    <label for="login-password-input" class="block text-sm font-medium mb-1">Kata Sandi</label>
    <input
      id="login-password-input"
      autocomplete="current-password"
      type="password"
      required
      bind:value={$password}
      class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
  <button
    id="login-submit-button"
    type="submit"
    disabled={loading}
    class="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
  >
    Masuk
  </button>
</form>
<p class="mt-4 text-sm text-center text-slate-600">
  Belum punya akun?
  <a
    href="/auth/register"
    onclick={(event) => go(event, "/auth/register")}
    class="font-semibold text-indigo-600 hover:underline">Daftar</a
  >
</p>