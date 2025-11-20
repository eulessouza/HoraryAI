import Swe from "sweph-wasm";
import { PLANETS } from "../api/planets.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const wasmFsPath = join(__dirname, '..', 'node_modules', 'sweph-wasm', 'dist', 'wasm', 'swisseph.wasm');

let sweInstance;
let useFallback = false;
const FALLBACK_EPHEMERIS = [
  { name: 'Sun', longitude: 240.0 },
  { name: 'Moon', longitude: 300.5 },
  { name: 'Mercury', longitude: 120.2 },
  { name: 'Venus', longitude: 80.7 },
  { name: 'Mars', longitude: 15.3 },
  { name: 'Jupiter', longitude: 210.1 },
  { name: 'Saturn', longitude: 170.4 },
  { name: 'Uranus', longitude: 95.6 },
  { name: 'Neptune', longitude: 350.9 },
  { name: 'Pluto', longitude: 40.2 }
];

async function initSwe() {
  if (!sweInstance) {
    // Use the library's async init to correctly load the wasm and create the API instance
    // Pass explicit path to the wasm file bundled in node_modules so the loader can find it in Node.
      const wasmUrl = "http://localhost:3001/wasm/swisseph.wasm";
      try {
          sweInstance = await Swe.init(wasmUrl);
        // Try loading ephemeris files into the wasm FS from the library's default remote source.
          try {
            await sweInstance.swe_set_ephe_path("http://localhost:3001/ephe");
        } catch (err) {
          console.warn('swe_set_ephe_path failed:', err && err.message ? err.message : err);
        }
      } catch (err) {
        console.warn('sweph-wasm init via HTTP failed:', err && err.message ? err.message : err);
        // Fallback: attempt to read the wasm directly from disk and initialize the module using buffer
        try {
          if (fs.existsSync(wasmFsPath)) {
            const wasmBuffer = fs.readFileSync(wasmFsPath);
            console.log('Read swisseph.wasm from disk:', wasmFsPath, 'size:', wasmBuffer.length);
            try {
              // Directly import the Emscripten factory that builds the WASM module
              const swCjsPath = join(__dirname, '..', '..', 'node_modules', 'sweph-wasm', 'dist', 'wasm', 'swisseph.cjs');
              let swFactory;
              try {
                // dynamic import works with ESM; use require fallback if necessary
                swFactory = (await import(swCjsPath)).default || (await import(swCjsPath));
              } catch (impErr) {
                // try require
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                swFactory = require(swCjsPath).default || require(swCjsPath);
              }

              const moduleObj = await swFactory({ wasmBinary: wasmBuffer });
              // Construct the high-level wrapper instance (the export from dist/index.cjs is a class)
              sweInstance = new Swe(moduleObj);
              console.log('sweph-wasm initialized from disk via swisseph.cjs + wasmBinary');

              // Try setting ephemeris path: try file://, local dir, and HTTP
              try {
                const epheLocalFile = 'file://' + join(__dirname, 'data', 'ephemerides').replace(/\\/g, '/');
                await sweInstance.swe_set_ephe_path(epheLocalFile).catch(() => {});
                await sweInstance.swe_set_ephe_path(join(__dirname, 'data', 'ephemerides')).catch(() => {});
                await sweInstance.swe_set_ephe_path('http://localhost:3001/ephe').catch(() => {});
              } catch (setErr) {
                console.warn('swe_set_ephe_path (disk init) warnings:', setErr && setErr.message ? setErr.message : setErr);
              }
            } catch (modErr) {
              console.error('Failed to initialize swisseph.cjs with wasmBinary:', modErr && modErr.stack ? modErr.stack : modErr);
              useFallback = true;
              sweInstance = null;
            }
          } else {
            console.warn('wasm file not found on disk at', wasmFsPath);
            useFallback = true;
            sweInstance = null;
          }
        } catch (fdErr) {
          console.warn('Failed to initialize sweph-wasm from disk, enabling fallback:', fdErr && fdErr.message ? fdErr.message : fdErr);
          useFallback = true;
          sweInstance = null;
        }
      }
  }
}

export async function initSwissEPH() {
  await initSwe();
}

export const calculatePlanet = async (date, planetId) => {
  await initSwe();
  let jd;
  // if date is numeric, treat as Julian Day
  if (typeof date === "number" && !isNaN(date)) {
    jd = date;
  } else {
    // try parsing ISO date string
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      // fallback: try if caller already passed a jd-like string
      const maybeJd = Number(date);
      if (!isNaN(maybeJd)) jd = maybeJd;
      else throw new Error("Invalid date parameter for ephemeris calculation");
    } else {
      jd = parsed.getTime() / 86400000 + 2440587.5;
    }
  }


      // If wasm failed to initialize, return fallback test data
      if (useFallback || !sweInstance) {
        const sample = FALLBACK_EPHEMERIS[planetId] || { name: 'Unknown', longitude: 0 };
        return { planetId, jd, position: { longitude: sample.longitude, latitude: 0, distance: 0 } };
      }

      // Call into the wasm binding
      const result = sweInstance.swe_calc(jd, planetId, sweInstance.SEFLG_SWIEPH);
      return { planetId, jd, position: result };
};

export default { calculatePlanet };