import { writable } from "svelte/store";

/** Store input formulir: bisa dipakai dengan bind:value={$input}. */
export function useInput(initial) {
  const { subscribe, set, update } = writable(initial);
  return {
    subscribe,
    set,
    update,
    reset: () => set(initial),
  };
}
