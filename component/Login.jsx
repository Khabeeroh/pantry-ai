import { useState } from "react";
import { supabase } from "../api/supabase";

export default function Login({ onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw loginError;
      }

      // AuthContext will automatically detect the login.
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF9F0] px-6 py-12">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <div className="text-center">
          <div className="text-5xl">🥕</div>

          <h1 className="mt-4 text-3xl font-bold text-[#164C3A]">
            Welcome back
          </h1>

          <p className="mt-2 text-gray-500">
            Log in to access your PantryPal account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E8751A]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E8751A]"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#164C3A] px-5 py-3 font-semibold text-white transition hover:bg-[#123E30] disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSignUp}
            className="font-semibold text-[#E8751A]"
          >
            Create one
          </button>
        </p>

      </div>

    </main>
  );
}