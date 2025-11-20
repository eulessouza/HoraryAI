import PlanetPosition from "./PlanetPosition";

function PlanetList({ planets }) {
    if (!planets || planets.length === 0) return <p>No planet data available.</p>;

    return (
        <div style={{ display: "grid", gap: "10px" }}>
            {planets.map((planet) => (
                <PlanetPosition key={planet.name} planet={planet} />
            ))}
        </div>
    );      
}

export default PlanetList;