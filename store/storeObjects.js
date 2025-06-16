import { useServiceStore } from "./store"

export const stores=()=>{
    const {etudiants,fillEtudiants,fillInscrits}=useServiceStore()
    return [etudiants]
}