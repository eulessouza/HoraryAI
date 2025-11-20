import express from "express";
import cors from "cors";
import planetRoutes from "./routes/planetsRoutes.js";
import { PLANETS } from "./api/planets.js";
import { calculatePlanet } from "./services/sweServices.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Process-level listeners to capture unexpected exits or rejections during startup
process.on('uncaughtException', (err) => {
    console.error('uncaughtException:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason, p) => {
    console.error('unhandledRejection at:', p, 'reason:', reason);
});
process.on('beforeExit', (code) => {
    console.log('process beforeExit:', code);
});
process.on('exit', (code) => {
    console.log('process exit:', code);
});

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
// Serve the wasm binary from the package so sweph-wasm can fetch it via HTTP
const wasmStaticPath = join(__dirname, '..', 'node_modules', 'sweph-wasm', 'dist', 'wasm');
console.log('Serving wasm from', wasmStaticPath);
// Log requests for /wasm before static handling to capture requests
app.use('/wasm', (req, res, next) => {
    console.log(`[wasm] ${req.method} ${req.originalUrl} Host:${req.headers.host}`);
    next();
});
app.use('/wasm', express.static(wasmStaticPath));
// Serve local ephemeris files from server/data/ephemerides (where your ephemeris files are)
const epheStaticPath = join(__dirname, 'data', 'ephemerides');
console.log('Serving ephe from', epheStaticPath);
// Log requests for /ephe before static handling
app.use('/ephe', (req, res, next) => {
    console.log(`[ephe] ${req.method} ${req.originalUrl} Host:${req.headers.host}`);
    next();
});
app.use('/ephe', express.static(epheStaticPath));
app.use("/api/planets", planetRoutes);

let swe;

// Using the Swe service wrapper in server/services/sweServices.js

app.get("/api/planets", async (req, res) => {
    try {
        const { date, planet } = req.query;
        if (!planet || !date) {
            return res.status(400).json({ error: "Missing required query parameters. Provide 'planet' and 'date'." });
        }

        // Resolve planet id: allow numeric index or name mapping from PLANETS
        let planetId = null;
        if (!isNaN(Number(planet))) planetId = Number(planet);
        else {
            const name = String(planet).toUpperCase();
            planetId = PLANETS[name] ?? null;
        }

        if (planetId === null || planetId === undefined) {
            return res.status(400).json({ error: "Invalid planet identifier." });
        }

        // Delegate calculation to sweServices which handles initialization and ephemeris path
        const calc = await calculatePlanet(date, planetId);
        return res.status(200).json(calc);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

// Debug route: try to send the wasm file directly
app.get('/_debug/send-wasm', (req, res) => {
    const file = join(__dirname, '..', 'node_modules', 'sweph-wasm', 'dist', 'wasm', 'swisseph.wasm');
    console.log('Attempting to send file via res.sendFile:', file);
    res.sendFile(file, (err) => {
        if (err) {
            console.error('sendFile error:', err);
            res.status(500).send('sendFile error: ' + String(err));
        }
    });
});

// Debug route: list ephemeris files
app.get('/_debug/ephe-list', (req, res) => {
    fs.readdir(epheStaticPath, (err, files) => {
        if (err) {
            console.error('Failed to read ephe dir:', err);
            return res.status(500).json({ error: 'Failed to read ephe directory', details: String(err) });
        }
        return res.status(200).json({ path: epheStaticPath, count: files.length, files });
    });
});

// Debug route: attempt to stream the wasm file via fs.readFile (explicit)
app.get('/_debug/wasm-read', (req, res) => {
    const file = join(wasmStaticPath, 'swisseph.wasm');
    console.log('Attempting to read and send wasm via fs.readFile:', file);
    fs.readFile(file, (err, data) => {
        if (err) {
            console.error('fs.readFile error:', err);
            return res.status(500).json({ error: 'fs.readFile error', details: String(err) });
        }
        res.setHeader('Content-Type', 'application/wasm');
        return res.status(200).send(data);
    });
});

app.listen(3001, async () => {
    console.log("Server is running on port 3001");
    try {
        // await initSwissEPH(); // Removed as we are using calculatePlanet
        console.log("Swiss Ephemeris initialized");
    } catch (err) {
        console.error("Failed to initialize Swiss Ephemeris:", err);
    }
});
// Debug: keep process alive to allow external HTTP requests and debugging
setInterval(() => {}, 1e6);

