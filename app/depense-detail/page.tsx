import { cookies } from "next/headers";

import DepensedetailPage from "./DepensedetailPage";

import { IUtilisateur } from "@/lib/types/utilisateur";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const pathnames = await searchParams;
  const id: any = pathnames?.id?.toString();
  const profil = JSON.parse(
    (await cookies()).get("profil")?.value || "",
  ) as IUtilisateur;

  return <DepensedetailPage depense={id} profil={profil} />;
}
