"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Home } from "lucide-react";
import Image from "next/image";


export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

 useEffect(() => {
  const checkAuth = () => setLoggedIn(!!localStorage.getItem("token"));
  checkAuth();
  window.addEventListener("authchange", checkAuth);
  return () => window.removeEventListener("authchange", checkAuth);
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/");
  };

  return (
    <header className="border-t-4 border-indigo-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div  />
          <Image src="/logo.png" alt="PriceWise AI" width={30} height={30} onError={(e) => (e.currentTarget.style.display = "none")} />
          <span className="font-bold text-indigo-900 text-lg">PriceWise AI</span>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm text-gray-600">
          {loggedIn && (
            <Link href="/" className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
          )}
          <Link href="/features">Features</Link>
           <Link href="/how-it-works">How it Works</Link>
           <Link href="/pricing">Pricing</Link>
        </nav>

        {loggedIn ? (
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-sm text-indigo-800 font-medium">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-indigo-800 font-medium">
              Login
            </Link>
            <Link href="/login" className="bg-indigo-900 text-white text-sm px-4 py-2 rounded-lg font-medium">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
