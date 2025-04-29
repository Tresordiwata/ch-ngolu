import { Button } from "@heroui/button";
import { FileChartPie } from "lucide-react";
import React from "react";

import LayoutSecond from "@/layouts/LayoutSecond";
import Link from "next/link";

const PageClient = () => {
  return (
    <LayoutSecond titre={"Reports"}>
      <div className="flex flex-col gap-4 px-10">
        <Button
            href="/reporting/depense"
          color="danger"
          fullWidth={true}
          size="lg"
          startContent={<FileChartPie />}
        >
          Rapport depenses
        </Button>
        <Button
          color="primary"
          fullWidth={true}
          size="lg"
          startContent={<FileChartPie />}
        >
          Rapport Recettes
        </Button>
        <Button
          color="success"
          fullWidth={true}
          size="lg"
          startContent={<FileChartPie />}
        >
          Rapport Versements
        </Button>
        <Link  href="/rapport-finance">
        <Button
            color="primary"
            fullWidth={true}
            size="lg"
            startContent={<FileChartPie />}
        >
          Rapport financier
        </Button>
        </Link>
      </div>
    </LayoutSecond>
  );
};

export default PageClient;
