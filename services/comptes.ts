import { ICompte } from "@/lib/types/comptes";

export const getComptes = async () => {
  try {
    let response: ICompte[] = [];
    const req = await fetch(`/api/comptes`);

    if (req.status !== 201) {
      response = [];
    } else {
      response = (await req.json()) as ICompte[];
    }

    return await response;
  } catch {
    return [];
  }
};
