import { calculatePlanet } from "../services/sweServices.js";
import { PLANETS } from "../api/planets.js";

export const getPlanets = async (req, res) => {
    console.log("getPlanets called with query:", req.query);
    
  try {
    const { date, planet } = req.query;

    if (!date || !planet) {
      return res.status(400).json({ error: "Missing required query parameters." });
    }
    const planetData = await calculatePlanet(date, planet);
    res.json({ date, planet });
  } catch (error) {
    res.status(500).json({ error: "Erro ao calcular planeta" });
  }
};

export default { getPlanets,
};