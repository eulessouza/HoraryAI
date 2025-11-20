import { useState, useEffect } from "react";

export const usePlanet = (date, planetId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!date || !planetId === undefined) return;

        const fetchPlanet = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/planets?date=${date}&planet=${planetId}`);

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const result = await response.json();
                setData(result);
            }catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlanet();
    }, [date, planetId]);
    return { data, loading, error };
};

export default usePlanet;