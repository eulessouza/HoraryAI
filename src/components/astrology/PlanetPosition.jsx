import Card from "../ui/Card";

function PlanetPosition({ planet }) {
    if (!planet) return null; // No planet provided
    
    return (
        <Card style={{ padding: '20px', marginTop: '20px' }}>
            <h3>{planet.name}</h3>
            <p>Posição: {planet.position}</p>
        </Card>
    );
}

export default PlanetPosition;  