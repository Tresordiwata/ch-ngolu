import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import LoginPageClient from "./LoginPageClient";

const page = async () => {
  const Cookies = await (await cookies())?.get("profil")?.value;

  if (Cookies) {
    return redirect("/dashboard");
  }

  return <LoginPageClient />;
};

export default page;
