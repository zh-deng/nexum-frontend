import {
  LoginDto,
  LoginResponse,
  SignUpDto,
  SignUpResponse,
} from "../../types/auth";
import { API_BASE } from "../../utils/environment";
import { apiClient } from "../api-client";

export async function signupUser(data: SignUpDto): Promise<SignUpResponse> {
  return apiClient<SignUpResponse>(`/auth/signup`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: LoginDto): Promise<LoginResponse> {
  return apiClient<LoginResponse>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logoutUser() {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Logout failed");
  }

  return await res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Fetching user failed");
  }

  return await res.json();
}
