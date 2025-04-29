import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@heroui/react";
import { Edit, Edit2, PlusCircle, Trash2 } from "lucide-react";

import { IUtilisateur } from "@/lib/types/utilisateur";
import PageContent from "@/layouts/PageContent";
import ModalWithForm from "@/reusables/ModalWithForm";
import { useQuery } from "@tanstack/react-query";
import { getBanques } from "@/services/banques";
import { IBanque } from "@/lib/types/banques";
import CompteListe from "./CompteListe";

const Banque = ({ profil }: { profil: IUtilisateur }) => {
  const [modalBanque, setModalBanque] = useState(false);
  const banques = useQuery({
    queryKey: ["banques"],
    queryFn: getBanques,
  }).data as IBanque[];
  useEffect(() => {
    setModalBanque(!modalBanque);
  }, []);

  return (
    <PageContent titre={"Gestion des comptes et banques"}>
      <>
        <Tabs aria-label="Options" variant="underlined">
          <Tab key={1} title="Gestion des comptes">
            <div>
                <CompteListe />
            </div>
          </Tab>
          <Tab key={2} title="Gestion banques">
            <div className="text-end">
              <Button
                color="primary"
                size="sm"
                startContent={<PlusCircle />}
                onPress={() => setModalBanque(!modalBanque)}
              >
                Ajouter une banque
              </Button>
            </div>
            <Table color="secondary">
              <TableHeader>
                <TableColumn>#</TableColumn>
                <TableColumn>Nom banque</TableColumn>
                <TableColumn>Action</TableColumn>
              </TableHeader>
              <TableBody>
                {banques?.map((banque, i) => (
                  <TableRow key={i}>
                    <TableCell>{i+1}</TableCell>
                    <TableCell>{banque.nom}</TableCell>
                    <TableCell>
                        <div className="flex flex-row gap-3">
                            <Button variant="solid" color="primary" size="sm" title="Modifier" isIconOnly={true}><Edit2 size={12} /></Button>
                            <Button variant="faded" color="default" size="sm" title="Supprimer" isIconOnly={true}><Trash2 size={12} /></Button>
                        </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tab>
        </Tabs>
        <ModalWithForm
          action="POST"
          endPoint="banque"
          isOpened={modalBanque}
          titre="Ajout Banque"
        >
          <div>
            <Input
              isRequired
              color="primary"
              label="Nom de la banque"
              labelPlacement="outside"
              name="nom"
              size="md"
            />
          </div>
        </ModalWithForm>
      </>
    </PageContent>
  );
};

export default Banque;
