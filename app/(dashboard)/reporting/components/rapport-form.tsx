'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/lib/store/authStore";
import PDFExport from "../../components/pdf-export";
import { useState } from "react";

const rapportSchema = z.object({
  dateDebut: z.string().min(1, "La date de début est requise"),
  dateFin: z.string().min(1, "La date de fin est requise"),
  type: z.enum(["depenses", "entrees", "global"]),
  format: z.enum(["detaille", "resume"]),
});

type RapportForm = z.infer<typeof rapportSchema>;

interface RapportFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RapportForm({ isOpen, onClose }: RapportFormProps) {
  const utilisateur = useAuthStore((state) => state.utilisateur);
  const [rapportData, setRapportData] = useState<any>(null);
  const [showPDF, setShowPDF] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RapportForm>({
    resolver: zodResolver(rapportSchema),
    defaultValues: {
      type: "global",
      format: "detaille",
    },
  });

  const onSubmit = async (data: RapportForm) => {
    try {
      const response = await fetch('/api/reporting/generer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          succursaleId: utilisateur?.succursaleId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du rapport');
      }

      const result = await response.json();
      setRapportData(result);
      setShowPDF(true);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleClosePDF = () => {
    setShowPDF(false);
    setRapportData(null);
    reset();
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen && !showPDF} onClose={onClose} size="2xl">
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              <h2 className="text-xl font-bold">Générer un rapport</h2>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Controller
                  name="dateDebut"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      label="Date de début"
                      errorMessage={errors.dateDebut?.message}
                    />
                  )}
                />

                <Controller
                  name="dateFin"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="date"
                      label="Date de fin"
                      errorMessage={errors.dateFin?.message}
                    />
                  )}
                />

                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Type de rapport"
                      value={field.value}
                      onChange={field.onChange}
                      errorMessage={errors.type?.message}
                    >
                      <SelectItem key="global" >Rapport Global</SelectItem>
                      <SelectItem key="depenses">Dépenses</SelectItem>
                      <SelectItem key="entrees">Entrées</SelectItem>
                    </Select>
                  )}
                />

                <Controller
                  name="format"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Format"
                      value={field.value}
                      onChange={field.onChange}
                      errorMessage={errors.format?.message}
                    >
                      <SelectItem key="detaille" >Détaillé</SelectItem>
                      <SelectItem key="resume">Résumé</SelectItem>
                    </Select>
                  )}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Annuler
              </Button>
              <Button color="primary" type="submit" isLoading={isSubmitting}>
                Générer
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}