"use client";
import {
  Button,
  Input,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import LayoutSecond from "@/layouts/LayoutSecond";
import PageContent from "@/layouts/PageContent";
import ModalUsable from "@/reusables/ModalReusable";
import { IUtilisateur } from "@/lib/types/utilisateur";

let dataToSend = {};
const ProfilPageClient = ({profil}:{profil:IUtilisateur}) => {
  const [spinning, setSpinning] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [modalText, setModalText] = useState("");
  const [fctOfOkModal, setFctOfOkModal] = useState<any>(null);

  const handleSubmit = (f: React.FormEvent<HTMLFormElement>) => {
    f.preventDefault();
    const formData = Object.fromEntries(new FormData(f.currentTarget));

    dataToSend = formData;
    if (formData?.newPwd !== formData?.newPwd2) {
      setModalText("Les 2 mots de passes ne correspondent pas");
      setFctOfOkModal(null);
      setModalOpened(!modalOpened);
    } else {
      setModalText("Voulez-vous vraiment modifier");
      setFctOfOkModal("validated");
      setModalOpened(!modalOpened);
    }
  };
  const handleSubmitModal = () => {
    if (fctOfOkModal == "validated") {
      setModalOpened(!modalOpened);
      setSpinning(true);
      fetch("/api/auth/updatepassword", {
        method: "POST",
        body: JSON.stringify(dataToSend),
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.success) {
            setSpinning(false);
            toast("Bien modifié", { theme: "dark", type: "success" });
          } else {
            toast(r.msg, { type: "error", theme: "dark" });
          }
        })
        .catch((e) => {
          toast("Echec de modification", { type: "error", theme: "dark" });
        })
        .finally(() => {
          setSpinning(false);
        });
    }
  };

  useEffect(() => {
    setModalOpened(!modalOpened);
  }, []);

  return (
    <LayoutSecond titre={"Mon Compte"}>
      <>
        <Tabs variant="bordered">
          <Tab title="Securité">
            <div className="grid grid-cols-2 gap-3">
              <PageContent titre={"Mes coordonnées"}>
                <Table >
                  <TableHeader>
                    <TableColumn>{""}</TableColumn>
                    <TableColumn>{""}</TableColumn>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{"Nom"}</TableCell>
                      <TableCell>{profil?.nom} {profil?.prenom}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{"Succursale"}</TableCell>
                      <TableCell>{profil?.succursale?.nom}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{"Role"}</TableCell>
                      <TableCell>{profil?.role}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </PageContent>
              <PageContent titre={"Changer mon mot de passe"}>
                <Spin
                  indicator={<Loader2 className="animate-spin" />}
                  spinning={spinning}
                >
                  <form onSubmit={handleSubmit}>
                    <div>
                      <Input
                        isRequired
                        label="Ancien mot de passe"
                        labelPlacement="outside"
                        name="old"
                        type="password"
                      />
                      <div className="flex flex-row gap-3">
                        <Input
                          isRequired
                          label="Nouveau mot de passe"
                          labelPlacement="outside"
                          name="newPwd"
                          type="password"
                        />
                        <Input
                          isRequired
                          label="Retaper nouveau mot de passe"
                          labelPlacement="outside"
                          name="newPwd2"
                          type="password"
                        />
                      </div>
                      <div className="flex flex-row gap-4 justify-center items-center mt-4">
                        <Button color="primary" type="submit" variant="flat">
                          Modifier
                        </Button>
                        <Button type="reset" variant="faded">
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </form>
                </Spin>
              </PageContent>
            </div>
          </Tab>
          <Tab title="Profil"></Tab>
        </Tabs>
        <ModalUsable
          isOpened={modalOpened}
          titre="Modification mot de passe"
          onOk={handleSubmitModal}
        >
          <div>{modalText}</div>
        </ModalUsable>
      </>
    </LayoutSecond>
  );
};

export default ProfilPageClient;
