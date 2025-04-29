import { ClotureStatus } from "@prisma/client";
import { ICompte } from "./comptes";
import { ISuccursale } from "./succursale";
import { IUtilisateur } from "./utilisateur";

export type IVersement = {
  id: String;
  dateVersement: Date;
  montant: Number;
  succursaleId: String;
  succursale: ISuccursale;
  compteId: String;
  compte: ICompte;
  utillisateurId: String;
  utilisateur: IUtilisateur;
  estCloture: ClotureStatus;
  createdAt: Date;
};
