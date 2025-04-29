/* eslint-disable prettier/prettier */
'use client';

import { Card, CardBody, CardHeader, Button, Input, Select, SelectItem } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Plus, FileUp, Filter, UserPlus } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import UtilisateurForm  from "./components/utilisateur-form";
import  PDFExport from "../components/pdf-export";

interface Utilisateur {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'ADMIN_GENERAL' | 'ADMIN_SUCCURSALE' | 'UTILISATEUR';
  estActif: boolean;
  succursale: {
    nom: string;
  };
  createdAt: string;
}

export default function UtilisateursPage() {
  // const utilisateur = useAuthStore((state) => state.utilisateur);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedUtilisateur, setSelectedUtilisateur] = useState<Utilisateur | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("tous");
  const [statutFilter, setStatutFilter] = useState("tous");

  const { data: utilisateurs, isLoading } = useQuery<Utilisateur[]>({
    queryKey: ['utilisateurs'],
    queryFn: async () => {
      const response = await fetch('/api/utilisateurs');
      if (!response.ok) throw new Error('Erreur lors du chargement des utilisateurs');
      return response.json();
    },
  });

  const handleEdit = (utilisateur: Utilisateur) => {
    setSelectedUtilisateur(utilisateur);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setSelectedUtilisateur(undefined);
    setIsFormOpen(false);
  };

  const filteredUtilisateurs = utilisateurs?.filter(user => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      user.nom.toLowerCase().includes(searchString) ||
      user.prenom.toLowerCase().includes(searchString) ||
      user.email.toLowerCase().includes(searchString);
    
    const matchesRole = roleFilter === "tous" || user.role === roleFilter;
    const matchesStatut = statutFilter === "tous" || 
      (statutFilter === "actifs" && user.estActif) ||
      (statutFilter === "inactifs" && !user.estActif);

    return matchesSearch && matchesRole && matchesStatut;
  });

  const exportData = {
    title: "Liste des Utilisateurs",
    headers: ["Nom", "Prénom", "Email", "Rôle", "Succursale", "Statut", "Date d'ajout"],
    rows: filteredUtilisateurs?.map(user => [
      user.nom,
      user.prenom,
      user.email,
      user.role,
      user.succursale?.nom || '-',
      user.estActif ? 'Actif' : 'Inactif',
      new Date(user.createdAt).toLocaleDateString('fr-FR'),
    ]) || [],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
        <div className="flex gap-2">
          <Button 
            color="primary" 
            startContent={<UserPlus />}
            onPress={() => setIsFormOpen(true)}
          >
            Nouvel Utilisateur
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<Filter className="w-4 h-4 text-gray-400" />}
            />
            <Select
              label="Rôle"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <SelectItem key="tous">Tous</SelectItem>
              <SelectItem key="ADMIN_GENERAL" >Admin Général</SelectItem>
              <SelectItem key="ADMIN_SUCCURSALE">Admin Succursale</SelectItem>
              <SelectItem key="UTILISATEUR" >Utilisateur</SelectItem>
            </Select>
            <Select
              label="Statut"
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
            >
              <SelectItem key="tous" >Tous</SelectItem>
              <SelectItem key="actifs" >Actifs</SelectItem>
              <SelectItem key="inactifs" >Inactifs</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Nom</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Rôle</th>
                  <th className="text-left py-3 px-4">Succursale</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUtilisateurs?.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3 px-4">
                      {user.prenom} {user.nom}
                    </td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'ADMIN_GENERAL' 
                          ? 'bg-primary/10 text-primary'
                          : user.role === 'ADMIN_SUCCURSALE'
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-default/10 text-default-600'
                      }`}>
                        {user.role === 'ADMIN_GENERAL' 
                          ? 'Admin Général'
                          : user.role === 'ADMIN_SUCCURSALE'
                          ? 'Admin Succursale'
                          : 'Utilisateur'
                        }
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.succursale?.nom || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.estActif 
                          ? 'bg-success/10 text-success'
                          : 'bg-danger/10 text-danger'
                      }`}>
                        {user.estActif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button 
                        size="sm" 
                        color="primary" 
                        variant="light"
                        onPress={() => handleEdit(user)}
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

      {/* <UtilisateurForm
        isOpen={isFormOpen}
        onClose={handleClose}
        utilisateur={selectedUtilisateur}
      /> */}

      {/* <PDFExport
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={exportData}
      /> */}
    </div>
  );
}