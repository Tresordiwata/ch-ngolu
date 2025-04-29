import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

import ModalWithForm from "@/reusables/ModalWithForm";
import { getBanques } from "@/services/banques";
import { IBanque } from "@/lib/types/banques";
import { PlusCircle } from "lucide-react";
import { ICompte } from "@/lib/types/comptes";
import { getComptes } from "@/services/comptes";
import { EyeIcon } from "@/styles/icones";

const CompteListe = () => {
  const [modalForm, setModalForm] = useState(false);

  //   fetch API
  const banques = useQuery({ queryKey: ["banques"], queryFn: getBanques })
    .data as IBanque[];
  const comptes = useQuery({
    queryKey: ["comptes"],
    queryFn: async() => {
      let response: ICompte[] = [] as ICompte[];
      await fetch("api/comptes")
        .then((r) => r.json())
        .then((r) => {
          response = r;
          
        });
      return response;
    },
    refetchInterval:3000
  }).data as ICompte[];
  //

  useEffect(() => {
    setModalForm(!modalForm);
  }, []);

  return (
    <div>
      <div className="text-end mb-3">
        <Button
          color="primary"
          size="sm"
          startContent={<PlusCircle size={12} />}
          onPress={() => setModalForm(!modalForm)}
        >
          Nouveau
        </Button>
      </div>
      <Table
      bgcolor="bg-secondary"
        aria-label="Liste des comptes"
        // bottomContent={
        //   <div className="flex w-full justify-center">
        //     <Pagination
        //       isCompact
        //       showControls
        //       showShadow
        //       color="secondary"
        //       page={page}
        //       total={pages}
        //       onChange={(page) => setPage(page)}
        //     />
        //   </div>
        // }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="name">NOM COMPTE</TableColumn>
          <TableColumn key="role">NUMERO</TableColumn>
          <TableColumn key="banque">BANQUE</TableColumn>
          <TableColumn key="devise">DEVISE</TableColumn>
          <TableColumn key="montant">SOLDE</TableColumn>
          <TableColumn key="status">STATUS </TableColumn>
        </TableHeader>
        <TableBody>
          {comptes?.map((u, i) => (
            <TableRow key={i}>
              <TableCell>{u.nom}</TableCell>
              <TableCell>{u.numero}</TableCell>
              <TableCell>{u.banque?.nom}</TableCell>
              <TableCell>{u.devise}</TableCell>
              <TableCell>{0}</TableCell>
              <TableCell>
                <div>
                  <Button isIconOnly={true} startContent={<EyeIcon />}></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ModalWithForm
        action="POST"
        endPoint="comptes"
        isOpened={modalForm}
        titre="Ajout compte"
      >
        <div className="flex flex-col gap-5">
          <Input
            label="Nom compte"
            labelPlacement="outside"
            name="nom"
            size="sm"
            type="text"
          />
          <Input
            label="Numero compte"
            labelPlacement="outside"
            name="numero"
            size="sm"
            type="text"
          />
          <div className="flex flex-row gap-2">
            <Select
              label="Banque compte"
              labelPlacement="outside"
              name="banque"
              size="sm"
            >
              {banques
                ?.filter((b) => {
                  return b.status !== "B";
                })
                ?.map((banque, i) => (
                  <SelectItem key={banque?.id || null}>
                    {banque?.nom}
                  </SelectItem>
                ))}
            </Select>
            <Select
              label="Devise compte"
              labelPlacement="outside"
              name="devise"
              size="sm"
            >
              <SelectItem key={"USD"}>USD</SelectItem>
              <SelectItem key={"CDF"}>CDF</SelectItem>
            </Select>
          </div>
        </div>
      </ModalWithForm>
    </div>
  );
};

export default CompteListe;
