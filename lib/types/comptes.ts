
import { IBanque } from "./banques"
import { Status } from "./Status"

export type ICompte={
    id?:      string
    numero:   string
    devise:   string
    nom:      string
    banque:     IBanque
    status:     Status
}