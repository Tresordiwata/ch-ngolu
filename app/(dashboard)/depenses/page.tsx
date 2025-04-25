import React from "react";
import { cookies } from "next/headers";

import DepensesPage from "./DepensePageClient";

import { IUtilisateur } from "@/lib/types/utilisateur";

const page = async () => {
  const Cookies = await cookies();

  const profil = JSON.parse(`${Cookies.get("profil")?.value}`) as IUtilisateur;

  return profil ? <DepensesPage profil={profil} /> : "connecte-toi";
};

export default page;
