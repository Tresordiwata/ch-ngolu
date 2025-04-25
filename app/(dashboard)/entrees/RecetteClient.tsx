/* eslint-disable prettier/prettier */
"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  NumberInput,
  DatePicker,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Plus, FileUp, Filter, Grip } from "lucide-react";
import { useEffect, useState } from "react";
import {now, getLocalTimeZone} from "@internationalized/date";
import Link from "next/link";

import ModalWithForm from "@/reusables/ModalWithForm";
import { useAuthStore } from "@/lib/store/authStore";
import { IDepense } from "@/lib/types/depense";
import { IUtilisateur } from "@/lib/types/utilisateur";
import { getRubriques } from "@/services/rubriques";
import { IRubrique } from "@/lib/types/rubrique";
import { getRecettes } from "@/services/recettes";
import { IRecette } from "@/lib/types/recette";


export default function RecetteClient({profil}:{profil:IUtilisateur}) {
  const utilisateur = useAuthStore((state) => state.utilisateur);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("tous");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [modalUsableStatus, setModalUsableStatus] = useState(false);

//   const { data: depenses, isLoading: depensesLoading } = useQuery<IDepense[]>({
//     queryKey: ["depenses", utilisateur?.succursaleId],
//     queryFn: async () => {
//       const response = await fetch(
//         `/api/depenses?succursaleId=${utilisateur?.succursaleId}`
//       );

//       if (!response.ok)
//         throw new Error("Erreur lors du chargement des dépenses");

//       return response.json();
//     },
//     enabled: !!utilisateur?.succursaleId,
//   });

//   const { data: typesDepenseInterne } = useQuery<ITypeDepense[]>({
//     queryKey: ["types-depense-interne"],
//     queryFn: async () => {
//       const response = await fetch("/api/types-depense-interne");

//       if (!response.ok)
//         throw new Error(
//           "Erreur lors du chargement des types de dépense interne"
//         );

//       return response.json();
//     },
//   });

//   const { data: typesDepenseExterne } = useQuery<ITypeDepense[]>({
//     queryKey: ["types-depense-externe"],
//     queryFn: async () => {
//       const response = await fetch("/api/types-depense-externe");

//       if (!response.ok)
//         throw new Error(
//           "Erreur lors du chargement des types de dépense externe"
//         );

//       return response.json();
//     },
//   });

//   const { data: fournisseurs } = useQuery<IFournisseur[]>({
//     queryKey: ["fournisseurs"],
//     queryFn: async () => {
//       const response = await fetch("/api/fournisseurs");

//       if (!response.ok)
//         throw new Error("Erreur lors du chargement des fournisseurs");

//       return response.json();
//     },
//   });

//   const filteredDepenses = depenses?.filter((depense) => {
//     const matchesSearch =
//       depense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       depense.montant.toString().includes(searchTerm);

//     const matchesType =
//       typeFilter === "tous" ||
//       (typeFilter === "interne" && depense.typeDepenseInterne) ||
//       (typeFilter === "externe" && depense.typeDepenseExterne);

//     const matchesStatus =
//       statusFilter === "tous" ||
//       (statusFilter === "cloturees" && depense.estCloturee) ||
//       (statusFilter === "non-cloturees" && !depense.estCloturee);

//     return matchesSearch && matchesType && matchesStatus;
//   });
  const rubriqueDepense=useQuery({queryKey:["rubriqueDepenses"],queryFn:getRubriques}).data as IRubrique[]
  const recettes = useQuery({queryKey:["depense"],queryFn:()=>getRecettes({limit:100}),refetchInterval:2000}).data as IRecette[]

  useEffect(() => {
    setModalUsableStatus(!modalUsableStatus);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex flex-row items-center gap-3 text-danger">
          <Grip /> Gestion des Recettes
        </h1>
        <div className="flex gap-2">
          <Button
            color="primary"
            size="sm"
            startContent={<Plus />}
            onPress={() => {
              setModalUsableStatus(!modalUsableStatus);
            }}
          >
            Nouvelle Recette
          </Button>
          <Button color="secondary" size="sm" startContent={<FileUp />}>
            Exporter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Filtres</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Type"
              labelPlacement="outside"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <SelectItem key="tous" value="tous">
                Tous
              </SelectItem>
              <SelectItem key="interne" value="interne">
                Interne
              </SelectItem>
              <SelectItem key="externe" value="externe">
                Externe
              </SelectItem>
            </Select>
            <Select
              label="Statut"
              labelPlacement="outside"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <SelectItem key="tous" value="tous">
                Tous
              </SelectItem>
              <SelectItem key="cloturees" value="cloturees">
                Clôturées
              </SelectItem>
              <SelectItem key="non-cloturees" value="non-cloturees">
                Non Clôturées
              </SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Rubrique</th>
                  <th className="text-left py-3 px-4">Montant</th>
                  <th className="text-left py-3 px-4">Utilisateur</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recettes?.map((recette) => (
                  <tr key={recette.id} className="border-b">
                    <td className="py-3 px-4">
                      {new Date(recette.dateRecette).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-3 px-4">{recette.rubrique.libelle}</td>
                   
                    <td className="py-3 px-4">
                      {recette.montant} {recette.devise}
                    </td>
                    <td className="py-3 px-4">
                      {recette.utilisateur.prenom} {recette.utilisateur.nom}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          recette.estCloturee!=="N"
                            ? "bg-success/10 text-success"
                            : "bg-warning text-danger"
                        }`}
                      >
                        {recette.estCloturee==="N" ? "Non clôturée" : "Cloturée"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link href={`/recette-detail?id=${recette.id}`}>
                      <Button color="primary" size="sm" variant="light">
                        Détails
                      </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
      <ModalWithForm
        action="POST"
        endPoint="recettes"
        isOpened={modalUsableStatus}
        titre="Nouvelle recette"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-row gap-3">
            <div className="flex flex-row gap-3">
            <input name="utilisateur" type="hidden" value={profil?.id?.toString()} />
            <input name="succursaleId" type="hidden" value={profil?.succursaleId?.toString()} />
            </div>
            <DatePicker
            isRequired
            defaultValue={now(getLocalTimeZone())}
             granularity="day"
             label="Date recette"
              labelPlacement="outside"
              lang="fr"
              name="dt"
              translate="yes"
            />
          </div>

          <div className="flex flex-row gap-3">
            <NumberInput
            isRequired
              className="w-full"
              label="Montant depense"
              labelPlacement="outside"
              name="montant"
              type="number"
            />
            <Select
            isRequired
              className="min-w-[100px] w-fit"
              label="Devise"
              labelPlacement="outside"
              name="devise"
            >
              <SelectItem key={"USD"}>USD</SelectItem>
              <SelectItem key={"CDF"}>CDF</SelectItem>
            </Select>
          </div>
          <Select
            isRequired
              className=""
              label="Rubrique"
              labelPlacement="outside"
              name="rubrique"
            >
              {
                rubriqueDepense?.filter((rubrique)=>{return rubrique.typeRubr=="R"}).map(rubrique=>(
                  <SelectItem key={rubrique.id}>{rubrique.libelle}</SelectItem>
                ))
              }
            </Select>
          <Textarea
            label="Observation"
            labelPlacement="outside"
            name="description"
           />
        </div>
      </ModalWithForm>
    </div>
  );
}
