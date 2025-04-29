"use client";
import React from "react";
import { Alert, Tab, Tabs } from "@heroui/react";

import VersementPage from "./VersementPage";

import PageContent from "@/layouts/PageContent";
import { IUtilisateur } from "@/lib/types/utilisateur";

const FinancePageClient = ({ profil }: { profil: IUtilisateur }) => {
  return (
    <PageContent titre={"Finance"}>
      <div>
        <Tabs color="primary" variant="solid">
          <Tab key={1} title="Situation Global">
            <div className="text-center ">
              <Alert color="warning" variant="solid">Aucun contenu actuellement</Alert>
            </div>
          </Tab>
          <Tab key={2} title="Versement à la banque">
            <div>
              <VersementPage profil={profil} />
            </div>
          </Tab>
          {/* <Tab key={3} title="Retrait à la banque">
            <div>papa</div>
          </Tab> */}
        </Tabs>
      </div>
    </PageContent>
  );
};

export default FinancePageClient;
