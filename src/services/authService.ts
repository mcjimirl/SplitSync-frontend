import type { AuthUser } from "../types";
import { api } from "./api";

export async function loginWithPassword(email: string, password: string) {
  const { data } = await api.post<{ token: string }>("/auth/login", { email, password });
  return data.token;
}

export async function signupWithPassword(firstName: string, lastName: string, email: string, password: string) {
  const { data } = await api.post<{ token: string }>("/auth/signup", { firstName, lastName, email, password });
  return data.token;
}

export async function getCurrentUser(token: string) {
  const { data } = await api.get<{ user: AuthUser }>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.user;
}

export async function updateMe(
  token: string,
  payload: {
    name?: string;
    firstName?: string;
    lastName?: string;
    age?: number | null;
    sex?: "male" | "female" | "other" | null;
    heightCm?: number | null;
    weightKg?: number | null;
    avatarUrl?: string | null;
  },
) {
  const { data } = await api.put<{ user: AuthUser }>("/auth/me", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.user;
}

export async function uploadMyAvatar(token: string, file: File) {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await api.post<{ user: AuthUser }>("/auth/me/avatar", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.user;
}
