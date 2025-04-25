import { IFournisseur } from "./fournisseur";
import { IRubrique } from "./rubrique";
import { ISuccursale } from "./succursale";
import { IUtilisateur } from "./utilisateur";

export type IRecette = {
  id: string;
  montant: number;
  devise: string;
  dateRecette:Date;
  rubriqueId: number;
  rubrique: IRubrique;
  succursaleId: string;
  succursale: ISuccursale;
  observation?: string;
  fournisseur?: IFournisseur;
  utilisateur: IUtilisateur;
  estCloturee: "N" | "OL" | "OG";
  status: "A" | "D" | "S";
};
