'use client';

import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Plus, FileUp, Filter, Calendar } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { DepensePlanifieeForm } from "./components/depense-planifiee-form";

interface DepensePlanifiee {
  id: string;
  montant: number;
  description: string;
  jourDuMois: number;
  createdAt: string;
}

export default function DepensesPlanifieesPage() {
  const utilisateur = useAuthStore((state) => state.utilisateur);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDepense, setSelectedDepense] = useState<DepensePlanifiee | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: depensesPlanifiees, isLoading } = useQuery<DepensePlanifiee[]>({
    queryKey: ['depenses-planifiees', utilisateur?.succursaleId],
    queryFn: async () => {
      const response = await fetch(`/api/depenses-planifiees?succursaleId=${utilisateur?.succursaleId}`);
      if (!response.ok) throw new Error('Erreur lors du chargement des dépenses planifiées');
      return response.json();
    },
    enabled: !!utilisateur?.succursaleId,
  });

  const handleEdit = (depense: DepensePlanifiee) => {
    setSelectedDepense(depense);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setSelectedDepense(undefined);
    setIsFormOpen(false);
  };

  const filteredDepenses = depensesPlanifiees?.filter(depense => {
    const matchesSearch = depense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      depense.montant.toString().includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dépenses Planifiées</h1>
        <div className="flex gap-2">
          <Button 
            color="primary" 
            startContent={<Plus />}
            onPress={() => setIsFormOpen(true)}
          >
            Nouvelle Dépense Planifiée
          </Button>
          <Button color="secondary" startContent={<FileUp />}>
            Exporter
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Filtres</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<Filter className="w-4 h-4 text-gray-400" />}
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Jour du mois</th>
                  <th className="text-right py-3 px-4">Montant</th>
                  <th className="text-left py-3 px-4">Date de création</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepenses?.map((depense) => (
                  <tr key={depense.id} className="border-b">
                    <td className="py-3 px-4">{depense.description}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>Le {depense.jourDuMois}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF',
                      }).format(depense.montant)}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(depense.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4">
                      <Button 
                        size="sm" 
                        color="primary" 
                        variant="light"
                        onPress={() => handleEdit(depense)}
                      >
                        Modifier
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <DepensePlanifieeForm
        isOpen={isFormOpen}
        onClose={handleClose}
        depense={selectedDepense}
      />
    </div>
  );
}