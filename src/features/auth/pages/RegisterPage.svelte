<script>
  import { useInput } from "../../../hooks/useInput.js";
  import { doRegister } from "../states/authStore.js";
  import {
    showErrorDialog,
    showSuccessDialog,
  } from "../../../helpers/toolsHelper.js";
  import { go, navigate } from "../../../router.js";

  const name = useInput("");
  const email = useInput("");
  const password = useInput("");
  let loading = $state(false);

  async function submit(event) {
    event.preventDefault();
    loading = true;
    try {
      await doRegister($name, $email, $password);
      await showSuccessDialog("Registrasi berhasil, silakan masuk");
      navigate("/auth/login");
    } catch (error) {
      await showErrorDialog(error.message);
    }
    loading = false;
  }
</script>

<h2 class="text-xl font-semibold mb-4">Daftar</h2>
<form onsubmit={submit} class="space-y-4">
  <div>
    <label for="register-name" class="block text-sm font-medium mb-1">Nama</label>
    <input
      id="register-name"
      type="text"
      required
      bind:value={$name}
      class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
  <div>
    <label for="register-email" class="block text-sm font-medium mb-1">Email</label>
    <input
      id="register-email"
      type="email"
      required
      bind:value={$email}
      class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
  <div>
    <label for="register-password" class="block text-sm font-medium mb-1">Kata Sandi</label>
    <input
      id="register-password"
      type="password"
      required
      bind:value={$password}
      class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
  <button
    type="submit"
    disabled={loading}
    class="w-full rounded-lg bg-indigo-600 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
  >
    Daftar
  </button>
</form>
<p class="mt-4 text-sm text-center text-slate-600">
  Sudah punya akun?
  <a
    href="/auth/login"
    onclick={(event) => go(event, "/auth/login")}
    class="font-semibold text-indigo-600 hover:underline">Masuk</a
  >
</p>
