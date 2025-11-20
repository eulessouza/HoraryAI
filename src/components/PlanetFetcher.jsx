import { useState } from "react";
import { useFetch } from "../hooks/useFetch";

async function fetchPlanet() {
}

export function PlanetFetcher() {
    const [query, setQuery] = useState({
        year: 2025,
        month: 11,
        day: 19,
        hour: 22,
    });

    const url = `/api/planets?year=${query.year}&month=${query.month}&day=${query.day}&hour=${query.hour}`;
    const { data: planets, loading, error } = useFetch(url);

    const handleChange = (e) => {
        setQuery({ ...query, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={{marginBottom: "1rem"}}>
                <input
                    type="number"
                    name="year"
                    value={query.year}
                    onChange={handleChange}
                    placeholder="Year"
                />
                <input
                    type="number"
                    name="month"
                    value={query.month}
                    onChange={handleChange}
                    placeholder="Month"
                    min="1"
                    max="12"
                />
                <input
                    type="number"
                    name="day"
                    value={query.day}
                    onChange={handleChange}
                    placeholder="Day"
                    min="1"
                    max="31"
                />
                <input
                    type="number"
                    name="hour"
                    value={query.hour}
                    onChange={handleChange}
                    placeholder="Hour"
                    min="0"
                    max="23.99"
                    step="0.01"
                />
                <button type="submit">Buscar Planetas</button>
            </form>

            {loading && <p>Carregando posições planetarias...</p>}
            {error && <p>Erro: {error.message ? error.message : String(error)}</p>}
            {Array.isArray(planets) && planets.length > 0 && (
                <ul>
                    {planets.map((p) => (
                        <li key={p.name}>
                            <strong>{p.name}</strong>: {p.longitude.toFixed(2)}°
                        </li>
                    ))}
                </ul>
            )}      
        </div>
    );
}

export function fetchPlanets() {
    fetchPlanet();
}

export default PlanetFetcher;