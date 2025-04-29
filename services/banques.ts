import { IBanque } from "@/lib/types/banques";

export const getBanques = async () => {
  let response: IBanque[] = [];
  const req = await fetch(`/api/banque`);

  if (req.status !== 201) {
    response = [];
  } else {
    response = (await req.json()) as IBanque[];
  }

  return await response;
};
