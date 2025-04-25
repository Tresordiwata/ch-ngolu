/* eslint-disable prettier/prettier */

"use client";

import { Card } from "antd";
import { Button } from "@heroui/button";

import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { Loader2, User2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@heroui/input";

export default function LoginPage() {
  const [submitting,setSubmitting]=useState(false)
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = (data: React.FocusEvent<HTMLFormElement>) => {
    data.preventDefault();
    const dataFormated = Object.fromEntries(new FormData(data.currentTarget));

    try {
      fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataFormated),
      })
        .then((r) => r.json())
        .then((response) => {
          if (!response.connected) {
            throw new Error("Identifiants invalides");
          }
          const { utilisateur, token } = response;
          setAuth(utilisateur, token);
          router.push("/dashboard");
        });
    } catch (error) {
      toast.error("Erreur lors de la connexion");
      console.log(error);
    }
  };

  return (
    // <Card className="w-full max-w-md min-h-[400px]">
    //   <div className="flex flex-col gap-1 text-center">
    //     <h1 className="text-2xl font-bold">NGOLU-APP</h1>
    //     <p className="text-default-500">Connectez-vous à votre compte</p>
    //   </div>
    //   <div className="h-full">
    //     <form
    //       onSubmit={onSubmit}
    //       className="space-y-4 flex flex-col gap-6 pt-7"
    //     >
    //       <Input name="login" placeholder="Email" type="text" />
    //       <Input name="pwd" placeholder="Mot de passe" type="password" />
    //       <Button
    //         type="primary"
    //         htmlType="submit"
    //         className="w-full"
    //         disabled={isSubmitting}
    //       >
    //         {isSubmitting ? (
    //           <Loader2 className="animate-spin" />
    //         ) : (
    //           "Se connecter"
    //         )}
    //       </Button>
    //     </form>
    //   </div>
    // </Card>
    <main className="min-h-screen w-full m-0 flex items-center justify-center ">
      <div className="w-full p-8 bg-white max-w-[400px] rounded-xl shadow-xl flex flex-col justify-between">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <Image
                src={"/vercel.svg"}
                alt="logo"
                width={120}
                height={120}
                className=" text-white"
              />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-[#072baf]">Bienvenue</h2>
          <p className="mt-2 text-sm text-primary">
            Connectez-vous à votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
              <Input
                id="login"
                type=""
                name="login"
                label="votre login"
                labelPlacement="outside"
                color="warning"
                // onChange={(e) => setEmail(e.target.value)}
                required
              />
          </div>

          <div className="">
            <Input
              id="password"
              type="password"
              name="password"
              label="Mot de passe"
              labelPlacement="outside"
              color="warning"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-[#072baf] focus:ring-[#072baf]"
              />
              {/* <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Se souvenir de moi
              </label> */}
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-[#072baf] hover:text-[#afa316]">
                Mot de passe oublié?
              </a>
            </div>
          </div>

          <Button
            htmlType="submit"
            color="primary"
            type="primary"
            className="w-full"
            loading={submitting}
          >
            Se connecter
          </Button>
        </form>

        {/* <p className="mt-20 text-center text-sm text-gray-600">
          Pas encore de compte?{" "}
          <a
            href="#"
            className="font-medium text-[#072baf] hover:text-[#afa316]"
          >
            S&apos;inscrire
          </a>
        </p> */}
      </div>
    </main>
  );
}
