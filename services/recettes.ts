import { IRecette } from "@/lib/types/recette";

export const getRecettes = async ({ limit = 100 }: { limit: number }) => {
  let response: IRecette[] = [];
  const req = await fetch(`/api/recettes?limit=${limit}`);

  if (req.status !== 201) {
    response = [];
  } else {
    response = (await req.json()) as IRecette[];
  }

  return await response;
};
