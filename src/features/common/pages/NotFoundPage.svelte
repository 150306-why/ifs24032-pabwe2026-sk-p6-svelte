<script>
  import { go } from "../../../router.js";
</script>

<section class="py-16 text-center">
  <p class="text-6xl font-extrabold text-indigo-600">404</p>
  <h1 class="mt-2 text-2xl font-bold">Halaman tidak ditemukan</h1>
  <p class="mt-1 text-slate-600">Alamat yang kamu tuju tidak tersedia.</p>
  <a
    href="/"
    onclick={(event) => go(event, "/")}
    class="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white"
    >Kembali ke Beranda</a
  >
</section>
