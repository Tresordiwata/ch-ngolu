'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/store/authStore";
import { useQueryClient } from "@tanstack/react-query";

const depensePlanifieeSchema = z.object({
  montant: z.number().min(1, "Le montant doit être supérieur à 0"),
  description: z.string().min(1, "La description est requise"),
  jourDuMois: z.number().min(1, "Le jour doit être entre 1 et 31").max(31, "Le jour doit être entre 1 et 31"),
});

type DepensePlanifieeForm = z.infer<typeof depensePlanifieeSchema>;

interface DepensePlanifieeFormProps {
  isOpen: boolean;
  onClose: () => void;
  depense?: {
    id: string;
    montant: number;
    description: string;
    jourDuMois: number;
  };
}

export function DepensePlanifieeForm({ 
  isOpen, 
  onClose, 
  depense,
}: DepensePlanifieeFormProps) {
  const utilisateur = useAuthStore((state) => state.utilisateur);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DepensePlanifieeForm>({
    resolver: zodResolver(depensePlanifieeSchema),
    defaultValues: depense ? {
      montant: depense.montant,
      description: depense.description,
      jourDuMois: depense.jourDuMois,
    } : undefined,
  });

  const onSubmit = async (data: DepensePlanifieeForm) => {
    try {
      const payload = {
        ...data,
        succursaleId: utilisateur?.succursaleId,
      };

      const response = await fetch(`/api/depenses-planifiees${depense ? `/${depense.id}` : ''}`, {
        method: depense ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement de la dépense planifiée');
      }

      toast.success(depense ? 'Dépense planifiée modifiée avec succès' : 'Dépense planifiée créée avec succès');
      queryClient.invalidateQueries({ queryKey: ['depenses-planifiees'] });
      reset();
      onClose();
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            <h2 className="text-xl font-bold">
              {depense ? 'Modifier la dépense planifiée' : 'Nouvelle dépense planifiée'}
            </h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                {...register("montant", { valueAsNumber: true })}
                type="number"
                label="Montant"
                errorMessage={errors.montant?.message}
              />

              <Input
                {...register("description")}
                label="Description"
                errorMessage={errors.description?.message}
              />

              <Input
                {...register("jourDuMois", { valueAsNumber: true })}
                type="number"
                min={1}
                max={31}
                label="Jour du mois"
                errorMessage={errors.jourDuMois?.message}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Annuler
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              {depense ? 'Modifier' : 'Créer'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}