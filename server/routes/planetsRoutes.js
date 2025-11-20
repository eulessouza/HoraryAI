import express from "express";
import planetController from "../controllers/planetController.js";
import { PLANETS } from "../api/planets.js";

const router = express.Router();
router.get("/planets", planetController.getPlanets);
export default router;