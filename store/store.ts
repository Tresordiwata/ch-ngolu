import { create } from "zustand";

import { IRubrique } from "@/lib/types/rubrique";



interface Store {
  rubriques: IRubrique[];

  fillRubriques: (e: IRubrique[]) => void;
}
export const useServiceStore = create<Store>()((set) => ({
  rubriques: [],

  fillRubriques: (data: IRubrique[]) => {
    set(() => ({ rubriques: data }));
  },
 
}));
