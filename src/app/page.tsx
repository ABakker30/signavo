export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">
          Signavo
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">
          AI-powered presence engine for real estate professionals.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Launching soon in Hampton Roads, VA.
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <a
            href="/login"
            className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors text-center"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
          >
            Get Started
          </a>
        </div>
      </div>
    </main>
  );
}
