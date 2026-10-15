<script>
  import { profile } from "../../auth/states/authStore.js";
  import { savePassword, savePhoto, saveProfile } from "../states/usersStore.js";
  import { useInput } from "../../../hooks/useInput.js";
  import { showWarningDialog } from "../../../helpers/toolsHelper.js";

  const name = useInput($profile.name);
  const email = useInput($profile.email);
  const password = useInput("");
  const newPassword = useInput("");
  let photo = $state(null);

  function submitProfile(event) {
    event.preventDefault();
    return saveProfile($name, $email);
  }

  async function submitPhoto(event) {
    event.preventDefault();
    if (!photo) {
      await showWarningDialog("Pilih foto terlebih dahulu");
      return;
    }
    await savePhoto(photo);
  }

  async function submitPassword(event) {
    event.preventDefault();
    if (await savePassword($password, $newPassword)) {
      password.reset();
      newPassword.reset();
    }
  }
</script>

<section class="space-y-6 max-w-xl">
  <h1 class="text-2xl font-bold">Profil</h1>

  <div class="flex items-center gap-4">
    {#if $profile.photo}
      <img src={$profile.photo} alt={$profile.name} class="size-16 rounded-full object-cover" />
    {:else}
      <span
        aria-hidden="true"
        class="grid size-16 place-items-center rounded-full bg-indigo-100 text-xl font-semibold text-indigo-700"
        >{$profile.name.charAt(0).toUpperCase()}</span
      >
    {/if}
    <div>
      <p class="font-semibold">{$profile.name}</p>
      <p class="text-sm text-slate-500">{$profile.email}</p>
    </div>
  </div>

  <form onsubmit={submitProfile} class="space-y-3 rounded-xl bg-white p-5 shadow-sm">
    <h2 class="font-semibold">Ubah Data</h2>
    <div>
      <label for="profile-name" class="block text-sm font-medium mb-1">Nama</label>
      <input id="profile-name" type="text" required bind:value={$name}
        class="w-full rounded-lg border border-slate-300 px-3 py-2" />
    </div>
    <div>
      <label for="profile-email" class="block text-sm font-medium mb-1">Email</label>
      <input id="profile-email" type="email" required bind:value={$email}
        class="w-full rounded-lg border border-slate-300 px-3 py-2" />
    </div>
    <button type="submit" class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">Simpan Data</button>
  </form>

  <form onsubmit={submitPhoto} class="space-y-3 rounded-xl bg-white p-5 shadow-sm">
    <h2 class="font-semibold">Ubah Foto</h2>
    <div>
      <label for="profile-photo" class="block text-sm font-medium mb-1">Foto</label>
      <input id="profile-photo" type="file" accept="image/*"
        onchange={(event) => (photo = event.currentTarget.files[0])} />
    </div>
    <button type="submit" class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">Simpan Foto</button>
  </form>

  <form onsubmit={submitPassword} class="space-y-3 rounded-xl bg-white p-5 shadow-sm">
    <h2 class="font-semibold">Ubah Kata Sandi</h2>
    <div>
      <label for="profile-password" class="block text-sm font-medium mb-1">Kata Sandi Lama</label>
      <input id="profile-password" type="password" required bind:value={$password}
        class="w-full rounded-lg border border-slate-300 px-3 py-2" />
    </div>
    <div>
      <label for="profile-new-password" class="block text-sm font-medium mb-1">Kata Sandi Baru</label>
      <input id="profile-new-password" type="password" required bind:value={$newPassword}
        class="w-full rounded-lg border border-slate-300 px-3 py-2" />
    </div>
    <button type="submit" class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">Simpan Kata Sandi</button>
  </form>
</section>
