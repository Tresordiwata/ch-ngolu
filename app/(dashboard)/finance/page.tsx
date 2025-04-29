import React from "react";
import { cookies } from "next/headers";

import FinancePageClient from "./FinancePageClient";

import { IUtilisateur } from "@/lib/types/utilisateur";

const page = async () => {
  const profil = JSON.parse(
    (await cookies()).get("profil")?.value || "",
  ) as IUtilisateur;

  return <FinancePageClient profil={profil} />;
};

export default page;
