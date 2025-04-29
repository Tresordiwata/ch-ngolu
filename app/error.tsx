"use client";

import PageContent from "@/layouts/PageContent";
import { Alert } from "@heroui/react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <PageContent titre={"Page d'erreur"}>
      <div className="flex flex-col gap-5 items-center justify-center">
        <Alert variant="solid" color="danger">{"Une erreur s'est produite dans le système, desolé"}</Alert>
        <div>
          <Link href={"/login"}>Se reconnecter</Link>
        </div>
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </button>
      </div>
    </PageContent>
  );
}
