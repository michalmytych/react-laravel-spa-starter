import { api } from "@/lib/api";

export async function csrf(): Promise<void> {
  await api.get("/sanctum/csrf-cookie");
}
