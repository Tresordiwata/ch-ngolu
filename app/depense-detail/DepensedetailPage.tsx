"use client";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  NumberInput,
} from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

import ModalUsable from "@/reusables/ModalReusable";
import { IDepense } from "@/lib/types/depense";
import { IUtilisateur } from "@/lib/types/utilisateur";

const DepensedetailPage = ({
  depense,
  profil,
}: {
  depense: string;
  profil: IUtilisateur;
}) => {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<{
    titre: string;
    text: string;
    clb: string;
  }>({
    titre: "",
    text: "",
    clb: "",
  });

  const [error, setError] = useState(false);
  const [data, setData] = useState<IDepense | null>(null);

  const router = useRouter();

  //  Pour Modal
  const [modalAdd, setModalAdd] = useState(false);

  useEffect(() => {
    setModalAdd(!modalAdd);
  }, []);
  // Fin Modal

  const loadData = async () => {
    setLoading(true);
    const requete = await fetch("/api/depenses/" + depense);
    const response = (await requete.json()) as IDepense;

    if (!response) {
      setError(true);
    } else {
      setData(response);
      setLoading(false);
    }
  };
  const deleteDepense = () => {
    setModalAdd(!modalAdd);
  };
  const handleCloture = () => {
    setModalAdd(!modalAdd);
    setLoading(true);
    fetch("api/depenses/" + data?.id, {
      method: "PUT",
      body: JSON.stringify({ action: "cloture" }),
    })
      .then((response) => response.json())
      .then(() => {
        toast("Bien cloturé", { theme: "dark", type: "success" });
        router.push("/depenses");
      })
      .catch((er) => {
        console.log(er);
      })
      .finally(() => {
        setModalAdd(!modalAdd);
        setLoading(false);
      });
  };
  const handleDelete = () => {
    setModalAdd(!modalAdd);
    setLoading(true);
    fetch("/api/depenses", {
      method: "DELETE",
      body: JSON.stringify({ id: data?.id }),
    })
      .then((response) => response.json())
      .then((result) => {
        toast("Bien supprimé", { type: "success" });
      })
      .catch((err) => {
        toast("Echec de suppression", { theme: "dark", type: "error" });
      })
      .finally(() => {
        setModalAdd(!modalAdd);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Spin spinning={loading}>
        {error && (
          <Alert className="w-full mb-5" color="danger" variant="bordered">
            {"Une erreur s'est produite"}
          </Alert>
        )}
        <Card>
          <CardHeader className="border-b border-gray-700">
            <h1 className="text-primary text-xl mb-3 flex gap-3 items-center">
              <Link href={"/depenses"}>
                <ArrowLeft />
              </Link>{" "}
              Detail dépense
            </h1>
          </CardHeader>
          <CardBody className="flex flex-col gap-5">
            <div className="grid grid-cols-3">
              <Input
                defaultValue={moment(data?.dateDepense).format("YYYY-MM-DD")}
                label="Date"
                labelPlacement="outside-left"
                type="date"
              />
              <Input
                label="Date"
                labelPlacement="outside-left"
                type="text"
                value={data?.rubrique?.libelle}
                onChange={(e) => setData({ ...data })}
              />
              <NumberInput
                endContent={<div>{data?.devise}</div>}
                label="Montant"
                labelPlacement="outside-left"
                value={Number(data?.montant)}
                onChange={(e) => setData({ ...data, montant: Number(e) })}
              />
            </div>
            <div className="grid grid-cols-3">
              <Input
                label="Beneficiare"
                labelPlacement="outside-left"
                value={data?.beneficiaire}
              />
              <Input
                label="Succursale"
                labelPlacement="outside-left"
                value={data?.succursale?.nom}
              />
            </div>
          </CardBody>
          <CardFooter>
            <div className="w-full border-t border-gray-700 py-3 flex flex-row items-center justify-center gap-3">
              {profil.role !== "UTILISATEUR" && (
                <Button
                  color={data?.estCloturee === "OG" ? "default" : "primary"}
                  disabled={
                    (data?.estCloturee === "OG" ||
                      data?.estCloturee === "OL") &&
                    true
                  }
                  onPress={() => {
                    setAction({
                      titre: "Cloture",
                      text: "Voulez-vous vraiment cloturer cette depense ?",
                      clb: "Cloture",
                    });
                    setModalAdd(!modalAdd);
                  }}
                >
                  Cloturer
                </Button>
              )}
              <Button
                color="primary"
                disabled={
                  (data?.estCloturee === "OG" || data?.estCloturee === "OL") &&
                  true
                }
              >
                Modifier
              </Button>

              <Button
                color="danger"
                disabled={
                  (data?.estCloturee === "OG" || data?.estCloturee === "OL") &&
                  true
                }
                onPress={() => {
                  setAction({
                    titre: "Suppression",
                    text: "Voulez-vous vraiment supprimer ?",
                    clb: "suppression",
                  });
                  setModalAdd(!modalAdd);
                }}
              >
                Supprimer
              </Button>
            </div>
          </CardFooter>
        </Card>
        <ModalUsable
          isOpened={modalAdd}
          titre={action.titre}
          onOk={action.clb == "suppression" ? handleDelete : handleCloture}
        >
          <div>{action.text}</div>
        </ModalUsable>
      </Spin>
    </div>
  );
};

export default DepensedetailPage;
