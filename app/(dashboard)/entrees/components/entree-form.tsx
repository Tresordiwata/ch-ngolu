'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/store/authStore";
import { useQueryClient } from "@tanstack/react-query";

const entreeSchema = z.object({
  montant: z.number().min(1, "Le montant doit être supérieur à 0"),
  description: z.string().min(1, "La description est requise"),
  typeEntreeId: z.string().min(1, "Le type d'entrée est requis"),
});

type EntreeForm = z.infer<typeof entreeSchema>;

interface EntreeFormProps {
  isOpen: boolean;
  onClose: () => void;
  entree?: {
    id: string;
    montant: number;
    description: string;
    typeEntreeId: string;
  };
  typesEntree: { id: string; libelle: string; }[];
}

export function EntreeForm({ 
  isOpen, 
  onClose, 
  entree,
  typesEntree,
}: EntreeFormProps) {
  const utilisateur = useAuthStore((state) => state.utilisateur);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EntreeForm>({
    resolver: zodResolver(entreeSchema),
    defaultValues: entree ? {
      montant: entree.montant,
      description: entree.description,
      typeEntreeId: entree.typeEntreeId,
    } : undefined,
  });

  const onSubmit = async (data: EntreeForm) => {
    try {
      const payload = {
        ...data,
        succursaleId: utilisateur?.succursaleId,
        utilisateurId: utilisateur?.id,
      };

      const response = await fetch(`/api/entrees${entree ? `/${entree.id}` : ''}`, {
        method: entree ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement de l\'entrée');
      }

      toast.success(entree ? 'Entrée modifiée avec succès' : 'Entrée créée avec succès');
      queryClient.invalidateQueries({ queryKey: ['entrees'] });
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
              {entree ? 'Modifier l\'entrée' : 'Nouvelle entrée'}
            </h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Controller
                name="montant"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    label="Montant"
                    value={field.value?.toString()}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    errorMessage={errors.montant?.message}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label="Description"
                    errorMessage={errors.description?.message}
                  />
                )}
              />

              <Controller
                name="typeEntreeId"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Type d'entrée"
                    value={field.value}
                    onChange={field.onChange}
                    errorMessage={errors.typeEntreeId?.message}
                  >
                    {typesEntree.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.libelle}
                      </SelectItem>
                    ))}
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
              {entree ? 'Modifier' : 'Créer'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}