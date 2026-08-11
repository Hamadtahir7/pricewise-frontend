"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const payload = mode === "login"
        ? { email: form.email, password: form.password }
        : form;

      const res = await axios.post(`${API_URL}${endpoint}`, payload);
      localStorage.setItem("token", res.data.token);
      window.dispatchEvent(new Event("authchange"));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border-t-4 border-indigo-800 p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 overflow-hidden">
            {/* Replace src once you have a real logo file */}
            <Image src="/logo.png" alt="PriceWise AI" width={64} height={64} onError={(e) => (e.currentTarget.style.display = "none")} />
          </div>
          <h1 className="text-2xl font-bold text-indigo-900">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === "login" ? "Access your precision financial tools." : "Start saving money today."}
          </p>
        </div>

        <div className="flex bg-indigo-50 rounded-lg p-1 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              mode === "login" ? "bg-white text-indigo-900 shadow" : "text-gray-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              mode === "signup" ? "bg-white text-indigo-900 shadow" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Hamad"
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Password</label>
              {mode === "login" && (
                <a href="#" className="text-xs font-medium text-indigo-700">Forgot?</a>
              )}
            </div>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-800 hover:bg-indigo-900 text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Continue"} <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-indigo-50 hover:bg-indigo-100 text-gray-700 rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition"
          >
            <span className="text-base"> <Image src="/google.png" alt="PriceWise AI" width={20} height={20} /> </span> Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}