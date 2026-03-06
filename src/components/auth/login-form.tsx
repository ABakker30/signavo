"use client";

import { useActionState } from "react";

interface LoginState {
  error?: string;
}

async function signInAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: formData.get("email"),
      password: formData.get("password"),
    }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Invalid email or password" };
  }

  window.location.href = "/dashboard";
  return {};
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signInAction, {});

  return (
    <>
      {state.error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {pending ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </>
  );
}
