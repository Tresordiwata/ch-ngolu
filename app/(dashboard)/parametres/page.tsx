import React from "react";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { IUtilisateur } from "@/lib/types/utilisateur";
const PageClient = dynamic(() => import("./ParametreClientPage"));

const page = async() => {
  const profil=JSON.parse((await cookies()).get("profil")?.value || "") as IUtilisateur

  return <PageClient profil={profil} />;
};

export default page;
