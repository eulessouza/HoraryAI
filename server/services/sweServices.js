import Swe from "sweph-wasm";
import { PLANETS } from "../api/planets.js";

let sweInstance;

async function initSwe() {
  if (!sweInstance) {
    sweInstance = new Swe();
    await sweInstance.initialize();
    sweInstance.set_ephe_path("data/ephemerides/");
  }
}

export const calculatePlanet = async (date, planetId) => {
  await initSwe();
  const jd = sweInstance.julday(date);
  const result = sweInstance.swe_calc(jd, planetId, sweInstance.SEFLG_SWIEPH);
  return { planetId, date, position: result };
};

export default { calculatePlanet };