"use client";

import { Card, CardBody, CardHeader, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/lib/store/authStore";

interface StatsPeriode {
  totalDepenses: number;
  totalEntrees: number;
  solde: number;
  nombreOperations: number;
  depensesParType: {
    type: string;
    montant: number;
  }[];
  entreesParType: {
    type: string;
    montant: number;
  }[];
  evolutionSolde: {
    date: string;
    solde: number;
  }[];
  operationsParJour: {
    date: string;
    depenses: number;
    entrees: number;
  }[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function ReportingPage() {
  const utilisateur = useAuthStore((state) => state.utilisateur);
  const [periode, setPeriode] = useState("7");

  const { data: stats, isLoading } = useQuery<StatsPeriode>({
    queryKey: ["stats", utilisateur?.succursaleId, periode],
    queryFn: async () => {
      const dateDebut = periode === "mois"? format(startOfMonth(new Date()), "yyyy-MM-dd"): format(subDays(new Date(), parseInt(periode)), "yyyy-MM-dd");
      
      const dateFin = periode === "mois"
        ? format(endOfMonth(new Date()), "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd");

      const response = await fetch(
        `/api/reporting?succursaleId=${utilisateur?.succursaleId}&dateDebut=${dateDebut}&dateFin=${dateFin}`
      );
      if (!response.ok) throw new Error("Erreur lors du chargement des statistiques");
      return response.json();
    },
    enabled: !!utilisateur?.succursaleId,
  });

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(montant);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reporting Financier</h1>
        <Select
          className="max-w-xs"
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
        >
          <SelectItem key="7" value="7">7 derniers jours</SelectItem>
          <SelectItem key="15" value="15">15 derniers jours</SelectItem>
          <SelectItem key="30" value="30">30 derniers jours</SelectItem>
          <SelectItem key="mois" value="mois">Mois en cours</SelectItem>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="text-center">
            <h3 className="text-xl font-semibold mb-2">Total Entrées</h3>
            <p className="text-2xl font-bold text-success">
              {formatMontant(stats?.totalEntrees || 0)}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <h3 className="text-xl font-semibold mb-2">Total Dépenses</h3>
            <p className="text-2xl font-bold text-danger">
              {formatMontant(stats?.totalDepenses || 0)}
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center">
            <h3 className="text-xl font-semibold mb-2">Solde</h3>
            <p className={`text-2xl font-bold ${(stats?.solde || 0) >= 0 ? "text-success" : "text-danger"}`}>
              {formatMontant(stats?.solde || 0)}
            </p>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Évolution du solde</h3>
          </CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats?.evolutionSolde}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), "dd/MM", { locale: fr })}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatMontant(value)}
                    labelFormatter={(date) => format(new Date(date), "dd MMMM yyyy", { locale: fr })}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="solde"
                    name="Solde"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Opérations par jour</h3>
          </CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats?.operationsParJour}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), "dd/MM", { locale: fr })}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatMontant(value)}
                    labelFormatter={(date) => format(new Date(date), 'dd MMMM yyyy', { locale: fr })}
                  />
                  <Legend />
                  <Bar
                    dataKey="entrees"
                    name="Entrées"
                    fill="hsl(var(--chart-2))"
                  />
                  <Bar
                    dataKey="depenses"
                    name="Dépenses"
                    fill="hsl(var(--chart-3))"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Répartition des dépenses</h3>
          </CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.depensesParType}
                    dataKey="montant"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.type} (${((entry.percent || 0) * 100).toFixed(1)}%)`}
                  >
                    {stats?.depensesParType.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatMontant(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Répartition des entrées</h3>
          </CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.entreesParType}
                    dataKey="montant"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.type} (${((entry.percent || 0) * 100).toFixed(1)}%)`}
                  >
                    {stats?.entreesParType.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatMontant(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}