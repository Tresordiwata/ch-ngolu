"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";
import { Bell } from "lucide-react";

import { useAuthStore } from "@/lib/store/authStore";

interface Alerte {
  id: string;
  type: "depassement_budget" | "seuil_tresorerie" | "depense_importante";
  message: string;
  niveau: "info" | "warning" | "error";
  vue: boolean;
  createdAt: string;
}

export function Notifications() {
  const utilisateur = useAuthStore((state) => state.utilisateur);
  const [nonVues, setNonVues] = useState(0);

  const { data: alertes, refetch } = useQuery<Alerte[]>({
    queryKey: ["alertes", utilisateur?.succursaleId],
    queryFn: async () => {
      const response = await fetch(
        `/api/alertes?succursaleId=${utilisateur?.succursaleId}`,
      );

      if (!response.ok)
        throw new Error("Erreur lors du chargement des alertes");

      return response.json();
    },
    enabled: !!utilisateur?.succursaleId,
  });

  useEffect(() => {
    if (alertes) {
      setNonVues(alertes.filter((alerte) => !alerte.vue).length);
    }
  }, [alertes]);

  const marquerCommeLue = async (id: string) => {
    try {
      await fetch(`/api/alertes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vue: true }),
      });
      refetch();
    } catch (error) {
      console.error("Erreur lors du marquage de l'alerte:", error);
    }
  };

  const getNiveauStyle = (niveau: string) => {
    switch (niveau) {
      case "error":
        return "bg-danger/10 text-danger border-danger/20";
      case "warning":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button isIconOnly className="relative" variant="light">
          <Bell className="h-5 w-5" />
          {nonVues > 0 && ""}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alertes?.length === 0 ? (
              <p className="text-center text-gray-500">Aucune notification</p>
            ) : (
              alertes?.map((alerte) => (
                ""
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
