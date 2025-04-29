"use client";
import { Card, CardBody, CardHeader, Button, Input } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

import SuccursaleCard from "./SuccursaleCard";

import ModalAntReusable from "@/reusables/ModalAntReusable";
import ModalWithForm from "@/reusables/ModalWithForm";
import { getSuccursales } from "@/services/succursale";
import { ISuccursale } from "@/lib/types/succursale";
import { useAuthStore } from "@/lib/store/authStore";
import { IUtilisateur } from "@/lib/types/utilisateur";

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

export default function Succursale({ profil }: { profil: IUtilisateur }) {
  const utilisateur = useAuthStore((state) => state.utilisateur);
  const setAuth = useAuthStore((state) => state.setAuth);

  //  Pour Modal
  const [modalAdd, setModalAdd] = useState(false);
  const [modalAntAdd, setModalAntAdd] = useState<Date | null>(null);

  useEffect(() => {
    setModalAdd(!modalAdd);
    setModalAntAdd(modalAntAdd == null ? null : new Date());
  }, []);
  // Fin Modal

 

  const {
    register: registerProfil,
    handleSubmit: handleSubmitProfil,
    formState: { errors: errorsProfil, isSubmitting: isSubmittingProfil },
  } = useForm<ProfilForm>({
    resolver: zodResolver(profilSchema),
    defaultValues: {
      email: utilisateur?.email,
      nom: utilisateur?.nom,
      prenom: utilisateur?.prenom,
    },
  });

  const {
    register: registerMotDePasse,
    handleSubmit: handleSubmitMotDePasse,
    formState: {
      errors: errorsMotDePasse,
      isSubmitting: isSubmittingMotDePasse,
    },
    reset: resetMotDePasse,
  } = useForm<MotDePasseForm>({
    resolver: zodResolver(motDePasseSchema),
  });

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

      // setAuth(utilisateurMisAJour, utilisateur?.token || "");
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
  const handleOkAnt = () => {
    // alert("ok")
  };
  const handleOkHeroUiModal = () => {
    alert("ok");
    // setModalAdd(!modalAdd)
  };
  const listeSuccursale = useQuery({
    queryKey: ["succursales"],
    queryFn: getSuccursales,
    refetchInterval: 2000,
  }).data as ISuccursale[];

  return (
    <div className="space-y-6">
      {/* <h1 className="text-2xl font-bold -mt-7">Paramètres</h1> */}
      <div className="text-end">
        <Button
          color="primary"
          size="sm"
          startContent={<PlusCircle />}
          onPress={() => setModalAdd(!modalAdd)}
          // onPress={() => {setModalAntAdd(new Date())}}
        >
          Nouvelle Succussale
        </Button>
      </div>

      <Card className="mt-4">
        <CardHeader className="border-b border-gray-700">
          <h2 className="text-xl font-semibold w-full text-danger">
            Liste des succursales
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-3 gap-5">
            {listeSuccursale?.map((succursale, id) => (
              <SuccursaleCard key={id} profil={profil} detail={succursale} />
            ))}
          </div>
        </CardBody>
      </Card>
      <div>
        <ModalWithForm
          action="POST"
          endPoint="succursales"
          isOpened={modalAdd}
          titre={"Ajout succursale"}
        >
          <>
            <Input
              color="primary"
              isRequired={true}
              label="Code Succussale"
              labelPlacement="outside"
              name="code"
            />
            <Input
              color="primary"
              isRequired={true}
              label="Nom succussale"
              labelPlacement="outside"
              name="nom"
            />
            <Input
              color="primary"
              label="Adresse Succussale"
              labelPlacement="outside"
              name="adresse"
            />
            <div className="flex justify-between gap-3">
              <Input
                color="primary"
                label="Téléphone"
                labelPlacement="outside"
                name="telephone"
              />
              <Input
                color="primary"
                label="E-mail"
                labelPlacement="outside"
                name="email"
              />
            </div>
          </>
        </ModalWithForm>
      </div>

      <ModalAntReusable
        isOpened={modalAntAdd}
        titre="dsjkdskd"
        onOk={handleOkAnt}
      >
        <div>Suppression okkkk</div>
      </ModalAntReusable>
    </div>
  );
}
