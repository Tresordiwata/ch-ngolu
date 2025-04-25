'use client';

import { Card, CardBody, CardHeader } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingDown, 
  TrendingUp, 
  Users, 
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { Spinner } from "@heroui/react";

interface SuccursaleStats {
  totalDepenses: number;
  totalEntrees: number;
  solde: number;
  nombreUtilisateurs: number;
  depensesPlanifiees: number;
  operationsNonCloturees: number;
  operationsDuJour: number;
}

interface ActiviteRecente {
  id: string;
  type: 'DEPENSE' | 'ENTREE';
  montant: number;
  description: string;
  date: string;
  utilisateur: {
    nom: string;
    prenom: string;
  };
}

export default function DashboardPage() {
  const utilisateur = useAuthStore((state) => state.utilisateur);

  const { data: stats, isLoading: statsLoading } = useQuery<SuccursaleStats>({
    queryKey: ['succursale-stats', utilisateur?.succursaleId],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/succursale/${utilisateur?.succursaleId}/stats`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des statistiques');
      }
      return response.json();
    },
    enabled: !!utilisateur?.succursaleId,
  });

  const { data: activites, isLoading: activitesLoading } = useQuery<ActiviteRecente[]>({
    queryKey: ['activites-recentes', utilisateur?.succursaleId],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/succursale/${utilisateur?.succursaleId}/activites`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des activités');
      }
      return response.json();
    },
    enabled: !!utilisateur?.succursaleId,
  });

  if (statsLoading || activitesLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Bienvenue, {utilisateur?.prenom} {utilisateur?.nom}
        </h1>
        <p className="text-gray-600">
          Voici un aperçu de la situation financière de votre succursale
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white">
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Entrées</p>
              <p className="text-xl font-bold text-success">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XOF',
                }).format(stats?.totalEntrees || 0)}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white">
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-danger/10">
              <TrendingDown className="w-6 h-6 text-danger" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Dépenses</p>
              <p className="text-xl font-bold text-danger">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XOF',
                }).format(stats?.totalDepenses || 0)}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white">
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-success/10">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Solde</p>
              <p className={`text-xl font-bold ${(stats?.solde || 0) >= 0 ? 'text-success' : 'text-danger'}`}>
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XOF',
                }).format(stats?.solde || 0)}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white">
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-warning/10">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Non Clôturées</p>
              <p className="text-xl font-bold">
                {stats?.operationsNonCloturees || 0}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Activités Récentes</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {activites?.map((activite) => (
                <div key={activite.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-3">
                    {activite.type === 'ENTREE' ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-danger" />
                    )}
                    <div>
                      <p className="font-medium">{activite.description}</p>
                      <p className="text-sm text-gray-500">
                        {activite.utilisateur.prenom} {activite.utilisateur.nom}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      activite.type === 'ENTREE' ? 'text-success' : 'text-danger'
                    }`}>
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF',
                      }).format(activite.montant)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(activite.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Informations Complémentaires</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Utilisateurs Actifs</span>
                </div>
                <span className="font-bold">{stats?.nombreUtilisateurs}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Dépenses Planifiées</span>
                </div>
                <span className="font-bold text-warning">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF',
                  }).format(stats?.depensesPlanifiees || 0)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Opérations du Jour</span>
                </div>
                <span className="font-bold">{stats?.operationsDuJour}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}