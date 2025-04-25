'use client';

import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Plus, FileUp, Filter } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { BudgetForm } from "./components/budget-form";
import { PDFExport } from "../components/pdf-export";

interface Budget {
  id: string;
  categorie: string;
  montantAlloue: number;
  montantUtilise: number;
  periode: 'mensuel' | 'trimestriel' | 'annuel';
  dateDebut: string;
  dateFin: string;
  createdAt: string;
}

export default function BudgetsPage() {
  const utilisateur = useAuthStore((state) => state.utilisateur);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [periodeFilter, setPeriodeFilter] = useState("tous");

  const { data: budgets, isLoading } = useQuery<Budget[]>({
    queryKey: ['budgets', utilisateur?.succursaleId],
    queryFn: async () => {
      const response = await fetch(`/api/budgets?succursaleId=${utilisateur?.succursaleId}`);
      if (!response.ok) throw new Error('Erreur lors du chargement des budgets');
      return response.json();
    },
    enabled: !!utilisateur?.succursaleId,
  });

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setSelectedBudget(undefined);
    setIsFormOpen(false);
  };

  const filteredBudgets = budgets?.filter(budget => {
    const matchesSearch = budget.categorie.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriode = periodeFilter === "tous" || budget.periode === periodeFilter;
    return matchesSearch && matchesPeriode;
  });

  const exportData = {
    title: "Liste des Budgets",
    headers: ["Catégorie", "Montant Alloué", "Montant Utilisé", "Période", "Date Début", "Date Fin"],
    rows: filteredBudgets?.map(budget => [
      budget.categorie,
      budget.montantAlloue,
      budget.montantUtilise,
      budget.periode,
      new Date(budget.dateDebut).toLocaleDateString('fr-FR'),
      new Date(budget.dateFin).toLocaleDateString('fr-FR'),
    ]) || [],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Budgets</h1>
        <div className="flex gap-2">
          <Button 
            color="primary" 
            startContent={<Plus />}
            onPress={() => setIsFormOpen(true)}
          >
            Nouveau Budget
          </Button>
          <Button 
            color="secondary" 
            startContent={<FileUp />}
            onPress={() => setIsExportOpen(true)}
          >
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
            <Select
              label="Période"
              value={periodeFilter}
              onChange={(e) => setPeriodeFilter(e.target.value)}
            >
              <SelectItem key="tous" value="tous">Tous</SelectItem>
              <SelectItem key="mensuel" value="mensuel">Mensuel</SelectItem>
              <SelectItem key="trimestriel" value="trimestriel">Trimestriel</SelectItem>
              <SelectItem key="annuel" value="annuel">Annuel</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBudgets?.map((budget) => {
          const pourcentageUtilisation = (budget.montantUtilise / budget.montantAlloue) * 100;
          const estDepassement = pourcentageUtilisation > 100;
          const estProcheSeuil = pourcentageUtilisation >= 80 && pourcentageUtilisation <= 100;

          return (
            <Card key={budget.id} className="bg-content2">
              <CardBody className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{budget.categorie}</h3>
                    <p className="text-sm text-gray-500 capitalize">{budget.periode}</p>
                  </div>
                  <Button 
                    size="sm" 
                    color="primary" 
                    variant="light"
                    onPress={() => handleEdit(budget)}
                  >
                    Modifier
                  </Button>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progression</span>
                    <span className={`font-semibold ${
                      estDepassement ? 'text-danger' : 
                      estProcheSeuil ? 'text-warning' : 
                      'text-success'
                    }`}>
                      {pourcentageUtilisation.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-default-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        estDepassement ? 'bg-danger' : 
                        estProcheSeuil ? 'bg-warning' : 
                        'bg-success'
                      }`}
                      style={{ width: `${Math.min(pourcentageUtilisation, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Alloué</p>
                    <p className="font-semibold">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF',
                      }).format(budget.montantAlloue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Utilisé</p>
                    <p className={`font-semibold ${
                      estDepassement ? 'text-danger' : ''
                    }`}>
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF',
                      }).format(budget.montantUtilise)}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  <p>Du {new Date(budget.dateDebut).toLocaleDateString('fr-FR')}</p>
                  <p>Au {new Date(budget.dateFin).toLocaleDateString('fr-FR')}</p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <BudgetForm
        isOpen={isFormOpen}
        onClose={handleClose}
        budget={selectedBudget}
      />

      <PDFExport
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={exportData}
      />
    </div>
  );
}