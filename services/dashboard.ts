import { IDashboard } from "@/lib/types/dashboard";



export const getDashboard = async (periode: string) => {
  let response: IDashboard;
  const req = await fetch(`/api/dashboard?periode=${periode}`);

  if (req.status !== 201) {
    response = {};
  } else {
    response = (await req.json()) as IDashboard;
  }

  return await response;
};
