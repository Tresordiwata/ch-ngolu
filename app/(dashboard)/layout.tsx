'use client';

import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const utilisateur = useAuthStore((state) => state.utilisateur);

  useEffect(() => {
    if (!utilisateur) {
      router.push('/login');
    }
  }, [utilisateur]);

  if (!utilisateur) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col mb-5">
      {/* <Navbar /> */}
      <main className="flex-1 container mx-auto px-4 py-8 mt-b">{children}</main>
      <Footer />
    </div>
  );
}