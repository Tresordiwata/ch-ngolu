'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const fournisseurSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres"),
  adresse: z.string().min(1, "L'adresse est requise"),
  rccm: z.string().min(1, "Le numéro RCCM est requis"),
});

type FournisseurForm = z.infer<typeof fournisseurSchema>;

interface FournisseurFormProps {
  isOpen: boolean;
  onClose: () => void;
  fournisseur?: {
    id: string;
    nom: string;
    email: string;
    telephone: string;
    adresse: string;
    rccm: string;
  };
}

export function FournisseurForm({ 
  isOpen, 
  onClose, 
  fournisseur,
}: FournisseurFormProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FournisseurForm>({
    resolver: zodResolver(fournisseurSchema),
    defaultValues: fournisseur ? {
      nom: fournisseur.nom,
      email: fournisseur.email,
      telephone: fournisseur.telephone,
      adresse: fournisseur.adresse,
      rccm: fournisseur.rccm,
    } : undefined,
  });

  const onSubmit = async (data: FournisseurForm) => {
    try {
      const response = await fetch(`/api/fournisseurs${fournisseur ? `/${fournisseur.id}` : ''}`, {
        method: fournisseur ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement du fournisseur');
      }

      toast.success(fournisseur ? 'Fournisseur modifié avec succès' : 'Fournisseur créé avec succès');
      queryClient.invalidateQueries({ queryKey: ['fournisseurs'] });
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
              {fournisseur ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
            </h2>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                {...register("nom")}
                label="Nom"
                errorMessage={errors.nom?.message}
              />

              <Input
                {...register("email")}
                type="email"
                label="Email"
                errorMessage={errors.email?.message}
              />

              <Input
                {...register("telephone")}
                type="tel"
                label="Téléphone"
                errorMessage={errors.telephone?.message}
              />

              <Input
                {...register("adresse")}
                label="Adresse"
                errorMessage={errors.adresse?.message}
              />

              <Input
                {...register("rccm")}
                label="Numéro RCCM"
                errorMessage={errors.rccm?.message}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Annuler
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              {fournisseur ? 'Modifier' : 'Créer'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}