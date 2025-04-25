import { IDepense } from "@/lib/types/depense";

export const getDepenses = async ({ limit = 100 }: { limit: number }) => {
  let response: IDepense[] = [];
  const req = await fetch(`/api/depenses?limit=${limit}`);

  if (req.status !== 201) {
    response = [];
  } else {
    response = (await req.json()) as IDepense[];
  }

  return await response;
};
