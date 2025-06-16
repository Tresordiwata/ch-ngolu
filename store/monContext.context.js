import { createContext } from "react";

const servicesContext=createContext({
    nom:"test",
    setNom:(v)=>{
        nom=v
    }
})

export default  servicesContext;