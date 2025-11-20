import React from "react";
import { usePlanet } from "../hooks/usePlanet";

const planetInfo = ({ date, planetId }) => {
    const { data, loading, error } = usePlanet(date, planetId);
    
    if (loading) return <p>Loading planet data...</p>;
    if (error) return <p>Error loading planet data: {error.message}</p>;
    if (!data) return <p>No planet data available.</p>;

    return (
        <div>
            <h2>{data.name}</h2>
            <p>Longitude: {data.longitude}</p>
            <p>Latitude: {data.latitude}</p>
        </div>
    );
};

export default planetInfo;