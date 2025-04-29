import { IVersement } from "@/lib/types/versement";

export const getVersements = async () => {
  let response: IVersement[] = [];
  const req = await fetch(`/api/versement`);

  if (req.status !== 201) {
    response = [];
  } else {
    response = (await req.json()) as IVersement[];
  }

  return await response;
};
