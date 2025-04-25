import { ISuccursale } from "@/lib/types/succursale"
import { IUtilisateur } from "@/lib/types/utilisateur"

export const getUtilisateurs=async()=>{
    let resultat=[]
    const requete=await fetch("/api/utilisateurs")
    resultat=await requete.json() as IUtilisateur[]
    return resultat
}