import { IFournisseur } from "./fournisseur";
import { IRubrique } from "./rubrique";
import { ISuccursale } from "./succursale";
import { IUtilisateur } from "./utilisateur";

export type IDepense = {
  id: string;
  montant: number;
  devise:string,
  description: string;
  dateDepense: Date;
  rubriqueId:number
  rubrique:IRubrique;
  fournisseur?: IFournisseur;
  utilisateur: IUtilisateur;
  estCloturee: "N" | "OL" | "OG";
  beneficiaire:string;
  succursale:ISuccursale,
  succursaleId:string
};
