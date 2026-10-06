import { useEffect, useState } from "react";
import Header from "./Header";
import { supabase } from "../api/supabase";
import { useAuth } from "./AuthContext";

export default function Profile({
  onGoToRecipes,
  onBack,
  onGoToProfile,
}) {
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setEmail(user.email || "");

        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        setFullName(
          data?.full_name ||
            user.user_metadata?.full_name ||
            ""
        );
      } catch (error) {
        console.error("Error loading profile:", error);

        setError(
          error.message || "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  async function handleSave() {
    const trimmedName = fullName.trim();

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: trimmedName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profileError) {
        throw profileError;
      }

      // Also update the name stored in Supabase Auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: trimmedName,
        },
      });

      if (authError) {
        throw authError;
      }

      setFullName(trimmedName);
      setIsEditing(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);

      setError(
        error.message || "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F0]">
        <Header
          currentPage="profile"
          onGoToRecipes={onGoToRecipes}
          onBack={onBack}
          onGoToProfile={onGoToProfile}
        />

        <main className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="text-5xl">🥕</div>

            <p className="mt-4 font-semibold text-[#164C3A]">
              Loading your profile...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <Header
        currentPage="profile"
        onGoToRecipes={onGoToRecipes}
        onBack={onBack}
        onGoToProfile={onGoToProfile}
      />

      <main
        className="px-4 py-10 sm:px-6 md:py-16"
      >
        <div className="mx-auto max-w-3xl">

          {/* Heading */}
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#E8751A]">
              Account
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#164C3A] sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your personal information and account.
            </p>
          </div>

          {/* Profile Card */}
          <section className="overflow-hidden rounded-3xl bg-white shadow-sm">

            {/* Profile Header */}
            <div className="border-b border-gray-100 bg-[#164C3A] px-6 py-8 text-white sm:px-8">
              <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl shadow-sm">
                  👤
                </div>

                <div className="mt-4 sm:ml-5 sm:mt-0">
                  <h2 className="text-2xl font-bold">
                    {fullName || "PantryPal User"}
                  </h2>

                  <p className="mt-1 text-sm text-white/75">
                    {email}
                  </p>
                </div>

              </div>
            </div>

            {/* Personal Information */}
            <div className="p-6 sm:p-8">

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#164C3A]">
                    Personal Information
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Your basic account information.
                  </p>
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setMessage("");
                      setIsEditing(true);
                    }}
                    className="rounded-xl border border-[#E8751A] px-4 py-2 text-sm font-semibold text-[#E8751A] transition hover:bg-[#FFF3E8]"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="mt-8 space-y-6">

                {/* Full Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Full Name
                  </label>

                  {isEditing ? (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none transition focus:border-[#E8751A] focus:ring-2 focus:ring-[#E8751A]/10"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="mt-2 rounded-xl bg-gray-50 px-4 py-3 text-gray-800">
                      {fullName || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Email Address
                  </label>

                  <div className="mt-2 rounded-xl bg-gray-50 px-4 py-3 text-gray-800">
                    {email}
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    Your email address is managed by your account
                    authentication settings.
                  </p>
                </div>

              </div>

              {/* Messages */}
              {error && (
                <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {message && (
                <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                  {message}
                </div>
              )}

              {/* Edit Buttons */}
              {isEditing && (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setError("");
                      setMessage("");
                    }}
                    disabled={saving}
                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-xl bg-[#164C3A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#123E30] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                </div>
              )}

            </div>
          </section>

          {/* Account Management */}
          <section className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="p-6 sm:p-8">

              <h3 className="text-lg font-bold text-[#164C3A]">
                Account Management
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Manage your PantryPal account.
              </p>

              <div className="mt-6 space-y-3">

                <button
                  type="button"
                  disabled
                  className="flex w-full items-center justify-between rounded-2xl border border-gray-100 px-4 py-4 text-left opacity-60"
                >
                  <div>
                    <p className="font-semibold text-gray-700">
                      Change Password
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Update your account password.
                    </p>
                  </div>

                  <span>→</span>
                </button>

                <button
                  type="button"
                  disabled
                  className="flex w-full items-center justify-between rounded-2xl border border-red-100 px-4 py-4 text-left opacity-60"
                >
                  <div>
                    <p className="font-semibold text-red-500">
                      Delete Account
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Permanently delete your PantryPal account.
                    </p>
                  </div>

                  <span>→</span>
                </button>

              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}