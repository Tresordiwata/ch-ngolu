'use client';

import { Card, CardBody, CardHeader, Button, Input } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Plus, FileUp, Filter, Mail, Phone, Building, FileText } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { FournisseurForm } from "./components/fournisseur-form";

interface Fournisseur {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  rccm: string;
  createdAt: string;
}

export default function FournisseursPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: fournisseurs, isLoading } = useQuery<Fournisseur[]>({
    queryKey: ['fournisseurs'],
    queryFn: async () => {
      const response = await fetch('/api/fournisseurs');
      if (!response.ok) throw new Error('Erreur lors du chargement des fournisseurs');
      return response.json();
    },
  });

  const handleEdit = (fournisseur: Fournisseur) => {
    setSelectedFournisseur(fournisseur);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setSelectedFournisseur(undefined);
    setIsFormOpen(false);
  };

  const filteredFournisseurs = fournisseurs?.filter(fournisseur => {
    const searchString = searchTerm.toLowerCase();
    return fournisseur.nom.toLowerCase().includes(searchString) ||
           fournisseur.email.toLowerCase().includes(searchString) ||
           fournisseur.telephone.includes(searchString) ||
           fournisseur.rccm.toLowerCase().includes(searchString);
  });

  const exportData = {
    title: "Liste des Fournisseurs",
    headers: ["Nom", "Email", "Téléphone", "Adresse", "RCCM", "Date d'ajout"],
    rows: filteredFournisseurs?.map(fournisseur => [
      fournisseur.nom,
      fournisseur.email,
      fournisseur.telephone,
      fournisseur.adresse,
      fournisseur.rccm,
      new Date(fournisseur.createdAt).toLocaleDateString('fr-FR'),
    ]) || [],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Fournisseurs</h1>
        <div className="flex gap-2">
          <Button 
            color="primary" 
            startContent={<Plus />}
            onPress={() => setIsFormOpen(true)}
          >
            Nouveau Fournisseur
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
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFournisseurs?.map((fournisseur) => (
              <Card key={fournisseur.id} className="bg-content2">
                <CardBody className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{fournisseur.nom}</h3>
                      <p className="text-sm text-gray-500">
                        Ajouté le {new Date(fournisseur.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      color="primary" 
                      variant="light"
                      onPress={() => handleEdit(fournisseur)}
                    >
                      Modifier
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>{fournisseur.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{fournisseur.telephone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-primary" />
                      <span>{fournisseur.adresse}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>RCCM: {fournisseur.rccm}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      <FournisseurForm
        isOpen={isFormOpen}
        onClose={handleClose}
        fournisseur={selectedFournisseur}
      />

     
    </div>
  );
}