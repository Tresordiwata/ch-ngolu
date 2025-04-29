import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
  const profil = (await cookies())?.get("profil")?.value;

  if (!profil) {
    return redirect("/login");
  }

  return redirect("/dashboard");
};

export default page;
