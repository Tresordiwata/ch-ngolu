import { cookies } from "next/headers";

import { IUtilisateur } from "@/lib/types/utilisateur";

async function useCurrentprofil(): Promise<IUtilisateur> {
  const c = await cookies();
  const cc = (await JSON.parse(
    c.get("profil")?.value.toString() || "",
  )) as IUtilisateur;
  return await cc;
}
