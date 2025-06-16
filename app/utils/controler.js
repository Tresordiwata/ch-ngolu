import { useServiceStore } from "../../store/store";
import { getRubriques } from "../../services/rubriques";

export const initialize = async () => {
  // await getEtudiants().then(r => { useServiceStore.getState().fillEtudiants(r) })
  // await getInscrits().then(r => { useServiceStore.getState().fillInscrits(r) })
  await getRubriques().then((r) => {
      useServiceStore.getState().fillRubriques(r);
    //   console.log("data retournés 2:"+useServiceStore.getState().rubriques);
  });
};
