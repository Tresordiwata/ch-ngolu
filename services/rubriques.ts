import { IRubrique } from "@/lib/types/rubrique";

export const getRubriques = async () => {
  let resultat = {};
  const requete = await fetch("/api/rubriques");

  resultat = (await requete.json()) as IRubrique[];

  return resultat;
};
