import { ISuccursale } from "@/lib/types/succursale"

export const getSuccursales=async()=>{
    let resultat=[]
    const requete=await fetch("/api/succursales")
    resultat=await requete.json() as ISuccursale[]
    return resultat
}