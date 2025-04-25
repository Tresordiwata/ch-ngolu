'use client';

import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { FileUp, Filter, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { toast } from "react-toastify";

interface Cloture {
  id: string;
  date: string;
  utilisateur: {
    nom: string;
    prenom: string;
  };
  totalDepenses: number;
  totalEntrees: number;
  solde: number;
}

export default function CloturesPage() {
  const utilisateur = useAuthStore((state) => state.utilisateur);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  const { data: clotures, isLoading, refetch } = useQuery<Cloture[]>({
    queryKey: ['clotures', utilisateur?.succursaleId],
    queryFn: async () => {
      const response = await fetch(`/api/clotures?succursaleId=${utilisateur?.succursaleId}`);
      if (!response.ok) throw new Error('Erreur lors du chargement des clôtures');
      return response.json();
    },
    enabled: !!utilisateur?.succursaleId,
  });

  const handleCloture = async () => {
    try {
      const response = await fetch('/api/clotures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          succursaleId: utilisateur?.succursaleId,
          utilisateurId: utilisateur?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la clôture');
      }

      toast.success('Clôture effectuée avec succès');
      refetch();
    } catch (error) {
      toast.error("Une erreur est survenue lors de la clôture");
    }
  };

  const filteredClotures = clotures?.filter(cloture => {
    const matchesSearch = 
      cloture.utilisateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cloture.utilisateur.prenom.toLowerCase().includes(searchTerm.toLowerCase());
    
    const clotureDate = new Date(cloture.date);
    const matchesDateDebut = !dateDebut || clotureDate >= new Date(dateDebut);
    const matchesDateFin = !dateFin || clotureDate <= new Date(dateFin);

    return matchesSearch && matchesDateDebut && matchesDateFin;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Historique des Clôtures</h1>
        <div className="flex gap-2">
          <Button 
            color="primary" 
            startContent={<CheckCircle2 />}
            onPress={handleCloture}
          >
            Nouvelle Clôture
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<Filter className="w-4 h-4 text-gray-400" />}
            />
            <Input
              type="date"
              label="Date début"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
            />
            <Input
              type="date"
              label="Date fin"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
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
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Utilisateur</th>
                  <th className="text-right py-3 px-4">Total Entrées</th>
                  <th className="text-right py-3 px-4">Total Dépenses</th>
                  <th className="text-right py-3 px-4">Solde</th>
                </tr>
              </thead>
              <tbody>
                {filteredClotures?.map((cloture) => (
                  <tr key={cloture.id} className="border-b">
                    <td className="py-3 px-4">
                      {new Date(cloture.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-4">
                      {cloture.utilisateur.prenom} {cloture.utilisateur.nom}
                    </td>
                    <td className="py-3 px-4 text-right text-success">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF',
                      }).format(cloture.totalEntrees)}
                    </td>
                    <td className="py-3 px-4 text-right text-danger">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF',
                      }).format(cloture.totalDepenses)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF',
                      }).format(cloture.solde)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}