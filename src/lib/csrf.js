import { api } from "./api";

export async function csrf() {
  await api.get("/sanctum/csrf-cookie");
}
