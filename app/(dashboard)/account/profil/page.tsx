import React from "react";

import ProfilPageClient from "./ProfilPageClient";
import { cookies } from "next/headers";
import { IUtilisateur } from "@/lib/types/utilisateur";

const page = async() => {
    const profil=JSON.parse((await cookies())?.get("profil")?.value || "") as IUtilisateur
  return <ProfilPageClient profil={profil}  />;
};

export default page;
