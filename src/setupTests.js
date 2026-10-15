import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("lucide-svelte", () => {
  const Icon = () => {};
  const names = [
    "Link2",
    "LogOut",
    "Plus",
    "Trash2",
    "Pencil",
    "Image",
    "ExternalLink",
    "Users",
    "User",
    "LayoutList",
    "Search",
  ];
  return Object.fromEntries(names.map((name) => [name, Icon]));
});
