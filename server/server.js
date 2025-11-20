import express from "express";
import cors from "cors";
import SwissEPH from "sweph-wasm";                     
import planetRoutes from "./routes/planetsRoutes.js";
import { PLANETS } from "./api/planets.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/planets", planetRoutes);

let swe;

function initSwissEPH() {
    return new Promise((resolve, reject) => {
        SwissEPH().then((sweModule) => {
            swe = sweModule;
            resolve();
        });
    });
}

export { swe, initSwissEPH };

app.get("/api/planets", (req, res) => {
    try {
        const { jd, planet } = req.query;

        if (!jd || !planet) {
            return res.status(400).json({ error: "Missing required query parameters." });
        }

        const planetMap = {
            sun: swe.SE_SUN,
            moon: swe.SE_MOON,
            mercury: swe.SE_MERCURY,
            venus: swe.SE_VENUS,
            mars: swe.SE_MARS,
            jupiter: swe.SE_JUPITER,
            saturn: swe.SE_SATURN,
            uranus: swe.SE_URANUS,
            neptune: swe.SE_NEPTUNE,
            pluto: swe.SE_PLUTO,
        };

        const planetId = planetMap[planet.toLowerCase()];
        if (!planetId) {
            return res.status(400).json({ error: "Invalid planet name." });
        }

        const result = swe.swe_calc(Number(jd), planetId, swe.SEFLG_SWIEPH);
        return res.status(200).json({ planet, jd, longitude: result.longitude, latitude: result.latitude, distance: result.distance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

app.listen(3001, async () => {
    console.log("Server is running on port 3001");
    initSwissEPH
    console.log("Swiss Ephemeris initialized");
});

