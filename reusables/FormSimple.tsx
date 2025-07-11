/* eslint-disable prettier/prettier */
import { IRecette } from "@/lib/types/recette";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Divider,
} from "@heroui/react";
import { CheckCheck, Delete } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

let formAdd = {};

export default function FormSimple({
  titre,
  children,
  okText,
  cancelText,
  action,
  endPoint,
  beforeSubmitFn,
  afterSubmitFn
}: {

  titre?: React.ReactNode;
  children?: React.JSX.Element;
  okText?: string;
  cancelText?: string;
  action: string;
  endPoint: string;
  beforeSubmitFn?: (arg?: any) => void;
  afterSubmitFn?:(arg?:IRecette | any | undefined)=>void
}) {
  const [confirmSubmitForm, setConfirmSubmitForm] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [saving, setSaving] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  //SCRIPT POUR AJOUT DATA FORMULAIRE
  const handleSubmitAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formAdd = Object.fromEntries(new FormData(e.currentTarget));
    if (beforeSubmitFn) {
      beforeSubmitFn(formAdd);
    } else {
      setConfirmSubmitForm(true);
    }
  };

  const confirmHandleSubmtAdd = () => {
    setSpinning(true);
    setSaving(true);
    fetch(`/api/${endPoint}`, {
      method: `${action}`,
      body: JSON.stringify(formAdd),
    })
      .then((r) => r.json())
      .then((response) => {
        toast("Bien enregistré", { theme: "dark", type: "success" });

        if (response !== null) {
          setConfirmSubmitForm(false);
          const formulaire = document.querySelector("#f") as HTMLFormElement;
          formulaire.reset();
          onOpenChange();
          
          afterSubmitFn && afterSubmitFn(response)
        }
      })
      .catch(() => {
        toast("Echec d'operation", { theme: "dark", type: "error" });
      })
      .finally(() => {
        setSaving(false);
        setSpinning(false);
      });
  };

  //  SCRIPT
  return (
    
      <div>
        <form
                className="flex flex-col gap-9"
                id="f"
                onReset={() => setConfirmSubmitForm(false)}
                onSubmit={handleSubmitAdd}
              >
                <div className="flex flex-col gap-7">{children}</div>
                <div>&nbsp;</div>
                <div className="border-t border-gray-700 py-3 my-4 pt-5 mt-5 gap-6 flex justify-center flex-row w-full items-center">
                  <Button
                    color="primary"
                    size="sm"
                    startContent={<CheckCheck />}
                    type="submit"
                  >
                    Enregistrer
                  </Button>
                  <Button
                    color="default"
                    size="sm"
                    startContent={<Delete />}
                    type="reset"
                  >
                    Annuler
                  </Button>
                </div>
                {confirmSubmitForm && (
                  <div className="bg-default/40 rounded-md items-center justify-center w-full text-sm p-3 flex gap-3">
                    Voulez-vous vraiment enregistrer ?
                    <Button
                      isLoading={saving}
                      className="text-white"
                      color="success"
                      size="sm"
                      onPress={() => confirmHandleSubmtAdd()}
                    >
                      Confirmer
                    </Button>
                    <Button
                      size="sm"
                      onPress={() => setConfirmSubmitForm(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                )}
        </form>
      </div>

  );
}
