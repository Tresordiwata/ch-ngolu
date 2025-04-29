import { IDepense } from "./depense";
import { IRecette } from "./recette";
import { IVersement } from "./versement";

export type IDashboard = {
  depenses?: IDepense[];
  recettes?: IRecette[];
  versements?: IVersement[];
};