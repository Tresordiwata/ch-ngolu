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
} from "lucide-react";
import { Modal, Spin } from "antd";
import { ReactEventHandler, useEffect, useState } from "react";
import Succussale from "./components/Succussale";
import ModalUsable from "@/reusables/ModalReusable";
import ModalAntReusable from "@/reusables/ModalAntReusable";
import ModalWithForm from "@/reusables/ModalWithForm";
import { getRubriques } from "@/services/rubriques";
import { IRubrique } from "@/lib/types/rubrique";

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

let idSelected={}
export default function Rubrique() {
  const [spinning,setSpinning]=useState(false)
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
  const handleOkAnt = async() => {
    console.log("Votre id",idSelected);
    setSpinning(true)
    const requete=(await fetch("/api/rubriques/",{method:'DELETE',body:JSON.stringify({id:idSelected})}))
    if(requete)
    {
      toast("Bien supprimé",{theme:"dark", type:"success"})
      setSpinning(false)
    }else{
      toast("Une erreur s'est produite pendant la connexion vers le serveur",{type:"error",theme:"dark"})
    }
  };
  const handleOkHeroUiModal = () => {
    alert("ok");
    // setModalAdd(!modalAdd)
  };

  const rubriques=useQuery({queryKey:["rubrique"],queryFn:getRubriques,refetchInterval:2000}).data as IRubrique[]

  return (
    <div className="space-y-6">
      <div className="text-end">
        <Button
          color="primary"
          size="sm"
          startContent={<PlusCircle />}
          onPress={() => setModalAdd(!modalAdd)}
          // onPress={() => {setModalAntAdd(new Date())}}
        >
          Rubriques
        </Button>
      </div>

      <Card className="mt-4">
        <CardHeader className="border-b border-gray-800">
          <h2 className="text-xl font-semibold ">
            Rubriques depensées-Recettes
          </h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <Tabs>
              <Tab key={"1"} title="Depenses">
                <Spin spinning={spinning}>
                <Table>
                  <TableHeader>
                    <TableColumn>Type</TableColumn>
                    <TableColumn>Libellé</TableColumn>
                    <TableColumn>Action</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {
                      rubriques?.filter(r=>{return r.typeRubr=="D"}).map((rubrique,i)=>(
                    <TableRow key={i}>
                      <TableCell>{rubrique.typeRubr=="D"?"Dépense":"recette"}</TableCell>
                      <TableCell>{rubrique.libelle}</TableCell>
                      <TableCell className="flex items-center justify-center gap-4">
                        <Button type="button" variant="faded" size="sm" startContent={<Edit2 size={12} />} isIconOnly={true}></Button>
                        <Button type="button" variant="flat" onPress={()=>{idSelected=rubrique.id;setModalAntAdd(new Date)}} size="sm" startContent={<Trash2 size={12} />} isIconOnly={true}></Button>
                      </TableCell>
                    </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
                </Spin>
              </Tab>
              <Tab key={"2"} title="Recettes">
                <Spin spinning={spinning}>
                <Table>
                  <TableHeader>
                    <TableColumn>Type</TableColumn>
                    <TableColumn>Libellé</TableColumn>
                    <TableColumn>Action</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {
                      rubriques?.filter(r=>{return r.typeRubr=="R"}).map((rubrique,i)=>(
                    <TableRow key={i}>
                      <TableCell>{rubrique.typeRubr=="D"?"Dépense":"Recette"}</TableCell>
                      <TableCell>{rubrique.libelle}</TableCell>
                      <TableCell className="flex items-center justify-center gap-4">
                        <Button type="button" variant="faded" size="sm" startContent={<Edit2 size={12} />} isIconOnly={true} />
                        <Button type="button" variant="flat" onPress={()=>{idSelected=rubrique.id;setModalAntAdd(new Date)}} size="sm" startContent={<Trash2 size={12} />} isIconOnly={true} />
                      </TableCell>
                    </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
                </Spin>
              </Tab>
            </Tabs>
          </div>
        </CardBody>
      </Card>

      <div>
        <ModalWithForm
          endPoint="rubriques"
          action="POST"
          titre={"Ajout type rubrique"}
          isOpened={modalAdd}
        >
          <>
            <Select
              name="typeRubrique"
              className=""
              label="Type rubrique"
              labelPlacement={"outside"}
            >
              <SelectItem key={"D"}>Dépense</SelectItem>
              <SelectItem key={"R"}>Recette</SelectItem>
            </Select>
            <Input
              isRequired={true}
              name="libelle"
              color="primary"
              label="Libellé"
              labelPlacement="outside"
            />
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
    </div>
  );
}
