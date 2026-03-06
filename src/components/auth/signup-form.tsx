"use client";

import { useActionState } from "react";

interface SignupState {
  error?: string;
  message?: string;
}

async function signUpAction(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      business: formData.get("business"),
    }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.error || "Something went wrong" };
  }

  if (data.redirect) {
    window.location.href = data.redirect;
    return {};
  }

  return { message: data.message };
}

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUpAction, {});

  return (
    <>
      {state.error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {state.message && (
        <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {state.message}
        </div>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="Jane Smith"
          />
        </div>
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
          <label htmlFor="business" className="block text-sm font-medium text-gray-700">
            Business Name
          </label>
          <input
            id="business"
            name="business"
            type="text"
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="Your Realty Group"
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
            minLength={6}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {pending ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </>
  );
}
