"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Sign in to continue to your account
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-100 transition"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>

        <div className="mt-6 text-sm text-gray-500 text-center">
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
