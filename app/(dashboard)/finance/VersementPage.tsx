"use client";
import {
  Button,
  NumberInput,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { CheckCheck, FileArchive, PlusIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import { getComptes } from "@/services/comptes";
import { ICompte } from "@/lib/types/comptes";
import ModalWithForm from "@/reusables/ModalWithForm";
import { IUtilisateur } from "@/lib/types/utilisateur";
import { IVersement } from "@/lib/types/versement";
import { getVersements } from "@/services/versements";
import { EyeIcon } from "@/styles/icones";

const VersementPage = ({ profil }: { profil: IUtilisateur }) => {
  const [formModal, setFormModal] = useState(false);
  const [comptes, setComptes] = useState<ICompte[]>([]);
  const [page, setPage] = React.useState(1);

  const versements = useQuery({
    queryKey: ["versements"],
    queryFn: getVersements,
    refetchInterval:2000
  }).data as IVersement[];

  useEffect(() => {
    setFormModal(!formModal);
    getComptes().then((r) => {
      setComptes(r);
    });
  }, []);

  const rowsPerPage = 10;

  const pages = React.useMemo(() => {
    return versements?.length ? Math.ceil(versements?.length / rowsPerPage) : 0;
  }, [versements?.length, rowsPerPage]);

  return (
    <div>
      <div className="w-3/3">
        <div>
          <Table
            aria-label="Liste des comptes"
            bottomContent={
              pages > 0 ? (
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              ) : null
            }
            title="Derniers versements"
            topContent={
              <div className="flex justify-between">
                <span>Liste des derniers versements</span>
                <div className="flex gap-3 flex-row">
                  <Button
                    color="primary"
                    startContent={<PlusIcon size={14} />}
                    onPress={() => setFormModal(!formModal)}
                  >
                    Nouveau versement
                  </Button>
                  <Button
                    color="primary"
                    startContent={<FileArchive size={14} />}
                    onPress={() => setFormModal(!formModal)}
                  >
                    Rapports versements
                  </Button>
                </div>
              </div>
            }
          >
            <TableHeader>
              <TableColumn key={1} className="text-center">
                {"DATE VERS"}
              </TableColumn>
              <TableColumn key={2} className="text-center">
                {"MONTANT VERSEMENT"}
              </TableColumn>
              <TableColumn key={3} className="text-center">
                {"COMPTE"}
              </TableColumn>
              <TableColumn key={4} className="text-center">
                {"ACTION"}
              </TableColumn>
            </TableHeader>
            <TableBody>
              {versements?.map((versement,i) => (
                <TableRow key={i}>
                  <TableCell className="text-center">
                    <span>
                      {moment(versement.dateVersement).format("DD/MM/YYYY")}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {versement?.montant.toString()} {versement?.compte?.devise}
                  </TableCell>
                  <TableCell className="text-center">
                    {versement?.compte?.numero?.toString()}
                  </TableCell>
                  <TableCell className="text-center flex gap-3">
                    <Button
                      isIconOnly
                      color="primary"
                      size="sm"
                      startContent={<CheckCheck />}
                    />
                    <Button isIconOnly size="sm" startContent={<EyeIcon />} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <ModalWithForm
        action="POST"
        endPoint="/versement"
        isOpened={formModal}
        titre="Nouveau versement"
      >
        <>
          <input
            name="utilisateurId"
            type="hidden"
            value={profil?.id.toString()}
          />
          <input
            name="succursaleId"
            type="hidden"
            value={profil?.succursaleId.toString()}
          />
          <Select label="Compte" labelPlacement="outside" name="compte">
            {comptes?.map((compte, i) => (
              <SelectItem key={`${compte?.id}`}>
                {compte?.numero} [{compte?.banque.nom} - ${compte.devise}]
              </SelectItem>
            ))}
          </Select>
          <NumberInput
            label="Montant"
            labelPlacement="outside"
            name="montant"
          />
        </>
      </ModalWithForm>
    </div>
  );
};

export default VersementPage;
