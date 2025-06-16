"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { initialize } from "@/app/utils/controler";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dataLoaded, setDataLoaded] = useState(false);
  const router = useRouter();
  const utilisateur = useAuthStore((state) => state.utilisateur);

  useEffect(() => {
    if (!utilisateur) {
      router.push("/login");
    } else {
    }
  }, [utilisateur]);

  useEffect(() => {
    initialize().then((r) => {
      console.log("Données chargées")
      setDataLoaded(true);
    });
  }, []);

  if (!utilisateur) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col mb-5">
      {/* <Navbar /> */}
      <main className="flex-1 container mx-auto px-4 py-8 mt-b">
        {children}
      </main>
      <Footer />
    </div>
  );
}
