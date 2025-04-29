import { cookies } from "next/headers";

import RecettedetailPage from "./RecettedetailPage";

import { IUtilisateur } from "@/lib/types/utilisateur";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const pathnames = await searchParams;
  const id: any = pathnames?.id?.toString();
  const profil = JSON.parse(
    (await cookies())?.get("profil")?.value || "",
  ) as IUtilisateur;

  return <RecettedetailPage recette={id} profil={profil} />;
}
