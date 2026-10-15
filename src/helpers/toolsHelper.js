import Swal from "sweetalert2";

export function showSuccessDialog(text) {
  return Swal.fire({ icon: "success", title: "Berhasil", text });
}

export function showErrorDialog(text) {
  return Swal.fire({ icon: "error", title: "Gagal", text });
}

export function showWarningDialog(text) {
  return Swal.fire({ icon: "warning", title: "Perhatian", text });
}

export async function showConfirmDialog(text) {
  const result = await Swal.fire({
    icon: "question",
    title: "Konfirmasi",
    text,
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  });
  return result.isConfirmed;
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Jalankan aksi async; tampilkan dialog error bila gagal. Mengembalikan true/false. */
export async function attempt(action) {
  try {
    await action();
    return true;
  } catch (error) {
    await showErrorDialog(error.message);
    return false;
  }
}
