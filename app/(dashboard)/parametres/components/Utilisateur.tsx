"use client";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "react-toastify";
import { PlusCircle, Trash2, Edit2, User2, Loader2, User } from "lucide-react";
import { Spin } from "antd";
import { useEffect, useState } from "react";

import { useAuthStore } from "@/lib/store/authStore";
import ModalAntReusable from "@/reusables/ModalAntReusable";
import ModalWithForm from "@/reusables/ModalWithForm";
import { IUtilisateur } from "@/lib/types/utilisateur";
import { getSuccursales } from "@/services/succursale";
import { ISuccursale } from "@/lib/types/succursale";
import { getUtilisateurs } from "@/services/utilisateurs";

const profilSchema = z.object({
  email: z.string().email("Email invalide"),
  nom: z.string().min(1, "Le nom est requis"),
  prenom: z.string().min(1, "Le prénom est requis"),
});

const motDePasseSchema = z
  .object({
    ancienMotDePasse: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    nouveauMotDePasse: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmationMotDePasse: z.string(),
  })
  .refine((data) => data.nouveauMotDePasse === data.confirmationMotDePasse, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmationMotDePasse"],
  });

type ProfilForm = z.infer<typeof profilSchema>;
type MotDePasseForm = z.infer<typeof motDePasseSchema>;

let formAdd = {};

let idSelected = {};

export default function Utilisateur({ profil }: { profil?: IUtilisateur }) {
  const [spinning, setSpinning] = useState(false);
  const [spinglobal, setSpinglobal] = useState(false);
  const [succursales, setSuccursales] = useState<ISuccursale[]>([]);
  const setAuth = useAuthStore((state) => state.setAuth);

  //  Pour Modal
  const [modalAdd, setModalAdd] = useState(false);
  const [modalAntAdd, setModalAntAdd] = useState<Date | null>(null);

  useEffect(() => {
    setModalAdd(!modalAdd);
    setModalAntAdd(modalAntAdd == null ? null : new Date());
  }, []);
  // Fin Modal

  const onSubmitProfil = async (data: ProfilForm) => {
    try {
      const response = await fetch(`/api/utilisateurs/${utilisateur?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du profil");
      }

      const utilisateurMisAJour = await response.json();

      setAuth(utilisateurMisAJour, utilisateur?.token || "");
      toast.success("Profil mis à jour avec succès");
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  const onSubmitMotDePasse = async (data: MotDePasseForm) => {
    try {
      const response = await fetch(
        `/api/utilisateurs/${utilisateur?.id}/mot-de-passe`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du mot de passe");
      }

      resetMotDePasse();
      toast.success("Mot de passe mis à jour avec succès");
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };
  const handleOkAnt = async () => {
    console.log("Votre id", idSelected);
    setSpinning(true);
    const requete = await fetch("/api/rubriques/", {
      method: "DELETE",
      body: JSON.stringify({ id: idSelected }),
    });

    if (requete) {
      toast("Bien supprimé", { theme: "dark", type: "success" });
      setSpinning(false);
    } else {
      toast("Une erreur s'est produite pendant la connexion vers le serveur", {
        type: "error",
        theme: "dark",
      });
    }
  };
  const checkDataBeforFecth = (data: any) => {
    if (data?.password !== data?.password2) {
      return toast("Les 2 mot de passes ne correspondent pas", {
        theme: "dark",
        type: "error",
      });
    } else {
      setModalAdd(!modalAdd);
      setSpinglobal(true);
      fetch("/api/utilisateurs", { method: "POST", body: JSON.stringify(data) })
        .then((r) => r.json())
        .then((response) => {
          if (response) {
            toast("Utilisateur bien enregistré", {
              type: "success",
              theme: "dark",
            });
          }
        })
        .catch((error) => {})
        .finally(() => {
          setSpinglobal(false);
        });
    }
  };

  getSuccursales().then((r) => setSuccursales(r));

  const ut = useQuery({ queryKey: ["utilisateurs"], queryFn: getUtilisateurs })
    .data as IUtilisateur[];

  return (
    <div className="space-y-6">
      <Spin
        indicator={<Loader2 className="animate-spin" />}
        spinning={spinglobal}
      >
        <div className="text-end">
          <Button
            color="primary"
            size="sm"
            startContent={<PlusCircle />}
            onPress={() => setModalAdd(!modalAdd)}
            // onPress={() => {setModalAntAdd(new Date())}}
          >
            Nouvel utilisateur
          </Button>
        </div>

        <Card className="mt-4">
          <CardHeader className="border-b border-gray-800">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-danger">
            <User className="w-7 h-7" /> Tous les utilisateurs
            </h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Select
                className="max-w-md"
                label="Selectionner Succursale"
                labelPlacement="outside"
              >
                <SelectItem />
              </Select>
              <Spin spinning={spinning}>
                <Table color="warning">
                  <TableHeader>
                    <TableColumn>Succursale</TableColumn>
                    <TableColumn>Nom</TableColumn>
                    <TableColumn>Login</TableColumn>
                    <TableColumn>Role</TableColumn>
                    <TableColumn>Action</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {ut?.map((utilisateur, i) => (
                      <TableRow key={i}>
                        <TableCell>{utilisateur?.succursale?.nom}</TableCell>
                        <TableCell>{utilisateur?.nom}</TableCell>
                        <TableCell>{utilisateur?.email}</TableCell>
                        <TableCell>{utilisateur?.role}</TableCell>
                        <TableCell className="flex items-center justify-center gap-4">
                          <Button
                            isIconOnly={true}
                            size="sm"
                            startContent={<Edit2 size={12} />}
                            title="Modifier"
                            type="button"
                            variant="shadow"
                          />
                          <Button
                            isIconOnly={true}
                            size="sm"
                            startContent={<Trash2 size={12} />}
                            title="Supprimer"
                            type="button"
                            variant="flat"
                            onPress={() => {
                              idSelected = utilisateur.id;
                              setModalAntAdd(new Date());
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Spin>
            </div>
          </CardBody>
        </Card>

        <div>
          <ModalWithForm
            action="POST"
            beforeSubmitFn={checkDataBeforFecth}
            endPoint="utilisateur"
            isOpened={modalAdd}
            titre={
              <div className="flex items-center gap-4">
                <User2 size={17} />
                Ajout utilisateur
              </div>
            }
          >
            <>
              <Select
                isRequired
                className=""
                label="Succursale"
                labelPlacement={"outside"}
                name="succursale"
              >
                {succursales
                  ?.filter((succursale) => {
                    return (
                      succursale.id === profil?.succursaleId ||
                      profil?.role === "ADMIN_GENERAL"
                    );
                  })
                  ?.map((succursale, i) => (
                    <SelectItem key={succursale.id}>
                      {succursale.nom?.toUpperCase()}
                    </SelectItem>
                  ))}
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  color="primary"
                  isRequired={true}
                  label="Nom"
                  labelPlacement="outside"
                  name="nom"
                />
                <Input
                  color="primary"
                  isRequired={true}
                  label="Prenom"
                  labelPlacement="outside"
                  name="prenom"
                />
              </div>
              <Select
                className=""
                label="Role"
                labelPlacement={"outside"}
                name="role"
              >
                {profil?.role === "ADMIN_GENERAL" ? (
                  <SelectItem key={"ADMIN_GENERAL"}>ADMIN_GENERAL</SelectItem>
                ) : null}
                <SelectItem key={"ADMIN_SUCCURSALE"}>ADMIN SUCC</SelectItem>
                <SelectItem key={"UTILISATEUR"}>UTILISATEUR</SelectItem>
              </Select>
              <Input
                color="primary"
                isRequired={true}
                label="Login"
                labelPlacement="outside"
                name="login"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  color="primary"
                  isRequired={true}
                  label="Mot de passe"
                  labelPlacement="outside"
                  name="password"
                />
                <Input
                  color="primary"
                  isRequired={true}
                  label="Retaper mot de passe"
                  labelPlacement="outside"
                  name="password2"
                />
              </div>
            </>
          </ModalWithForm>
        </div>

        <ModalAntReusable
          isOpened={modalAntAdd}
          titre="Suppression"
          onOk={handleOkAnt}
        >
          <div>Voulez-vous supprimer</div>
        </ModalAntReusable>
      </Spin>
    </div>
  );
}
