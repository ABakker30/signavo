import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back to Signavo.
        </p>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="font-medium text-gray-900 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
