import React from "react";

import { cookies } from "next/headers";
import { IUtilisateur } from "@/lib/types/utilisateur";
import PageClient  from "./ParametreClientPage";

const page = async() => {
  const profil=JSON.parse((await cookies()).get("profil")?.value || "") as IUtilisateur

  return <PageClient profil={profil} />;
};

export default page;
