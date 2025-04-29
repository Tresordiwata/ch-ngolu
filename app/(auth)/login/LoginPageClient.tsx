/* eslint-disable prettier/prettier */

"use client";

import { Button } from "@heroui/button";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@heroui/input";

import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";

export default function LoginPageClient() {
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
          window.location.href="/dashboard";
        });
    } catch (err:any) {
      toast.error("Erreur lors de la connexion");
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
                alt="logo"
                className=" text-white"
                height={120}
                src={"/logo.jpeg"}
                width={120}
              />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-[#072baf]">Bienvenue</h2>
          <p className="mt-2 text-sm text-primary">
            Connectez-vous à votre compte
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
              <Input
                id="login"
                label="votre login"
                labelPlacement="outside"
                name="login"
                type=""
                color="primary"
                // onChange={(e) => setEmail(e.target.value)}
                required
              />
          </div>

          <div className="">
            <Input
              required
              color="primary"
              id="password"
              label="Mot de passe"
              labelPlacement="outside"
              name="password"
              type="password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* <input
                className="h-4 w-4 rounded border-gray-300 text-[#072baf] focus:ring-[#072baf]"
                id="remember-me"
                name="remember-me"
                type="checkbox"
              /> */}
              {/* <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Se souvenir de moi
              </label> */}
            </div>

            <div className="text-sm">
              <Link className="font-medium text-[#072baf] hover:text-[#afa316]" href="#">
                Mot de passe oublié?
              </Link>
            </div>
          </div>

          <Button
            className="w-full"
            color="primary"
            loading={submitting }
            type="submit"
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
