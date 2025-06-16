"use client";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Tabs,
  Tab,
  Alert,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { Lock, Building2, User, BuildingIcon, ChartBarBig } from "lucide-react";
import { useEffect, useState } from "react";

import Rubrique from "./components/Rubrique";
import Utilisateur from "./components/Utilisateur";
import Succursale from "./components/Succussale";

import ModalWithForm from "@/reusables/ModalWithForm";
import ModalAntReusable from "@/reusables/ModalAntReusable";
import { useAuthStore } from "@/lib/store/authStore";
import { IUtilisateur } from "@/lib/types/utilisateur";
import Banque from "./components/Banque";

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

interface Succursale {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
}
let formAdd = {};

export default function ParametreClientPage({
  profil,
}: {
  profil: IUtilisateur;
}) {
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

  const { data: succursale } = useQuery<Succursale>({
    queryKey: ["succursale", utilisateur?.succursaleId],
    queryFn: async () => {
      const response = await fetch(
        `/api/succursales/${utilisateur?.succursaleId}`
      );

      if (!response.ok)
        throw new Error(
          "Erreur lors du chargement des données de la succursale"
        );

      return response.json();
    },
    enabled: !!utilisateur?.succursaleId,
  });

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
        }
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

  if (profil.role == "UTILISATEUR") {
    return (
      <Alert color="danger" variant="solid">
        {"Desolé,Vous n'avez pas accès sur cette page"}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardBody className="p-3">
          <div className="flex justify-between items-center p-3">
            <h1 className="text-2xl font-bold">Paramètres</h1>
            <span className="text-danger text-sm">
              Login : {profil.email}, Role:{profil.role}
            </span>
          </div>
        </CardBody>
      </Card>

      <Tabs aria-label="Options" color="primary">
        <Tab
          key="profil"
          title={
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Utilisateurs</span>
            </div>
          }
        >
          <Utilisateur profil={profil} />
        </Tab>

        <Tab
          key="securite"
          title={
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Roles</span>
            </div>
          }
        >
          <Card className="mt-4">
            <CardHeader className="border-b border-gray-700">
              <h2 className="text-xl font-semibold">
                Modification du mot de passe
              </h2>
            </CardHeader>
            <CardBody>
              <form
                className="space-y-4"
                onSubmit={handleSubmitMotDePasse(onSubmitMotDePasse)}
              >
                <Input
                  {...registerMotDePasse("ancienMotDePasse")}
                  errorMessage={errorsMotDePasse.ancienMotDePasse?.message}
                  label="Ancien mot de passe"
                  type="password"
                />
                <Input
                  {...registerMotDePasse("nouveauMotDePasse")}
                  errorMessage={errorsMotDePasse.nouveauMotDePasse?.message}
                  label="Nouveau mot de passe"
                  type="password"
                />
                <Input
                  {...registerMotDePasse("confirmationMotDePasse")}
                  errorMessage={
                    errorsMotDePasse.confirmationMotDePasse?.message
                  }
                  label="Confirmation du mot de passe"
                  type="password"
                />
                <Button
                  color="primary"
                  isLoading={isSubmittingMotDePasse}
                  type="submit"
                >
                  Modifier le mot de passe
                </Button>
              </form>
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="rubrique"
          title={
            <div className="flex items-center gap-2">
              <ChartBarBig className="w-4 h-4" />
              <span>Rubrique</span>
            </div>
          }
        >
          <Rubrique profil={profil} />
        </Tab>
        <Tab
          key="succursale"
          title={
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>Succursale</span>
            </div>
          }
        >
          <Succursale profil={profil} />
        </Tab>
        <Tab
          key="banque"
          title={
            <div className="flex items-center gap-2">
              <BuildingIcon className="w-4 h-4" />
              <span>Comptes et banques</span>
            </div>
          }
        >
          <Banque profil={profil} />
        </Tab>
      </Tabs>
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
        <div>Suppression</div>
      </ModalAntReusable>
    </div>
  );
}
