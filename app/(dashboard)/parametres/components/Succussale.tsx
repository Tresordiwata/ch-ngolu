"use client";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Tabs,
  Tab,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  Lock,
  Building2,
  User,
  PlusCircle,
  CheckCheck,
  Delete,
} from "lucide-react";
import { Modal } from "antd";
import { ReactEventHandler, useEffect, useState } from "react";
import ModalUsable from "@/reusables/ModalReusable";
import ModalAntReusable from "@/reusables/ModalAntReusable";
import ModalWithForm from "@/reusables/ModalWithForm";
import { getSuccursales } from "@/services/succursale";
import { ISuccursale } from "@/lib/types/succursale";
import SuccursaleCard from "./SuccursaleCard";


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
export default function Succursale() {
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
  const listeSuccursale=useQuery({queryKey:["succursales"],queryFn:getSuccursales,refetchInterval:2000}).data as ISuccursale[]
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
            <CardHeader>
              <h2 className="text-xl font-semibold border-b w-full">
                Liste des succursales
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-3 gap-5">
                  {
                    listeSuccursale?.map((succursale,id)=>(
                      <SuccursaleCard key={id} detail={succursale} />
                    ))
                  }
              </div>
            </CardBody>
          </Card>
      <div>
        <ModalWithForm endPoint="succursales" action="POST"  titre={"Ajout succursale"} isOpened={modalAdd}>
          <>
            <Input
              isRequired={true}
              name="code"
              color="primary"
              label="Code Succussale"
              labelPlacement="outside"
            />
            <Input
              isRequired={true}
              name="nom"
              color="primary"
              label="Nom succussale"
              labelPlacement="outside"
            />
             <Input
              name="adresse"
              color="primary"
              label="Adresse Succussale"
              labelPlacement="outside"
            />
            <div className="flex justify-between gap-3">

            <Input
              
              name="telephone"
              color="primary"
              label="Téléphone"
              labelPlacement="outside"
              />
            <Input
              name="email"
              color="primary"
              label="E-mail"
              labelPlacement="outside"
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
