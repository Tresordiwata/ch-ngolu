'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useAuthStore } from "@/lib/store/authStore";
import { useQueryClient } from "@tanstack/react-query";

const depenseSchema = z.object({
  montant: z.number().min(1, "Le montant doit être supérieur à 0"),
  description: z.string().min(1, "La description est requise"),
  typeDepense: z.enum(["interne", "externe"]),
  typeDepenseId: z.string().min(1, "Le type de dépense est requis"),
  fournisseurId: z.string().optional(),
  pieceJustificative: z.string().optional(),
});

type DepenseForm = z.infer<typeof depenseSchema>;

interface DepenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  depense?: {
    id: string;
    montant: number;
    description: string;
    typeDepenseInterneId?: string;
    typeDepenseExterneId?: string;
    fournisseurId?: string;
    pieceJustificative?: string;
  };
  typesDepenseInterne: { id: string; libelle: string; }[];
  typesDepenseExterne: { id: string; libelle: string; }[];
  fournisseurs: { id: string; nom: string; }[];
}

export function DepenseForm({ 
  isOpen, 
  onClose, 
  depense,
  typesDepenseInterne,
  typesDepenseExterne,
  fournisseurs,
}: DepenseFormProps) {
  const utilisateur = useAuthStore((state) => state.utilisateur);
  const queryClient = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DepenseForm>({
    resolver: zodResolver(depenseSchema),
    defaultValues: depense ? {
      montant: depense.montant,
      description: depense.description,
      typeDepense: depense.typeDepenseInterneId ? "interne" : "externe",
      typeDepenseId: depense.typeDepenseInterneId || depense.typeDepenseExterneId,
      fournisseurId: depense.fournisseurId,
      pieceJustificative: depense.pieceJustificative,
    } : {
      typeDepense: "interne",
    },
  });

  const typeDepense = watch("typeDepense");

  const onSubmit = async (data: DepenseForm) => {
    try {
      const payload = {
        ...data,
        succursaleId: utilisateur?.succursaleId,
        typeDepenseInterneId: data.typeDepense === "interne" ? data.typeDepenseId : undefined,
        typeDepenseExterneId: data.typeDepense === "externe" ? data.typeDepenseId : undefined,
      };

      const response = await fetch(`/api/depenses${depense ? `/${depense.id}` : ''}`, {
        method: depense ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement de la dépense');
      }

      toast.success(depense ? 'Dépense modifiée avec succès' : 'Dépense créée avec succès');
      queryClient.invalidateQueries({ queryKey: ['depenses'] });
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
              {depense ? 'Modifier la dépense' : 'Nouvelle dépense'}
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
                name="typeDepense"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Type de dépense"
                    value={field.value}
                    onChange={field.onChange}
                    errorMessage={errors.typeDepense?.message}
                  >
                    <SelectItem key="interne">Interne</SelectItem>
                    <SelectItem key="externe">Externe</SelectItem>
                  </Select>
                )}
              />

              <Controller
                name="typeDepenseId"
                control={control}
                render={({ field }) => (
                  <Select
                    label={typeDepense === "interne" ? "Type de dépense interne" : "Type de dépense externe"}
                    value={field.value}
                    onChange={field.onChange}
                    errorMessage={errors.typeDepenseId?.message}
                  >
                    {(typeDepense === "interne" ? typesDepenseInterne : typesDepenseExterne).map((type) => (
                      <SelectItem key={type.id}>
                        {type.libelle}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />

              {typeDepense === "externe" && (
                <Controller
                  name="fournisseurId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Fournisseur"
                      value={field.value}
                      onChange={field.onChange}
                      errorMessage={errors.fournisseurId?.message}
                    >
                      {fournisseurs.map((fournisseur) => (
                        <SelectItem key={fournisseur.id} >
                          {fournisseur.nom}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              )}

              <Input
                {...register("pieceJustificative")}
                type="file"
                label="Pièce justificative"
                accept="image/*,.pdf"
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