"use client";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Tabs,
  Tab,
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
  Trash,
  Trash2,
  Edit2,
  User2,
  Loader2,
} from "lucide-react";
import { Modal, Spin } from "antd";
import { ReactEventHandler, useEffect, useState } from "react";
import Succussale from "./components/Succussale";
import ModalUsable from "@/reusables/ModalReusable";
import ModalAntReusable from "@/reusables/ModalAntReusable";
import ModalWithForm from "@/reusables/ModalWithForm";
import { getRubriques } from "@/services/rubriques";
import { IRubrique } from "@/lib/types/rubrique";
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

export default function Utilisateur() {
  const [spinning, setSpinning] = useState(false);
  const [spinglobal, setSpinglobal] = useState(false);
  const [utilisateurs,setUtilisateurs]=useState<IUtilisateur[]>([])
  const [succursales,setSuccursales]=useState<ISuccursale[]>([])
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
  const handleOkHeroUiModal = () => {
    alert("ok");
    // setModalAdd(!modalAdd)
  };
  const checkDataBeforFecth=(data:any)=>{
    if(data?.password!==data?.password2)
    {
      return toast("Les 2 mot de passes ne correspondent pas",{theme:"dark", type:"error"})
    }else{
      setSpinglobal(true)
      setModalAdd(false)
      fetch("/api/utilisateurs",{method:'POST',body:JSON.stringify(data)}).then(r=>r.json())
      .then(response=>{
        console.log(response);
        alert("test")
        if(response){
          toast("Utilisateur bien enregistré",{type:"success", theme:"dark"});
        }
      }).catch(error=>{

      }).finally(()=>{
        setSpinglobal(false)
      })
    }
    
  }

  getSuccursales().then(r=>setSuccursales(r))

  const ut=useQuery({queryKey:["utilisateurs"],queryFn:getUtilisateurs}).data as IUtilisateur[]

  return (
    <div className="space-y-6">
      <Spin spinning={spinglobal} indicator={<Loader2 className="animate-spin" />}>
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
          <h2 className="flex items-center gap-3 text-xl font-semibold ">
            <User2 /> Tous les utilisateurs
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <Select
              label="Selectionner Succursale"
              labelPlacement="outside"
              className="max-w-md"
            >
              <SelectItem></SelectItem>
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
                        <TableCell>
                          {utilisateur?.succursale?.nom}
                        </TableCell>
                        <TableCell>
                          {utilisateur?.nom}
                        </TableCell>
                        <TableCell>
                          {utilisateur?.email}
                        </TableCell>
                        <TableCell>
                          {utilisateur?.role}
                        </TableCell>
                        <TableCell className="flex items-center justify-center gap-4">
                          <Button
                            type="button"
                            variant="shadow"
                            size="sm"
                            title="Modifier"
                            isIconOnly={true}
                            startContent={<Edit2 size={12} />}
                          ></Button>
                          <Button
                            type="button"
                            variant="flat"
                            title="Supprimer"
                            isIconOnly={true}
                            onPress={() => {
                              idSelected = utilisateur.id;
                              setModalAntAdd(new Date());
                            }}
                            size="sm"
                            startContent={<Trash2 size={12} />}
                          ></Button>
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
          endPoint="utilisateur"
          action="POST"
          titre={
            <div className="flex items-center gap-4">
              <User2 size={17} />
              Ajout utilisateur
            </div>
          }
          isOpened={modalAdd}
          beforeSubmitFn={checkDataBeforFecth}
        >
          <>
            <Select
              isRequired
              name="succursale"
              className=""
              label="Succursale"
              labelPlacement={"outside"}
            >
              {
                succursales?.map((succursale,i)=>(
                  <SelectItem key={succursale.id}>{succursale.nom?.toUpperCase()}</SelectItem>
                ))
              }
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input
                isRequired={true}
                name="nom"
                color="primary"
                label="Nom"
                labelPlacement="outside"
              />
              <Input
                isRequired={true}
                name="prenom"
                color="primary"
                label="Prenom"
                labelPlacement="outside"
              />
            </div>
            <Select
              name="role"
              className=""
              label="Role"
              labelPlacement={"outside"}
            >
              <SelectItem key={"ADMIN_GENERAL"}>ADMIN_GENERAL</SelectItem>
              <SelectItem key={"ADMIN_SUCCURSALE"}>ADMIN SUCC</SelectItem>
              <SelectItem key={"UTILISATEUR"}>UTILISATEUR</SelectItem>
            </Select>
            <Input
              isRequired={true}
              name="login"
              color="primary"
              label="Login"
              labelPlacement="outside"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                isRequired={true}
                name="password"
                color="primary"
                label="Mot de passe"
                labelPlacement="outside"
              />
              <Input
                isRequired={true}
                name="password2"
                color="primary"
                label="Retaper mot de passe"
                labelPlacement="outside"
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
