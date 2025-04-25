import { ISuccursale } from "./succursale";

export type IUtilisateur = {
  id: String;
  email: String;
  motDePasse: String;
  nom: String;
  prenom: String;
  role: "ADMIN_GENERAL" | "ADMIN_SUCCURSALE" | "UTILISATEUR";
  estActif: Boolean;
  succursale: ISuccursale;
  succursaleId: String;
  Status: String;
};
